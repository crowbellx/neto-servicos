'use client';

import { useState, useTransition, useCallback } from 'react';
import { Trash2, Clock, AlertTriangle, CheckCircle2, Eye, Loader2, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { getLeadsCleanupPreview, purgeOldLeads, updateLeadCleanupSettings } from '@/app/actions/leads';

interface LeadCleanupConfig {
  retentionDays?: number;
  enabled?: boolean;
  lastPurgeAt?: string;
  lastPurgeCount?: number;
}

interface LeadCleanupSettingsProps {
  initialConfig: LeadCleanupConfig;
}

export default function LeadCleanupSettings({ initialConfig }: LeadCleanupSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [isPurging, startPurge] = useTransition();
  const [isPreviewing, startPreview] = useTransition();

  const [retentionDays, setRetentionDays] = useState(initialConfig.retentionDays ?? 30);
  const [enabled, setEnabled] = useState(initialConfig.enabled ?? false);
  const [lastPurgeAt] = useState(initialConfig.lastPurgeAt);
  const [lastPurgeCount] = useState(initialConfig.lastPurgeCount);

  const [preview, setPreview] = useState<{ count: number; cutoffDate: Date } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justPurged, setJustPurged] = useState<number | null>(null);

  const handleSaveConfig = () => {
    startTransition(async () => {
      const result = await updateLeadCleanupSettings(retentionDays, enabled);
      if (result.success) {
        toast.success('Configuração de limpeza salva!');
        setPreview(null); // reset preview after config change
      } else {
        toast.error(result.error || 'Erro ao salvar configuração.');
      }
    });
  };

  const handlePreview = useCallback(() => {
    startPreview(async () => {
      const result = await getLeadsCleanupPreview();
      if (result.success && result.data) {
        setPreview({ count: result.data.count, cutoffDate: new Date(result.data.cutoffDate) });
        if (result.data.count === 0) {
          toast.info('Nenhum lead elegível para exclusão no momento.');
        }
      } else {
        toast.error(result.error || 'Erro ao pré-visualizar limpeza.');
      }
    });
  }, []);

  const handlePurge = () => {
    startPurge(async () => {
      setShowConfirm(false);
      const result = await purgeOldLeads();
      if (result.success) {
        const deleted = (result.data as any)?.deleted ?? 0;
        setJustPurged(deleted);
        setPreview(null);
        if (deleted > 0) {
          toast.success(`${deleted} lead(s) excluído(s) permanentemente.`);
        } else {
          toast.info('Nenhum lead foi excluído (nenhum elegível).');
        }
      } else {
        toast.error(result.error || 'Erro ao executar limpeza.');
      }
    });
  };

  const retentionOptions = [
    { value: 7, label: '7 dias' },
    { value: 14, label: '14 dias' },
    { value: 30, label: '30 dias' },
    { value: 60, label: '60 dias' },
    { value: 90, label: '90 dias' },
    { value: 180, label: '6 meses' },
    { value: 365, label: '1 ano' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Trash2 size={20} className="text-red-500" />
        Limpeza Automática de Leads
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Exclui permanentemente leads marcados como <span className="font-semibold text-gray-700">Sem Interesse (LOST)</span> após o período definido.
      </p>

      {/* Config row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
        <div className="flex-1">
          <label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            Excluir leads LOST após
          </label>
          <select
            value={retentionDays}
            onChange={(e) => { setRetentionDays(Number(e.target.value)); setPreview(null); }}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-400 focus:border-red-400 block p-2.5 outline-none"
          >
            {retentionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-900 mb-2">Limpeza automática</label>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <div
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                enabled ? 'bg-red-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">{enabled ? 'Ativada' : 'Desativada'}</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveConfig}
          disabled={isPending}
          className="bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
          Salvar Config
        </button>
      </div>

      {/* Info box */}
      {enabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3 mb-5 text-sm text-amber-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <span>
            Com a limpeza automática <strong>ativada</strong>, leads LOST com mais de <strong>{retentionDays} dias</strong> serão permanentemente excluídos ao acionar o endpoint de cron.
          </span>
        </div>
      )}

      {/* Last purge info */}
      {(lastPurgeAt || justPurged !== null) && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-3 mb-5 text-sm text-gray-600 border border-gray-100">
          <RefreshCw size={15} className="text-gray-400 shrink-0" />
          <span>
            Última limpeza:{' '}
            <strong>
              {justPurged !== null
                ? `agora mesmo — ${justPurged} lead(s) excluído(s)`
                : `${new Date(lastPurgeAt!).toLocaleString('pt-BR')} — ${lastPurgeCount ?? 0} lead(s) excluído(s)`}
            </strong>
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing || isPurging}
          className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? <Loader2 size={15} className="animate-spin" /> : <Eye size={15} />}
          Pré-visualizar
        </button>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPurging || isPreviewing}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPurging ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {isPurging ? 'Excluindo...' : 'Executar Limpeza Agora'}
        </button>
      </div>

      {/* Preview result */}
      {preview !== null && !isPreviewing && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm flex items-center gap-3 border ${
          preview.count > 0
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          {preview.count > 0 ? (
            <>
              <ShieldAlert size={16} className="text-red-500 shrink-0" />
              <span>
                <strong>{preview.count} lead(s)</strong> serão excluídos permanentemente — aqueles com status LOST e sem movimentação desde{' '}
                <strong>{preview.cutoffDate.toLocaleDateString('pt-BR')}</strong>.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span>Nenhum lead elegível no momento. Todos os leads LOST foram movimentados nos últimos <strong>{retentionDays} dias</strong>.</span>
            </>
          )}
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão Permanente</h3>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Todos os leads com status <strong>Sem Interesse (LOST)</strong> com mais de{' '}
              <strong>{retentionDays} dias</strong> sem movimentação serão excluídos permanentemente do banco de dados, incluindo notas e interações associadas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePurge}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={15} />
                Sim, excluir permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
