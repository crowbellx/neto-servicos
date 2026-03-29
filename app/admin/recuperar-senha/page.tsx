'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/auth-recovery';
import { toast } from 'sonner';

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Informe seu e-mail');
      return;
    }

    setLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccess(true);
        toast.success('Se o e-mail existir, você receberá as instruções em breve.');
      } else {
        toast.error(result.error || 'Ocorreu um erro');
      }
    } catch (error) {
      toast.error('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-white/5 relative z-10 overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-laranja/10 blur-[60px] pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-full mb-4 ring-1 ring-white/10">
            <Mail className="text-laranja" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h1>
          <p className="text-gray-400 text-sm">
            Digite seu e-mail para receber um link de redefinição de senha.
          </p>
        </div>

        {success ? (
          <div className="text-center relative z-10">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-green-400 text-sm">
                Enviamos um link de recuperação para o e-mail informado (se ele estiver cadastrado). 
                Verifique sua caixa de entrada e também a pasta de spam.
              </p>
            </div>
            <Link 
              href="/admin/login" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">E-mail Cadastrado</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg focus:ring-laranja focus:border-laranja block p-3 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                  placeholder="admin@netoservicos.com.br"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-laranja text-white p-3 rounded-lg font-bold hover:bg-[#D4651A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Enviando...
                </>
              ) : (
                'Enviar link de recuperação'
              )}
            </button>
            
            <div className="pt-4 text-center">
              <Link 
                href="/admin/login" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} /> Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
