import { getTestimonials } from '@/app/actions/testimonials';
import { MessageSquare, Plus, Star, Trash2, User } from 'lucide-react';
import Link from 'next/link';

export default async function DepoimentosPage() {
  const { data: testimonials } = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depoimentos</h1>
          <p className="text-sm text-gray-500">Gerencie o que os clientes dizem sobre sua empresa</p>
        </div>
        <button className="bg-laranja text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus size={18} /> Novo Depoimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" /> : <User size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.role} @ {t.company}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} className="fill-ambar text-ambar" />
              ))}
            </div>
            <p className="text-sm text-gray-600 italic flex-1">&quot;{t.text}&quot;</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-laranja uppercase tracking-widest">{t.service}</span>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {(!testimonials || testimonials.length === 0) && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
            <p>Nenhum depoimento cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}