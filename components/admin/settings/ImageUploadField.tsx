'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSignedUploadUrl, recordMedia } from '@/app/actions/media';

interface ImageUploadFieldProps {
  label: string;
  name?: string;
  defaultValue?: string;
  helperText?: string;
  onChange?: (url: string) => void;
}

export default function ImageUploadField({ 
  label, 
  name, 
  defaultValue, 
  helperText,
  onChange
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToast = toast.loading(`Enviando ${label}...`);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      // 1. Obter URL Assinada
      const res = await createSignedUploadUrl(filePath);
      if (!res.success || !res.signedUrl) {
        throw new Error(res.error || 'Erro ao gerar URL de upload');
      }

      // 2. Upload DIRETO do Browser para o Supabase (PUT)
      const uploadRes = await fetch(res.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Falha no upload direto para o Storage');
      }

      // 3. Registrar no Banco de Dados
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';
      const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

      const dbRes = await recordMedia({
        url: publicUrl,
        filename: filePath,
        type: file.type,
        size: file.size,
      });

      if (dbRes.success) {
        setUrl(publicUrl);
        if (onChange) onChange(publicUrl);
        toast.success(`Upload do ${label} concluído!`, { id: loadingToast });
      } else {
        throw new Error(dbRes.error || 'Erro ao registrar no banco');
      }
    } catch (error: any) {
      console.error('[Upload] Error:', error);
      toast.error(`Erro no upload: ${error.message || 'Falha desconhecida'}`, { id: loadingToast });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setUrl('');
    if (onChange) onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-900 block">{label}</label>
      
      <div className="relative group">
        {url ? (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-4">
            <img 
              src={url} 
              alt={label} 
              className="max-w-full max-h-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer aspect-[4/3]"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-laranja animate-spin mb-3" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-laranja/10 flex items-center justify-center text-laranja mb-3">
                <Upload size={20} />
              </div>
            )}
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Enviando...' : 'Fazer Upload'}
            </p>
            {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden" 
        accept="image/*, .ico, .svg"
      />
      {/* Hidden input to be sent with the parent form */}
      {name && <input type="hidden" name={name} value={url} />}
    </div>
  );
}
