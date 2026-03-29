import Link from 'next/link';
import { Instagram, Linkedin, MessageCircle, Dribbble, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-grafite text-white pt-20 pb-8 relative overflow-hidden">
      {/* Subtle noise/dot texture background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Identity */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-g-marca flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="font-titulo font-bold text-xl tracking-tight text-white">
                Neto Serviços
              </span>
            </Link>
            <p className="text-t-white-70 text-sm max-w-xs leading-relaxed">
              Do físico ao digital — em um só lugar. Gráfica, design e tecnologia integrados para construir a identidade completa da sua marca.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-magenta transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-azul transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-[#25D366] transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-grafite-mid flex items-center justify-center hover:bg-[#EA4C89] transition-colors">
                <Dribbble size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
            <div>
              <h3 className="font-titulo font-bold text-lg mb-6 text-white">Serviços</h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="/servicos#grafica" className="text-t-white-70 hover:text-teal transition-colors text-sm">
                    Gráfica
                  </Link>
                </li>
                <li>
                  <Link href="/servicos#design" className="text-t-white-70 hover:text-roxo transition-colors text-sm">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="/servicos#digital" className="text-t-white-70 hover:text-azul transition-colors text-sm">
                    Desenvolvimento Digital
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-titulo font-bold text-lg mb-6 text-white">Empresa</h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="/sobre" className="text-t-white-70 hover:text-laranja transition-colors text-sm">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="text-t-white-70 hover:text-laranja transition-colors text-sm">
                    Portfólio
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-t-white-70 hover:text-laranja transition-colors text-sm">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="font-titulo font-bold text-lg mb-2 text-white">Contato</h3>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-laranja shrink-0 mt-0.5" />
              <p className="text-t-white-70 text-sm">
                Rua Exemplo, 123 - Centro<br />
                São Paulo, SP - 01000-000
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-laranja shrink-0" />
              <a href="tel:+5511999999999" className="text-t-white-70 hover:text-white transition-colors text-sm">
                (11) 99999-9999
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-laranja shrink-0" />
              <a href="mailto:contato@netoservicos.com.br" className="text-t-white-70 hover:text-white transition-colors text-sm">
                contato@netoservicos.com.br
              </a>
            </div>
            <div className="mt-2">
              <p className="text-t-white-70 text-sm mb-3">Horário: Seg–Sex 8h–18h · Sáb 8h–12h</p>
              <div className="inline-flex items-center gap-2 bg-grafite-mid px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse"></div>
                <span className="text-xs font-medium text-white">Atendemos em todo o Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-t-muted text-xs">
            © {new Date().getFullYear()} Neto Serviços e Soluções — CNPJ 00.000.000/0000-00
          </p>
          <p className="text-t-muted text-xs">
            Desenvolvido por Neto Serviços e Soluções
          </p>
        </div>
      </div>
    </footer>
  );
}
