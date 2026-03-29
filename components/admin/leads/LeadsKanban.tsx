'use client';

import { MessageCircle, Mail, Eye } from 'lucide-react';
import { normalizeLeadStatus } from '@/lib/admin/leads';

const columns = [
  { id: 'NEW', title: 'Novos', color: 'bg-laranja' },
  { id: 'CONTACTED', title: 'Em contato', color: 'bg-blue-500' },
  { id: 'QUOTED', title: 'Orçamento enviado', color: 'bg-purple-500' },
  { id: 'CLOSED', title: 'Fechados', color: 'bg-green-500' },
  { id: 'LOST', title: 'Sem interesse', color: 'bg-gray-500' },
];

export default function LeadsKanban({
  leads,
  onSelectLead,
  onMoveLead,
}: {
  leads: any[];
  onSelectLead: (lead: any) => void;
  onMoveLead: (leadId: string, nextStatus: string) => void;
}) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, nextStatus: string) => {
    event.preventDefault();
    const leadId = event.dataTransfer.getData('leadId');
    if (!leadId) return;
    onMoveLead(leadId, nextStatus);
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnLeads = leads.filter((lead) => normalizeLeadStatus(lead.status) === column.id);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 flex flex-col h-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-bold text-gray-900">{column.title}</h3>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {columnLeads.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {columnLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                  onClick={() => onSelectLead(lead)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-laranja/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{lead.name}</h4>
                        <p className="text-xs text-gray-500">{lead.company || 'Sem empresa'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block bg-gray-50 text-gray-600 text-xs font-medium px-2 py-1 rounded border border-gray-100">
                      {lead.service}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {lead.message}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      {lead.preferredContact?.toLowerCase().includes('whats') ? (
                        <MessageCircle size={14} />
                      ) : (
                        <Mail size={14} />
                      )}
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-laranja hover:bg-laranja/10 rounded-md transition-colors" title="Ver detalhes">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {columnLeads.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
