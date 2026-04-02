'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ClientModal from '@/components/admin/clients/ClientModal';

export default function ClientsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-laranja text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D4651A] transition-colors shadow-sm"
      >
        <Plus size={18} /> Novo Cliente
      </button>

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
