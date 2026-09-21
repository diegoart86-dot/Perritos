import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className={`p-1.5 sm:p-2 rounded-[14px] transition-all border cursor-pointer active:scale-95 flex items-center justify-center ${
        isDark
          ? 'bg-[#382B24] border-[#F4B942]/60 text-[#FFD477] hover:bg-[#45342B] shadow-xs'
          : 'bg-[#FFFDF9] border-[#F4D396]/60 text-[#806F66] hover:bg-[#FFF8EE] hover:text-[#3D2B24] shadow-2xs'
      }`}
      title={isDark ? t('themeToggleLight') : t('themeToggleDark')}
      aria-label={isDark ? t('themeToggleLight') : t('themeToggleDark')}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#FFD477] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#806F66] hover:text-[#5A3828] transition-transform duration-300" />
      )}
    </button>
  );
}
