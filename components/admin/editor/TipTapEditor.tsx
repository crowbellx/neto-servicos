'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Code, 
  Image as ImageIcon, Link as LinkIcon, Youtube as YoutubeIcon, 
  Undo, Redo, Minus
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { createSignedUploadUrl, recordMedia } from '@/app/actions/media';

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToast = toast.loading('Enviando imagem...');

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `editor/${fileName}`;

      const res = await createSignedUploadUrl(filePath);
      if (!res.success || !res.signedUrl) throw new Error(res.error || 'Erro ao gerar URL');

      const uploadRes = await fetch(res.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      
      if (!uploadRes.ok) throw new Error('Falha no upload para o Storage');

      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';
      const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

      const dbRes = await recordMedia({
        url: publicUrl,
        filename: filePath,
        type: file.type,
        size: file.size,
      });

      if (dbRes.success) {
        editor.chain().focus().setImage({ src: publicUrl }).run();
        toast.success('Imagem inserida!', { id: loadingToast });
      } else {
        throw new Error(dbRes.error || 'Erro ao registrar no banco');
      }
    } catch (error: any) {
      toast.error(`Erro no upload: ${error.message}`, { id: loadingToast });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('strike') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Code Block"
      >
        <Code size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-laranja' : 'text-gray-700'}`}
        title="Link"
      >
        <LinkIcon size={18} />
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${isUploading ? 'opacity-50 text-laranja' : 'text-gray-700'}`}
        title="Upload Image"
      >
        <ImageIcon size={18} />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL do YouTube');
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        }}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        title="YouTube"
      >
        <YoutubeIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

interface TipTapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        controls: false,
      }),
    ],
    content: value || placeholder || '<p>Comece a escrever seu post incrivel aqui...</p>',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
