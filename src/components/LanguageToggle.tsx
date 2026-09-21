import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-[16px] bg-[#FFFDF9] border border-[#F4D396]/60 text-[#3D2B24] hover:bg-[#FFF8EE] transition-all flex items-center gap-1.5 text-xs font-montserrat font-medium cursor-pointer shadow-2xs"
      title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-[#F4B942]" />
      <span className="font-semibold text-[11px] uppercase tracking-wider text-[#3D2B24]">
        {lang === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
