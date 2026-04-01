'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions/auth';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface LoginFormProps {
  logo?: string;
  companyName?: string;
}

export default function LoginForm({ logo, companyName = 'Neto' }: LoginFormProps) {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen bg-grafite flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            {logo ? (
              <div className="relative w-full h-full">
                <Image
                  src={logo}
                  alt={companyName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-g-marca flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {companyName.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-titulo font-bold text-t-primary">
            Área Administrativa
          </h1>
          <p className="text-t-secondary text-sm mt-1">
            Acesso restrito à equipe {companyName}
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-t-primary"
                htmlFor="email"
              >
                E-mail
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-lg border border-black/10 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-t-muted focus:border-laranja focus:ring-1 focus:ring-laranja transition-all"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  required
                  autoFocus
                />
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-t-muted peer-focus:text-laranja transition-colors" />
              </div>
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-t-primary"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-lg border border-black/10 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-t-muted focus:border-laranja focus:ring-1 focus:ring-laranja transition-all"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Sua senha"
                  required
                  minLength={8}
                />
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-t-muted peer-focus:text-laranja transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  name="remember"
                  className="peer appearance-none w-5 h-5 rounded border border-black/20 checked:bg-laranja checked:border-laranja transition-all cursor-pointer"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.00001 7.8L1.20001 5L0.266678 5.93333L4.00001 9.66667L12 1.66667L11.0667 0.733337L4.00001 7.8Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <span className="text-sm text-t-secondary group-hover:text-t-primary transition-colors">
                Manter conectado
              </span>
            </label>
          </div>

          <LoginButton />

          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-500 text-sm w-full bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <a href="/admin/recuperar-senha" className="text-sm text-t-secondary hover:text-laranja transition-colors">
              Esqueci minha senha
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full bg-laranja text-white py-3 px-4 rounded-lg font-bold hover:bg-[#D4651A] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-cor disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Verificando...
        </>
      ) : (
        'Entrar'
      )}
    </button>
  );
}
