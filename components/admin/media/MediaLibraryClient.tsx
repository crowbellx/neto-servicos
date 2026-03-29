'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

type MediaFile = {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
};

type Props = {
  media: MediaFile[];
};

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryClient({ media }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      formData.append('folder', 'midia');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || 'Falha no upload');
      }

      toast.success('Arquivos enviados com sucesso.');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado no upload';
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este arquivo?');
    if (!confirmed) return;

    setDeletingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || 'Falha ao excluir arquivo');
      }

      toast.success('Arquivo excluído com sucesso.');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao excluir';
      toast.error(message);
    } finally {
      setDeletingIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files)}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          <Upload size={18} />
          {isUploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {media.map((file) => (
          <div key={file.id} className="group relative border border-gray-200 rounded-xl overflow-hidden hover:border-laranja transition-colors bg-gray-50">
            <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
              {file.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">
                  <ImageIcon size={48} strokeWidth={1.5} />
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={file.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                  title="Baixar"
                >
                  <Download size={16} />
                </a>
                <button
                  type="button"
                  disabled={!!deletingIds[file.id]}
                  onClick={() => handleDelete(file.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-70"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 truncate" title={file.filename}>
                {file.filename}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
            </div>
          </div>
        ))}

        {media.length === 0 && <div className="col-span-full text-center py-12 text-gray-500">Nenhum arquivo encontrado.</div>}
      </div>
    </>
  );
}
