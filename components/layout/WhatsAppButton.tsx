'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
}

export default function WhatsAppButton({ number = '5511999999999', message = 'Olá! Vim pelo site e gostaria de um orçamento.' }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 relative"
            aria-label="Falar no WhatsApp"
          >
            <MessageCircle size={28} />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-grafite text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Falar no WhatsApp
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-grafite"></div>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
