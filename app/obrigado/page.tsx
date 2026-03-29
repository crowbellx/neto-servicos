'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ObrigadoPage() {
  return (
    <div className="bg-branco min-h-screen flex items-center justify-center py-20">
      <div className="container-custom max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-32 h-32 bg-teal-light text-teal rounded-full flex items-center justify-center mx-auto mb-12 shadow-lg"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <CheckCircle2 size={64} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-titulo font-extrabold text-t-primary mb-6 tracking-tight"
        >
          Mensagem recebida!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-t-secondary mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          Obrigado pelo contato! Recebemos sua mensagem e retornaremos em breve pelo canal escolhido.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 text-left mb-12"
        >
          <h3 className="text-2xl font-titulo font-bold text-t-primary mb-6">Próximos passos:</h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-laranja-light text-laranja flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
              <p className="text-t-secondary leading-relaxed">Você receberá um e-mail de confirmação em instantes com o resumo do seu envio.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-roxo-light text-roxo flex items-center justify-center font-bold shrink-0 mt-0.5">2</div>
              <p className="text-t-secondary leading-relaxed">Nossa equipe de especialistas analisará o seu briefing com cuidado.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-light text-teal flex items-center justify-center font-bold shrink-0 mt-0.5">3</div>
              <p className="text-t-secondary leading-relaxed">Entraremos em contato para agendar uma conversa e apresentar uma proposta.</p>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-laranja text-white px-8 py-4 rounded-full font-bold hover:bg-[#D4651A] hover:scale-105 active:scale-95 transition-all shadow-cor w-full sm:w-auto"
          >
            Voltar para o início
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center justify-center gap-2 bg-transparent border-2 border-roxo text-roxo px-8 py-4 rounded-full font-bold hover:bg-roxo-light hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            Ver portfólio <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
