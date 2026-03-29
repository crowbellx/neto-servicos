'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// Zod Schema
const formSchema = z.object({
  nome: z.string().min(3, 'Por favor, insira seu nome completo').regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Apenas letras e espaços'),
  email: z.string().email('Insira um e-mail válido'),
  whatsapp: z.string().min(14, 'Insira um número de WhatsApp válido').max(15, 'Insira um número de WhatsApp válido'),
  empresa: z.string().optional(),
  servico: z.enum(['grafica', 'design', 'digital', 'tudo', 'outro'], {
    message: 'Por favor, selecione um serviço',
  }),
  preferencia: z.enum(['whatsapp', 'email', 'videochamada', 'presencial'], {
    message: 'Selecione sua preferência de atendimento',
  }),
  mensagem: z.string().min(20, 'A mensagem deve ter entre 20 e 1000 caracteres').max(1000, 'A mensagem deve ter entre 20 e 1000 caracteres'),
  origem: z.string().optional(),
  aceite: z.literal(true, {
    error: 'É necessário aceitar para prosseguir',
  }),
});

type FormData = z.infer<typeof formSchema>;

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FormContato() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const watchMensagem = watch('mensagem', '');
  const watchServico = watch('servico');
  const watchPreferencia = watch('preferencia');

  // WhatsApp Mask
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    
    setValue('whatsapp', value, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      setSubmitStatus('success');
      reset();
      
      router.push('/obrigado');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-black/5 relative overflow-hidden">
      <h3 className="text-3xl font-titulo font-bold text-t-primary mb-8">Envie uma mensagem</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <div className="relative">
          <input
            {...register('nome')}
            type="text"
            id="nome"
            placeholder=" "
            className={`peer w-full bg-transparent border-b-2 px-0 py-3 text-t-primary focus:outline-none transition-colors ${
              errors.nome ? 'border-[#E24B4A]' : 'border-grafite-soft/20 focus:border-teal'
            }`}
          />
          <label
            htmlFor="nome"
            className="absolute left-0 top-3 text-t-muted transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal peer-valid:-top-3.5 peer-valid:text-xs peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
          >
            Nome completo *
          </label>
          <AnimatePresence>
            {errors.nome && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1">
                {errors.nome.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* E-mail e WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder=" "
              className={`peer w-full bg-transparent border-b-2 px-0 py-3 text-t-primary focus:outline-none transition-colors ${
                errors.email ? 'border-[#E24B4A]' : 'border-grafite-soft/20 focus:border-teal'
              }`}
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-3 text-t-muted transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal peer-valid:-top-3.5 peer-valid:text-xs peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
            >
              E-mail *
            </label>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1">
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <input
              {...register('whatsapp')}
              onChange={handleWhatsAppChange}
              type="tel"
              id="whatsapp"
              placeholder=" "
              className={`peer w-full bg-transparent border-b-2 px-0 py-3 text-t-primary focus:outline-none transition-colors ${
                errors.whatsapp ? 'border-[#E24B4A]' : 'border-grafite-soft/20 focus:border-teal'
              }`}
            />
            <label
              htmlFor="whatsapp"
              className="absolute left-0 top-3 text-t-muted transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal peer-valid:-top-3.5 peer-valid:text-xs peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
            >
              WhatsApp *
            </label>
            <AnimatePresence>
              {errors.whatsapp && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1">
                  {errors.whatsapp.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Empresa */}
        <div className="relative">
          <input
            {...register('empresa')}
            type="text"
            id="empresa"
            placeholder=" "
            className="peer w-full bg-transparent border-b-2 border-grafite-soft/20 px-0 py-3 text-t-primary focus:outline-none focus:border-teal transition-colors"
          />
          <label
            htmlFor="empresa"
            className="absolute left-0 top-3 text-t-muted transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal peer-valid:-top-3.5 peer-valid:text-xs peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
          >
            Empresa (opcional)
          </label>
        </div>

        {/* Serviço */}
        <div className="relative">
          <label className="block text-sm text-t-muted mb-2">Qual serviço te interessa? *</label>
          <div className="relative">
            <select
              {...register('servico')}
              className={`w-full appearance-none bg-branco border-2 rounded-xl px-4 py-3 text-t-primary focus:outline-none transition-colors cursor-pointer ${
                errors.servico ? 'border-[#E24B4A]' : 'border-transparent focus:border-teal'
              }`}
              defaultValue=""
            >
              <option value="" disabled>Selecione uma opção...</option>
              <option value="grafica">Gráfica — Impressão e materiais físicos</option>
              <option value="design">Design — Identidade visual e criação</option>
              <option value="digital">Desenvolvimento Digital — Sites, lojas e sistemas</option>
              <option value="tudo">Tudo! — Pacote completo integrado</option>
              <option value="outro">Outro — Não sei ainda, quero conversar</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-t-muted">
              ▼
            </div>
          </div>
          <AnimatePresence>
            {errors.servico && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1">
                {errors.servico.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Preferência de Atendimento */}
        <div>
          <label className="block text-sm text-t-muted mb-3">Como prefere ser atendido? *</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'email', label: 'E-mail' },
              { id: 'videochamada', label: 'Videochamada' },
              { id: 'presencial', label: 'Presencial' },
            ].map((pref) => (
              <label
                key={pref.id}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                  watchPreferencia === pref.id
                    ? 'bg-laranja border-laranja text-white'
                    : 'bg-transparent border-grafite-soft/20 text-t-secondary hover:border-laranja/50'
                }`}
              >
                <input
                  type="radio"
                  value={pref.id}
                  {...register('preferencia')}
                  className="hidden"
                />
                {pref.label}
              </label>
            ))}
          </div>
          <AnimatePresence>
            {errors.preferencia && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-2">
                {errors.preferencia.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Mensagem */}
        <div className="relative">
          <label htmlFor="mensagem" className="block text-sm text-t-muted mb-2">Mensagem / Briefing *</label>
          <textarea
            {...register('mensagem')}
            id="mensagem"
            rows={5}
            placeholder="Conte um pouco sobre o seu projeto. Qual é o objetivo? Tem prazo? Alguma referência visual que goste?"
            className={`w-full bg-branco border-2 rounded-xl px-4 py-3 text-t-primary focus:outline-none transition-colors resize-y min-h-[120px] ${
              errors.mensagem ? 'border-[#E24B4A]' : 'border-transparent focus:border-teal'
            }`}
          />
          <div className="absolute bottom-3 right-4 text-xs text-t-muted">
            {watchMensagem.length} / 1000
          </div>
          <AnimatePresence>
            {errors.mensagem && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1">
                {errors.mensagem.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Aceite */}
        <div className="relative">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                {...register('aceite')}
                className="peer appearance-none w-5 h-5 border-2 border-grafite-soft/30 rounded-md checked:bg-teal checked:border-teal transition-colors cursor-pointer"
              />
              <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <span className="text-sm text-t-secondary leading-snug">
              Concordo com a <Link href="/privacidade" className="text-teal hover:underline">Política de Privacidade</Link> e autorizo o contato. *
            </span>
          </label>
          <AnimatePresence>
            {errors.aceite && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[#E24B4A] text-xs mt-1 ml-8">
                {errors.aceite.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className={`w-full py-4 rounded-full font-titulo font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
            submitStatus === 'success'
              ? 'bg-teal text-white cursor-not-allowed'
              : isSubmitting
              ? 'bg-laranja/80 text-white cursor-not-allowed'
              : 'bg-laranja text-white hover:bg-[#D4651A] hover:scale-[1.02] active:scale-95 shadow-cor'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Enviando...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle2 size={24} />
              Mensagem enviada! ✓
            </>
          ) : (
            'Enviar Mensagem →'
          )}
        </button>

        {/* Error Toast (Simple inline for now) */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-[#E24B4A]/10 border border-[#E24B4A] text-[#E24B4A] p-4 rounded-xl flex items-center gap-3"
            >
              <XCircle size={20} className="shrink-0" />
              <span className="text-sm font-medium">Ocorreu um erro. Tente novamente ou use o WhatsApp.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
