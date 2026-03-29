'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth-recovery';
import { toast } from 'sonner';

export default function NewPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const result = await resetPassword(resolvedParams.token, password);
      
      if (result.success) {
        setSuccess(true);
        toast.success('Senha atualizada com sucesso!');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
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
            <Lock className="text-laranja" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Nova Senha</h1>
          <p className="text-gray-400 text-sm">
            Digite sua nova senha abaixo.
          </p>
        </div>

        {success ? (
          <div className="text-center relative z-10">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-green-400 font-medium">
                Senha atualizada com sucesso!
              </p>
              <p className="text-green-400/80 text-sm mt-2">
                Redirecionando para o login...
              </p>
            </div>
            <Link 
              href="/admin/login" 
              className="inline-flex items-center gap-2 text-white bg-laranja/20 hover:bg-laranja/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Fazer Login <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-gray-300 mb-1.5">Nova Senha</label>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg focus:ring-laranja focus:border-laranja block p-3 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-1.5">Confirmar Nova Senha</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg focus:ring-laranja focus:border-laranja block p-3 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                placeholder="Repita a senha"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-laranja text-white p-3 rounded-lg font-bold hover:bg-[#D4651A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(238,114,20,0.3)] hover:shadow-[0_0_25px_rgba(238,114,20,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Salvando...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
