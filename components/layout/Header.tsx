'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, MousePointerClick, Monitor, List, X } from 'lucide-react';

interface HeaderProps {
  general?: any;
}

export default function Header({ general = {} }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: 'Gráfica',
      description: 'Impressão, banners e papelaria',
      icon: Printer,
      href: '/servicos#grafica',
      color: 'text-teal',
      bgHover: 'hover:bg-teal-light',
    },
    {
      title: 'Design',
      description: 'Identidade visual e criação',
      icon: MousePointerClick,
      href: '/servicos#design',
      color: 'text-roxo',
      bgHover: 'hover:bg-roxo-light',
    },
    {
      title: 'Digital',
      description: 'Sites, lojas e sistemas',
      icon: Monitor,
      href: '/servicos#digital',
      color: 'text-azul',
      bgHover: 'hover:bg-azul-light',
    },
  ];

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sobre', href: '/sobre' },
  ];

  const companyName = general.companyName || 'Neto Serviços';

  function isNavActive(href: string) {
    if (href === '/blog') return pathname.startsWith('/blog');
    if (href === '/portfolio') return pathname.startsWith('/portfolio');
    return pathname === href;
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 rounded-lg bg-g-marca flex items-center justify-center text-white font-bold text-xl">
            {companyName.charAt(0)}
          </div>
          <span className="font-titulo font-bold text-xl tracking-tight text-t-primary">
            {companyName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-laranja ${
              pathname === '/' ? 'text-laranja' : 'text-t-secondary'
            }`}
          >
            Início
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link
              href="/servicos"
              className={`text-sm font-medium transition-colors hover:text-laranja py-2 ${
                pathname.startsWith('/servicos') ? 'text-laranja' : 'text-t-secondary'
              }`}
            >
              Serviços
            </Link>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-md border border-black/5 overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-1">
                    {services.map((service) => (
                      <Link
                        key={service.title}
                        href={service.href}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${service.bgHover} group`}
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <div className={`mt-0.5 ${service.color}`}>
                          <service.icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-t-primary group-hover:text-laranja transition-colors">
                            {service.title}
                          </div>
                          <div className="text-xs text-t-muted line-clamp-1">
                            {service.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-laranja relative group ${
                isNavActive(link.href) ? 'text-laranja' : 'text-t-secondary'
              }`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-laranja transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contato"
            className="bg-laranja text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#D4651A] hover:scale-105 active:scale-95 transition-all shadow-cor"
          >
            Fale Conosco
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-t-primary z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl lg:hidden flex flex-col pt-24 px-6 pb-6 overflow-y-auto"
              >
                <div className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-lg font-medium py-3 border-b border-black/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Início
                  </Link>
                  
                  <div className="py-3 border-b border-black/5">
                    <div className="text-lg font-medium mb-3">Serviços</div>
                    <div className="flex flex-col gap-3 pl-4">
                      {services.map((service) => (
                        <Link
                          key={service.title}
                          href={service.href}
                          className="flex items-center gap-3 text-t-secondary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <service.icon size={18} className={service.color} />
                          <span>{service.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {navLinks.slice(1).map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium py-3 border-b border-black/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    href="/contato"
                    className="flex justify-center bg-laranja text-white px-6 py-4 rounded-full text-base font-medium w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Fale Conosco
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
