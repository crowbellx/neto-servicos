'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadDropzoneProps {
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  label?: string;
  folder?: string;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  className = '',
  label = 'Arraste imagens ou clique para selecionar',
  folder = 'uploads',
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Helper para normalizar o valor como array
  const currentImages = useMemo(() => {
    return Array.isArray(value) ? value : value ? [value] : [];
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append('files', file));
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error || 'Falha no upload');
        }

        const body = (await response.json()) as { files?: Array<{ url: string }> };
        const uploadedUrls = (body.files || []).map((file) => file.url);
        const allImages = multiple ? [...currentImages, ...uploadedUrls] : uploadedUrls;
        const limitedImages = allImages.slice(0, multiple ? maxFiles : 1);

        if (onChange) {
          onChange(multiple ? limitedImages : limitedImages[0]);
        }

        toast.success('Upload concluído com sucesso.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro inesperado no upload';
        toast.error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [currentImages, folder, maxFiles, multiple, onChange]
  );

  const removeImage = (indexToRemove: number) => {
    if (!onChange) return;
    
    const newImages = currentImages.filter((_, idx) => idx !== indexToRemove);
    onChange(multiple ? newImages : '');
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: multiple ? maxFiles : 1,
    disabled: isUploading || (!multiple && currentImages.length > 0)
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Área de Dropzone (oculta se for single image e já tiver imagem) */}
      {(!currentImages.length || multiple) && (
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            flex flex-col items-center justify-center gap-3 min-h-[160px]
            ${isDragActive ? 'border-laranja bg-orange-50' : 'border-gray-300 hover:border-laranja/50 bg-gray-50'}
            ${isDragReject ? 'border-red-500 bg-red-50' : ''}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragActive ? 'bg-laranja text-white' : 'bg-gray-200 text-gray-500'}`}>
             <UploadCloud size={24} />
          </div>
          
          <div>
            <p className="font-medium text-sm text-gray-700">
              {isUploading ? 'Processando imagem...' : isDragActive ? 'Solte as imagens aqui...' : label}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple ? `Até ${maxFiles} arquivos. ` : 'Apenas 1 arquivo. '}
              JPG, PNG, WebP (max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* Galeria de Previews */}
      {currentImages.length > 0 && (
        <div className={`mt-4 ${multiple ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : ''}`}>
          {currentImages.map((src, idx) => (
            <div key={idx} className={`relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm ${multiple ? 'aspect-square' : 'w-full max-h-[300px]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={src} 
                alt={`Upload preview ${idx}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform translate-y-2 group-hover:translate-y-0"
                  title="Remover imagem"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
