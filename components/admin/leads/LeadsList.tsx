'use client';

import { Eye, MessageCircle, Mail } from 'lucide-react';
import { LEAD_STATUS_META, normalizeLeadStatus } from '@/lib/admin/leads';

export default function LeadsList({
  leads,
  onSelectLead,
  selectedIds,
  allSelected,
  onToggleLead,
  onToggleAll,
}: {
  leads: any[];
  onSelectLead: (lead: any) => void;
  selectedIds: string[];
  allSelected: boolean;
  onToggleLead: (leadId: string) => void;
  onToggleAll: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAll}
                    className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja"
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 font-medium">Nome / Empresa</th>
              <th scope="col" className="px-6 py-3 font-medium">Serviço</th>
              <th scope="col" className="px-6 py-3 font-medium">Canal</th>
              <th scope="col" className="px-6 py-3 font-medium">Data</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const statusInfo =
                LEAD_STATUS_META[normalizeLeadStatus(lead.status)] || {
                  label: lead.status || 'Novo',
                  color: 'bg-gray-400',
                };
              
              return (
                <tr 
                  key={lead.id} 
                  className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSelectLead(lead)}
                >
                  <td className="p-4 w-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead.id)}
                        onChange={() => onToggleLead(lead.id)}
                        className="w-4 h-4 text-laranja bg-gray-100 border-gray-300 rounded focus:ring-laranja"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                        {lead.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500">{lead.company || '--'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      {lead.preferredContact?.toLowerCase().includes('whats') ? (
                        <MessageCircle size={16} className="text-green-500" />
                      ) : (
                        <Mail size={16} className="text-blue-500" />
                      )}
                      {lead.preferredContact || lead.source || 'Website'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                      <span className="text-gray-700">{statusInfo.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-laranja hover:bg-laranja/10 rounded-md transition-colors" title="Ver detalhes" onClick={() => onSelectLead(lead)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {leads.length === 0 && (
          <div className="flex items-center justify-center p-8 text-gray-500">Nenhum lead encontrado.</div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {leads.length} leads</div>
      </div>
    </div>
  );
}
