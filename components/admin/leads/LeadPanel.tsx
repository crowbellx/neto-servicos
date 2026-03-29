'use client';

import { useState } from 'react';
import { X, Mail, MessageCircle, FileSignature, Archive, Clock, User, Building, Tag } from 'lucide-react';
import { updateLeadStatus, addLeadNote } from '@/app/actions/leads';
import { toast } from 'sonner';
import { normalizeLeadStatus } from '@/lib/admin/leads';

const statusOptions = [
  { value: 'NEW', label: 'Novo' },
  { value: 'CONTACTED', label: 'Em contato' },
  { value: 'QUOTED', label: 'Orçamento enviado' },
  { value: 'CLOSED', label: 'Fechado' },
  { value: 'LOST', label: 'Sem interesse' },
];

export default function LeadPanel({
  lead,
  onClose,
  onLeadUpdated,
}: {
  lead: any;
  onClose: () => void;
  onLeadUpdated?: (leadId: string, patch: Partial<any>) => void;
}) {
  const [status, setStatus] = useState(normalizeLeadStatus(lead.status));
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState<any[]>(lead.notes || []);
  const [interactions, setInteractions] = useState<any[]>(lead.interactions || []);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const prevStatus = status;
    setStatus(newStatus);
    const res = await updateLeadStatus(lead.id, newStatus);
    if (res.success) {
      setInteractions((current) => [
        {
          id: `local-status-${Date.now()}`,
          type: 'STATUS_CHANGE',
          details: `Status alterado para ${newStatus}`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      onLeadUpdated?.(lead.id, { status: newStatus });
      toast.success('Status atualizado!');
    } else {
      setStatus(prevStatus);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSaving(true);
    const res = await addLeadNote(lead.id, noteText);
    if (res.success) {
      const newNote = {
        id: res.data?.id || `local-note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString(),
      };
      setNotes((current) => [newNote, ...current]);
      setInteractions((current) => [
        {
          id: `local-note-interaction-${Date.now()}`,
          type: 'NOTE',
          details: noteText,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      toast.success('Nota adicionada!');
      setNoteText('');
    } else {
      toast.error('Erro ao adicionar nota');
    }
    setIsSaving(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-laranja/10 flex items-center justify-center text-laranja font-bold text-2xl shrink-0">
              {lead.name?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Building size={14} /> {lead.company || 'Empresa não informada'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Status & Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
              <select 
                value={status}
                onChange={handleStatusChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Atribuído a</label>
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-laranja focus:border-laranja block p-2.5 outline-none" disabled>
                <option value="unassigned">Administrador Único</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-gray-400" /> Informações de Contato
            </h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">E-mail</span>
                <a href={`mailto:${lead.email}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                  {lead.email} <Mail size={12} />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Telefone</span>
                <a href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:underline flex items-center gap-1">
                  {lead.whatsapp} <MessageCircle size={12} />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Origem</span>
                <span className="text-sm font-medium text-gray-900">{lead.source || 'Website'}</span>
              </div>
            </div>
          </div>

          {/* Interest */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={16} className="text-gray-400" /> Interesse
            </h3>
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-laranja/10 text-laranja text-sm font-medium">
                {lead.service}
              </span>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              &quot;{lead.message}&quot;
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Histórico e Notas
            </h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
              
              {/* Render the notes dynamic */}
              {notes.map((note: any) => (
                <div key={note.id} className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <p className="text-sm text-gray-900 font-medium">Nota adicionada</p>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mt-2">
                    {note.text}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{new Date(note.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}

              {interactions
                .filter((interaction: any) => interaction.type === 'STATUS_CHANGE')
                .map((interaction: any) => (
                  <div key={interaction.id} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <p className="text-sm text-gray-900 font-medium">{interaction.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(interaction.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}

              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-laranja rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-sm text-gray-900 font-medium">Lead recebido pelo sistema</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {/* Add Note */}
          <div>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-laranja focus:border-laranja block p-4 outline-none resize-none"
              rows={3}
              placeholder="Adicionar anotação interna..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleAddNote}
                disabled={isSaving}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Salvando...' : 'Salvar nota'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
          <a href={`https://wa.me/55${lead.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors shadow-sm">
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a href={`mailto:${lead.email}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm">
            <Mail size={16} /> E-mail
          </a>
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm" title="Criar Orçamento">
            <FileSignature size={16} />
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-400 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm" title="Arquivar">
            <Archive size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
