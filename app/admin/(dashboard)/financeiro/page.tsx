import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFinanceSummary, getTransactions } from '@/app/actions/finance';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, FileText, Tag } from 'lucide-react';
import Link from 'next/link';
import FinanceClientHeader from './FinanceClientHeader';
import TransactionActions from '@/components/admin/finance/TransactionActions';

export default async function FinanceiroPage({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const sp = await searchParams;
  const month = sp.month ? parseInt(sp.month) : new Date().getMonth() + 1;
  const year = sp.year ? parseInt(sp.year) : new Date().getFullYear();

  const [summaryRes, transactionsRes] = await Promise.all([
    getFinanceSummary(month, year),
    getTransactions({ limit: 50, month, year })
  ]);

  const summary = (summaryRes.success ? summaryRes.data : { income: 0, expense: 0, balance: 0 }) || { income: 0, expense: 0, balance: 0 };
  const transactions = (transactionsRes.success ? transactionsRes.data : []) || [];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="text-emerald-500" /> Visão Geral
          </h1>
          <p className="text-sm text-gray-500">Acompanhe as receitas, despesas e saldo do mês.</p>
        </div>
        <div className="flex gap-4 items-center">
            <FinanceClientHeader initialMonth={month} initialYear={year} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Receitas Úteis</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.income)}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <ArrowUpCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Despesas</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.expense)}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <ArrowDownCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Saldo do Mês</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.balance)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
           <h3 className="font-bold text-gray-900">Extrato Recente</h3>
        </div>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="font-semibold p-4">Data</th>
                  <th className="font-semibold p-4">Descrição</th>
                  <th className="font-semibold p-4">Origem / Categoria</th>
                  <th className="font-semibold p-4 border-l border-gray-100">Tipo</th>
                  <th className="font-semibold p-4 text-right">Valor</th>
                  <th className="font-semibold p-4 text-right border-l border-gray-100">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      {tx.description}
                      <br/>
                      {tx.status === 'PENDING' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block uppercase tracking-wider">Pendente</span>}
                      {tx.status === 'PAID' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block uppercase tracking-wider">Liquidado</span>}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                       {tx.quote ? (
                         <Link href={`/admin/orcamentos/${tx.quoteId}`} className="text-laranja hover:underline flex items-center gap-1 font-medium text-xs">
                           <FileText size={12} /> {tx.quote.number}
                         </Link>
                       ) : (
                         <span className="text-gray-500 flex items-center gap-1 text-xs">
                           <Tag size={12} /> {tx.category || 'Manual / Sem Categoria'}
                         </span>
                       )}
                    </td>
                    <td className="p-4 border-l border-gray-50">
                      {tx.type === 'INCOME' ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1"><ArrowUpCircle size={14}/> Receita</span>
                      ) : (
                        <span className="text-red-600 font-medium flex items-center gap-1"><ArrowDownCircle size={14}/> Despesa</span>
                      )}
                    </td>
                    <td className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="p-4 border-l border-gray-50">
                      <TransactionActions transaction={tx} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-10 text-gray-500">
            Nenhuma transação registrada neste período.
          </div>
        )}
      </div>

    </div>
  );
}
