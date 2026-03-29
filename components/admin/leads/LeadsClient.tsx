'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, List as ListIcon, Search, Filter, Plus, X } from 'lucide-react';
import LeadsKanban from './LeadsKanban';
import LeadsList from './LeadsList';
import LeadPanel from './LeadPanel';
import { LEAD_STATUS_OPTIONS, normalizeLeadStatus } from '@/lib/admin/leads';
import { bulkArchiveLeads, bulkUpdateLeadStatus, createManualLead, updateLeadStatus } from '@/app/actions/leads';
import { toast } from 'sonner';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bulkStatus, setBulkStatus] = useState('CONTACTED');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent');

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const normalizedStatus = normalizeLeadStatus(lead.status);
      const matchesStatus = statusFilter === 'ALL' || normalizedStatus === statusFilter;
      const haystack = `${lead.name || ''} ${lead.email || ''} ${lead.company || ''}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [leads, query, statusFilter]);

  const sortedLeads = useMemo(() => {
    const copy = [...filteredLeads];
    if (sortBy === 'name') {
      copy.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR'));
      return copy;
    }
    copy.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'oldest' ? aTime - bTime : bTime - aTime;
    });
    return copy;
  }, [filteredLeads, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / pageSize));
  const currentPage = Math.min(listPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedLeads]);

  const handleMoveLead = async (leadId: string, nextStatus: string) => {
    const prevLeads = leads;
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead)),
    );

    const res = await updateLeadStatus(leadId, nextStatus);
    if (!res.success) {
      setLeads(prevLeads);
      toast.error('Não foi possível mover o lead');
      return;
    }
    toast.success('Lead atualizado');
    if (selectedLead?.id === leadId) {
      setSelectedLead((current: any) => (current ? { ...current, status: nextStatus } : current));
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedIds((current) =>
      current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId],
    );
  };

  const toggleAllFiltered = () => {
    const target = view === 'list' ? paginatedLeads : filteredLeads;
    if (!target.length) return;
    setSelectedIds((current) =>
      target.every((lead) => current.includes(lead.id))
        ? current.filter((id) => !target.some((lead) => lead.id === id))
        : Array.from(new Set([...current, ...target.map((lead) => lead.id)])),
    );
  };

  const handleBulkStatus = async () => {
    if (!selectedIds.length) return;
    const res = await bulkUpdateLeadStatus(selectedIds, bulkStatus);
    if (!res.success) {
      toast.error('Falha na atualização em lote');
      return;
    }
    setLeads((current) =>
      current.map((lead) =>
        selectedIds.includes(lead.id) ? { ...lead, status: bulkStatus } : lead,
      ),
    );
    setSelectedIds([]);
    toast.success('Leads atualizados');
  };

  const handleBulkArchive = async () => {
    if (!selectedIds.length) return;
    const res = await bulkArchiveLeads(selectedIds);
    if (!res.success) {
      toast.error('Falha ao arquivar selecionados');
      return;
    }
    setLeads((current) => current.filter((lead) => !selectedIds.includes(lead.id)));
    setSelectedIds([]);
    toast.success('Leads arquivados');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laranja/20 focus:border-laranja transition-all"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="ALL">Todos os status</option>
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={16} /> Kanban
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ListIcon size={16} /> Lista
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar lead manualmente
        </button>
      </div>

      {view === 'list' && (
        <div className="bg-white p-3 rounded-lg border border-gray-100 mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Ordenar</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'name')}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm"
            >
              <option value="recent">Mais recente</option>
              <option value="oldest">Mais antigo</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Itens/página</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setListPage(1);
              }}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">{selectedIds.length} selecionado(s)</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="bg-white border border-amber-300 rounded-md px-2 py-1 text-sm"
          >
            {LEAD_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleBulkStatus}
            className="text-sm bg-white border border-amber-300 px-3 py-1 rounded-md hover:bg-amber-100"
          >
            Aplicar status
          </button>
          <button
            type="button"
            onClick={handleBulkArchive}
            className="text-sm bg-white border border-red-200 text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
          >
            Arquivar
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'kanban' ? (
          <LeadsKanban
            leads={filteredLeads}
            onSelectLead={setSelectedLead}
            onMoveLead={handleMoveLead}
          />
        ) : (
          <LeadsList
            leads={paginatedLeads}
            onSelectLead={setSelectedLead}
            selectedIds={selectedIds}
            allSelected={
              paginatedLeads.length > 0 &&
              paginatedLeads.every((lead) => selectedIds.includes(lead.id))
            }
            onToggleLead={toggleLeadSelection}
            onToggleAll={toggleAllFiltered}
          />
        )}
      </div>

      {view === 'list' && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Página {currentPage} de {totalPages} ({sortedLeads.length} resultado(s))
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setListPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Panel */}
      {selectedLead && (
        <LeadPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onLeadUpdated={(leadId, patch) => {
            setLeads((current) =>
              current.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)),
            );
            setSelectedLead((current: any) =>
              current && current.id === leadId ? { ...current, ...patch } : current,
            );
          }}
        />
      )}

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(lead) => {
            setLeads((current) => [lead, ...current]);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (lead: any) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: '',
    preferredContact: 'WhatsApp',
    source: 'Admin',
    message: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await createManualLead(form);
    setIsSaving(false);
    if (!res.success || !res.data) {
      toast.error(res.error || 'Falha ao adicionar lead');
      return;
    }
    toast.success('Lead criado com sucesso');
    onCreated(res.data);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <form onSubmit={submit} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Adicionar lead manualmente</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} required />
            <Input label="Empresa" value={form.company} onChange={(value) => setForm((f) => ({ ...f, company: value }))} />
            <Input label="E-mail" type="email" value={form.email} onChange={(value) => setForm((f) => ({ ...f, email: value }))} required />
            <Input label="WhatsApp" value={form.whatsapp} onChange={(value) => setForm((f) => ({ ...f, whatsapp: value }))} required />
            <Input label="Serviço" value={form.service} onChange={(value) => setForm((f) => ({ ...f, service: value }))} required />
            <Input label="Origem" value={form.source} onChange={(value) => setForm((f) => ({ ...f, source: value }))} />
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Canal preferido</label>
              <select
                value={form.preferredContact}
                onChange={(e) => setForm((f) => ({ ...f, preferredContact: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option>WhatsApp</option>
                <option>E-mail</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Mensagem</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                required
              />
            </div>
          </div>
          <div className="p-5 border-t border-gray-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-laranja text-white text-sm font-medium disabled:opacity-70"
            >
              {isSaving ? 'Salvando...' : 'Salvar lead'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        required={required}
      />
    </div>
  );
}
