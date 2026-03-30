import { getAuditLogs, getAuthAttempts } from '@/app/actions/audit';
import { Shield, Clock, User, Globe, AlertTriangle } from 'lucide-react';

export default async function LogsPage() {
  const [logsRes, attemptsRes] = await Promise.all([
    getAuditLogs(),
    getAuthAttempts()
  ]);

  const logs = logsRes.data || [];
  const attempts = attemptsRes.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs & Auditoria</h1>
        <p className="text-sm text-gray-500">Rastreamento de atividades e segurança do sistema</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Atividades Recentes */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-laranja" /> Atividades Recentes
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Usuário</th>
                  <th className="px-6 py-3 font-medium">Ação</th>
                  <th className="px-6 py-3 font-medium">Recurso</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{log.user?.name || 'Sistema'}</div>
                      <div className="text-xs text-gray-500">{log.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{log.resource}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tentativas de Login */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-laranja" /> Segurança (Logins)
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
            {attempts.map((attempt: any) => (
              <div key={attempt.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg ${attempt.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {attempt.success ? <User size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{attempt.email}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Globe size={12} /> {attempt.ip || 'IP Oculto'}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(attempt.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                {!attempt.success && (
                  <span className="text-[10px] font-bold text-red-500 uppercase">Falhou</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}