'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionModal from '@/components/admin/finance/TransactionModal';

export default function FinanceClientHeader({ initialMonth, initialYear }: { initialMonth: number, initialYear: number }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    let m = initialMonth - 1;
    let y = initialYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    router.push(`/admin/financeiro?month=${m}&year=${y}`);
  };

  const handleNextMonth = () => {
    let m = initialMonth + 1;
    let y = initialYear;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    router.push(`/admin/financeiro?month=${m}&year=${y}`);
  };

  return (
    <>
      <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-gray-700 min-w-[120px] text-center text-sm">
          {months[initialMonth - 1]} / {initialYear}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500">
          <ChevronRight size={20} />
        </button>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
      >
        <Plus size={16} /> Nova Transação
      </button>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
