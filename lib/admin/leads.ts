export const LEAD_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Novo' },
  { value: 'CONTACTED', label: 'Em contato' },
  { value: 'QUOTED', label: 'Orçamento enviado' },
  { value: 'CLOSED', label: 'Fechado' },
  { value: 'LOST', label: 'Sem interesse' },
] as const;

export const LEAD_STATUS_META: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Novo', color: 'bg-laranja animate-pulse' },
  CONTACTED: { label: 'Em contato', color: 'bg-blue-500' },
  QUOTED: { label: 'Orçamento enviado', color: 'bg-purple-500' },
  CLOSED: { label: 'Fechado', color: 'bg-green-500' },
  LOST: { label: 'Sem interesse', color: 'bg-gray-400' },
};

export function normalizeLeadStatus(status?: string | null) {
  if (status === 'PROPOSAL') return 'QUOTED';
  return status || 'NEW';
}
