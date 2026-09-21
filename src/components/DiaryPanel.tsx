import React from 'react';
import { motion } from 'motion/react';
import { GameState, DiaryEntry } from '../types';
import { Book, Feather, Calendar, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DiaryPanelProps {
  gameState: GameState;
  diaryEntries: DiaryEntry[];
  onGenerateEntry: () => void;
  isGenerating: boolean;
  onClose: () => void;
}

export default function DiaryPanel({
  gameState,
  diaryEntries,
  onGenerateEntry,
  isGenerating,
  onClose,
}: DiaryPanelProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed inset-0 bg-[#3D2B24]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        className="w-full max-w-lg bg-white rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(61,43,36,0.14)] border border-[#F4D396] flex flex-col max-h-[85vh] font-montserrat"
      >
        {/* Header */}
        <div className="bg-[#FFF8EE] p-4.5 text-[#3D2B24] flex justify-between items-center border-b border-[#F4D396]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#FFF0D4] border border-[#F4D396] flex items-center justify-center text-[#F4B942]">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#3D2B24]">{t('diaryTitle')}</h3>
              <p className="text-[11px] text-[#806F66]">
                {lang === 'es' 
                  ? `Las memorias de ${gameState.petName} · ${gameState.daysTogether} días juntos` 
                  : `${gameState.petName}'s memories · ${gameState.daysTogether} days together`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#806F66] hover:text-[#3D2B24] hover:bg-[#FFF0D4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll of entries */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#FFFDF9]">
          {/* AI Generation prompt button at the top */}
          <div className="bg-white border border-[#F4D396]/60 p-4 rounded-[22px] shadow-2xs text-center flex flex-col gap-2.5">
            <p className="text-xs text-[#3D2B24] font-medium leading-relaxed">
              {lang === 'es'
                ? `¿Quieres que ${gameState.petName} redacte una página sobre las travesuras y momentos que compartieron hoy?`
                : `Would you like ${gameState.petName} to write a page about today's adventures together?`}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGenerateEntry}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-[18px] bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] font-semibold text-xs flex items-center justify-center gap-2 border border-[#E29E2E] shadow-xs cursor-pointer transition-colors disabled:bg-stone-200 disabled:border-stone-300 disabled:text-stone-400"
            >
              <Feather className="w-4 h-4 text-[#3D2B24]" />
              <span>{isGenerating ? t('diaryGenerating') : t('diaryWriteToday')}</span>
            </motion.button>
          </div>

          {/* List of logged entries */}
          {diaryEntries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-[#806F66]">
              <Book className="w-10 h-10 stroke-1 mb-2 text-[#F4B942]" />
              <p className="font-semibold text-sm text-[#3D2B24]">{t('diaryEmpty')}</p>
              <p className="text-xs max-w-xs mt-1 text-[#806F66]">
                {t('diaryEmptyPrompt')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {diaryEntries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-[22px] p-4 border border-[#F4D396]/50 shadow-2xs relative overflow-hidden text-[#3D2B24]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#F4B942]" />
                  
                  {/* Date Metadata */}
                  <div className="flex justify-between items-center text-[10px] text-[#806F66] font-medium mb-2.5 border-b border-[#FFF0D4] pb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                      {entry.date}
                    </span>
                    <span className="text-[#F4B942] font-semibold">
                      {lang === 'es' ? `Día #${diaryEntries.length - idx}` : `Day #${diaryEntries.length - idx}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-xs sm:text-sm text-[#3D2B24] leading-tight mb-2">
                    {entry.title}
                  </h4>

                  {/* Content body */}
                  <p className="text-xs text-[#806F66] leading-relaxed whitespace-pre-line font-normal">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF8EE] border-t border-[#F4D396]/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[18px] bg-[#3D2B24] text-white font-medium text-xs hover:bg-[#5A3828] transition-colors cursor-pointer shadow-xs"
          >
            {t('closeDiary')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

