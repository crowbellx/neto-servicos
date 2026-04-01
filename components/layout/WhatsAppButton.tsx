'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ArrowRight, Loader2 } from 'lucide-react';
import { trackWhatsAppClick } from '@/app/actions/whatsapp';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
}

export default function WhatsAppButton({
  number = '5511999999999',
  message = 'Olá! Vim pelo site e gostaria de um orçamento.',
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when form opens
  useEffect(() => {
    if (isFormOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isFormOpen]);

  // WhatsApp number mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }

    setPhone(value);
  };

  const handleButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setPhone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Record the lead with the phone number
      await trackWhatsAppClick(message, 'Floating Button', phone || undefined);
    } catch (err) {
      console.error('Error tracking WhatsApp:', err);
    } finally {
      setIsLoading(false);
    }

    // Redirect to WhatsApp regardless
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const handleSkip = () => {
    // If user doesn't want to share, just open WhatsApp and register anonymously
    trackWhatsAppClick(message, 'Floating Button').catch(console.error);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Mini-form popup */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MessageCircle size={18} />
                    <span className="text-sm font-bold">Falar no WhatsApp</span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Fechar"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Form body */}
                <form onSubmit={handleSubmit} className="p-4">
                  <p className="text-sm text-gray-600 mb-3 leading-snug">
                    Informe seu WhatsApp para guardarmos seu contato:
                  </p>

                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || phone.length < 14}
                      className="bg-[#25D366] text-white rounded-lg px-3 py-2 hover:bg-[#20b957] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      aria-label="Continuar para o WhatsApp"
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
                  >
                    Pular e ir para o WhatsApp →
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <div className="group">
            <button
              onClick={handleButtonClick}
              className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 relative"
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle size={28} />

              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20" />
            </button>

            {/* Tooltip */}
            {!isFormOpen && (
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-grafite text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Falar no WhatsApp
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-grafite"></div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
