import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const FloatingWhatsApp: React.FC = () => {
  const { sections, getWhatsAppUrl } = useSettings();

  if (sections?.floatingWhatsApp === false) {
    return null;
  }

  return (
    <a
      href={getWhatsAppUrl("Hi ScaleUp Media! I'm on your website and want to discuss growing my brand.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
      <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-sm text-white px-0 group-hover:pl-2">
        Chat with us
      </span>
    </a>
  );
};
