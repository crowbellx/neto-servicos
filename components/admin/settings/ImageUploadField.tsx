'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface ImageUploadFieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  helperText?: string;
}

export default function ImageUploadField({ 
  label, 
  name, 
  defaultValue, 
  helperText 
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowserClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setUrl('');
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
        accept="image/*"
      />
      {/* Hidden input to be sent with the parent form */}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
