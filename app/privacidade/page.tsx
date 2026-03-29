import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="bg-branco min-h-screen pb-24">
      {/* Header */}
      <section className="bg-grafite text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-g-marca opacity-20 mix-blend-overlay" />
        <div className="container-custom relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-t-white-70 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} />
            Voltar para o Início
          </Link>
          <h1 className="text-4xl md:text-5xl font-display italic text-white mb-6">
            Política de Privacidade
          </h1>
          <p className="text-t-white-70 max-w-2xl text-lg">
            Como tratamos e protegemos os seus dados.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom mt-16 max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2>1. Coleta de Dados</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, como quando preenche nosso formulário de contato, solicita um orçamento ou se comunica conosco. Os tipos de informações pessoais que podemos coletar incluem seu nome, endereço de e-mail, número de telefone, nome da empresa e qualquer outra informação que você decida fornecer.
          </p>

          <h2>2. Uso das Informações</h2>
          <p>
            Usamos as informações que coletamos para:
          </p>
          <ul>
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Processar e concluir transações, e enviar informações relacionadas, incluindo confirmações de compra e faturas;</li>
            <li>Enviar avisos técnicos, atualizações, alertas de segurança e mensagens de suporte e administrativas;</li>
            <li>Responder a seus comentários, perguntas e solicitações, e fornecer atendimento ao cliente;</li>
            <li>Comunicar sobre produtos, serviços, ofertas, promoções, recompensas e eventos oferecidos pela Neto Serviços.</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política ou no momento da coleta. Podemos compartilhar informações com prestadores de serviços que precisam de acesso a essas informações para realizar trabalhos em nosso nome.
          </p>

          <h2>4. Segurança</h2>
          <p>
            Tomamos medidas razoáveis para ajudar a proteger informações sobre você contra perda, roubo, uso indevido e acesso não autorizado, divulgação, alteração e destruição.
          </p>

          <h2>5. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:
          </p>
          <ul>
            <li>E-mail: contato@netoservicos.com.br</li>
            <li>Telefone: (11) 99999-9999</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
