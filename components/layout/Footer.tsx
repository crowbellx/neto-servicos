import Link from 'next/link';
import { Instagram, Linkedin, MessageCircle, Dribbble, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  general?: any;
}

export default function Footer({ general = {} }: FooterProps) {
  const companyName = general.companyName || 'Neto Serviços';
  const phone = general.phone || '(11) 99999-9999';
  const email = general.email || 'contato@netoservicos.com.br';
  const address = `${general.street || 'Rua Exemplo, 123'} - ${general.neighborhood || 'Centro'}`;
  const cityState = `${general.city || 'São Paulo'}, ${general.state || 'SP'}`;

  return (
    <footer className="bg-grafite text-white pt-20 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-g-marca flex items-center justify-center text-white font-bold text-xl">
                {companyName.charAt(0)}
              </div>
              <span className="font-titulo font-bold text-xl tracking-tight text-white">
                {companyName}
              </span>
            </Link>
            <p className="text-t-white-70 text-sm max-w-xs leading-relaxed">
              {general.slogan || 'Do físico ao digital — em um só lugar.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-magenta transition-colors"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-azul transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-[#25D366] transition-colors"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
            <div>
              <h3 className="font-titulo font-bold text-lg mb-6 text-white">Serviços</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/servicos#grafica" className="text-t-white-70 hover:text-teal transition-colors text-sm">Gráfica</Link></li>
                <li><Link href="/servicos#design" className="text-t-white-70 hover:text-roxo transition-colors text-sm">Design</Link></li>
                <li><Link href="/servicos#digital" className="text-t-white-70 hover:text-azul transition-colors text-sm">Digital</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-titulo font-bold text-lg mb-6 text-white">Empresa</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/sobre" className="text-t-white-70 hover:text-laranja transition-colors text-sm">Sobre Nós</Link></li>
                <li><Link href="/portfolio" className="text-t-white-70 hover:text-laranja transition-colors text-sm">Portfólio</Link></li>
                <li><Link href="/contato" className="text-t-white-70 hover:text-laranja transition-colors text-sm">Contato</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-titulo font-bold text-lg mb-2 text-white">Contato</h3>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-laranja shrink-0 mt-0.5" />
              <p className="text-t-white-70 text-sm">{address}<br />{cityState}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-laranja shrink-0" />
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-t-white-70 hover:text-white transition-colors text-sm">{phone}</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-laranja shrink-0" />
              <a href={`mailto:${email}`} className="text-t-white-70 hover:text-white transition-colors text-sm">{email}</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-t-muted text-xs">© {new Date().getFullYear()} {companyName} — CNPJ {general.cnpj || '00.000.000/0000-00'}</p>
        </div>
      </div>
    </footer>
  );
}