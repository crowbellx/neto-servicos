import Link from 'next/link';
import { Eye, MessageCircle, Mail } from 'lucide-react';

type RecentLead = {
  id: string;
  name: string;
  company: string | null;
  service: string;
  preferredContact: string;
  statusLabel: string;
  statusColor: string;
  receivedAt: string;
};

export default function RecentLeads({ leads }: { leads: RecentLead[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Leads Recentes</h2>
        <Link href="/admin/leads" className="text-sm text-laranja hover:underline font-medium">
          Ver todos os leads &rarr;
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Nome / Empresa</th>
              <th scope="col" className="px-6 py-3 font-medium">Serviço</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.company || 'Sem empresa'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                    {lead.service}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${lead.statusColor}`}></div>
                    <span className="text-gray-700">{lead.statusLabel}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{lead.receivedAt}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-laranja hover:bg-laranja/10 rounded-md transition-colors" title="Ver detalhes">
                      <Eye size={16} />
                    </button>
                    {lead.preferredContact.toLowerCase().includes('whats') ? (
                      <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors" title="Responder WhatsApp">
                        <MessageCircle size={16} />
                      </button>
                    ) : (
                      <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Responder E-mail">
                        <Mail size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Nenhum lead recente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
