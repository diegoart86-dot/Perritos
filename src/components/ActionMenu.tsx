import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveBehavior, ThoughtResponse } from '../types';
import { Utensils, Bath, Moon, Sun, Sparkles, Languages, BookOpen, Volume2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ActionMenuProps {
  activeBehavior: ActiveBehavior;
  isSleeping: boolean;
  onFeed: (foodType: 'kibble' | 'bone' | 'steak') => void;
  onBath: (stage: 'water' | 'shampoo' | 'rinse' | 'dry') => void;
  onToggleSleep: () => void;
  onPlayFetch: () => void;
  onTranslateBark: () => void;
  onOpenDiary: () => void;
  aiThought: ThoughtResponse | null;
  isTranslating: boolean;
  isShaking: boolean;
  onSelectScene?: (scene: 'eating' | 'bathroom' | 'bedroom' | 'patio') => void;
}

export default function ActionMenu({
  activeBehavior,
  isSleeping,
  onFeed,
  onBath,
  onToggleSleep,
  onPlayFetch,
  onTranslateBark,
  onOpenDiary,
  aiThought,
  isTranslating,
  onSelectScene,
}: ActionMenuProps) {
  const { t } = useLanguage();
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const [showBathDropdown, setShowBathDropdown] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3.5 select-none">
      {/* 1. DYNAMIC AI THOUGHT TRANSLATION SPEECH BUBBLE */}
      <AnimatePresence>
        {aiThought && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="relative bg-[#FFFDF9] border border-[#F4D396] text-[#3D2B24] p-4 rounded-[22px] shadow-[0_4px_16px_rgba(90,56,40,0.06)] text-xs sm:text-sm"
          >
            <div className="flex items-center gap-1.5 font-montserrat font-medium text-[#F4B942] text-[11px] uppercase tracking-wider mb-1">
              <Volume2 className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>{t('translatorTitle')}</span>
            </div>
            <p className="font-montserrat font-normal italic text-[#3D2B24] text-xs sm:text-[13px] leading-relaxed">
              "{aiThought.thought}"
            </p>
            {aiThought.actionHint && (
              <div className="mt-2 inline-flex items-center gap-1 bg-[#FFF8EE] px-2.5 py-1 rounded-full border border-[#F4D396]/60 text-[11px] text-[#806F66] font-montserrat font-normal">
                <span>💡 {t('hintLabel')}</span>
                <span className="text-[#3D2B24] font-medium">{aiThought.actionHint}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PRIMARY ACTION BUTTON MATRIX (Comer, Baño, Dormir, Jugar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* BUTTON: COMER (with Dropdown) */}
        <div className="relative">
          <motion.button
            whileHover={!isSleeping ? { scale: 1.02 } : {}}
            whileTap={!isSleeping ? { scale: 0.97 } : {}}
            onClick={() => {
              if (isSleeping) return;
              onSelectScene?.('eating');
              setShowFoodDropdown(!showFoodDropdown);
              setShowBathDropdown(false);
            }}
            disabled={isSleeping}
            className={`w-full py-3.5 px-3 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm flex flex-col items-center gap-1.5 shadow-[0_2px_8px_rgba(90,56,40,0.04)] border transition-all cursor-pointer ${
              isSleeping
                ? 'bg-[#FFF8EE]/40 border-[#F4D396]/30 text-[#806F66]/40 cursor-not-allowed'
                : showFoodDropdown
                ? 'bg-[#FFF0D4] border-[#F4B942] text-[#3D2B24]'
                : 'bg-white border-[#F4D396]/70 text-[#3D2B24] hover:bg-[#FFF8EE]'
            }`}
          >
            <div className="p-1.5 rounded-full bg-[#FFF9EE] text-[#F4B942]">
              <Utensils className="w-4 h-4" />
            </div>
            <span>{t('feedBtn')}</span>
          </motion.button>

          {/* Food Dropdown */}
          <AnimatePresence>
            {showFoodDropdown && !isSleeping && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[20px] p-1.5 shadow-[0_10px_30px_rgba(90,56,40,0.12)] border border-[#F4D396] flex flex-col gap-1 z-30"
              >
                <button
                  onClick={() => {
                    onSelectScene?.('eating');
                    onFeed('kibble');
                    setShowFoodDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#FFF8EE] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('kibble')}</span>
                  <span className="text-[#806F66] text-[10px] font-medium">+15</span>
                </button>
                <button
                  onClick={() => {
                    onSelectScene?.('eating');
                    onFeed('bone');
                    setShowFoodDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#FFF8EE] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('bone')}</span>
                  <span className="text-[#806F66] text-[10px] font-medium">+30</span>
                </button>
                <button
                  onClick={() => {
                    onSelectScene?.('eating');
                    onFeed('steak');
                    setShowFoodDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#FFF8EE] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('steak')}</span>
                  <span className="text-[#806F66] text-[10px] font-medium">+60</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BUTTON: BAÑO (with Stages Dropdown) */}
        <div className="relative">
          <motion.button
            whileHover={!isSleeping ? { scale: 1.02 } : {}}
            whileTap={!isSleeping ? { scale: 0.97 } : {}}
            onClick={() => {
              if (isSleeping) return;
              onSelectScene?.('bathroom');
              setShowBathDropdown(!showBathDropdown);
              setShowFoodDropdown(false);
            }}
            disabled={isSleeping}
            className={`w-full py-3.5 px-3 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm flex flex-col items-center gap-1.5 shadow-[0_2px_8px_rgba(90,56,40,0.04)] border transition-all cursor-pointer ${
              isSleeping
                ? 'bg-[#FFF8EE]/40 border-[#F4D396]/30 text-[#806F66]/40 cursor-not-allowed'
                : showBathDropdown
                ? 'bg-[#DDECF7] border-[#93C5FD] text-[#3D2B24]'
                : 'bg-white border-[#F4D396]/70 text-[#3D2B24] hover:bg-[#FFF8EE]'
            }`}
          >
            <div className="p-1.5 rounded-full bg-[#EFF6FF] text-[#60A5FA]">
              <Bath className="w-4 h-4" />
            </div>
            <span>{t('bathBtn')}</span>
          </motion.button>

          {/* Bath Stages Dropdown */}
          <AnimatePresence>
            {showBathDropdown && !isSleeping && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[20px] p-1.5 shadow-[0_10px_30px_rgba(90,56,40,0.12)] border border-[#93C5FD] flex flex-col gap-1 z-30"
              >
                <button
                  onClick={() => {
                    onSelectScene?.('bathroom');
                    onBath('water');
                    setShowBathDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#EFF6FF] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('bathWater')}</span>
                  <span className="text-[#60A5FA] text-xs">●</span>
                </button>
                <button
                  onClick={() => {
                    onSelectScene?.('bathroom');
                    onBath('shampoo');
                    setShowBathDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#EFF6FF] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('bathShampoo')}</span>
                  <span className="text-[#60A5FA] text-xs">●</span>
                </button>
                <button
                  onClick={() => {
                    onSelectScene?.('bathroom');
                    onBath('rinse');
                    setShowBathDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#EFF6FF] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('bathRinse')}</span>
                  <span className="text-[#60A5FA] text-xs">●</span>
                </button>
                <button
                  onClick={() => {
                    onSelectScene?.('bathroom');
                    onBath('dry');
                    setShowBathDropdown(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-[#EFF6FF] rounded-[14px] text-xs font-montserrat font-normal text-[#3D2B24] flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span>{t('bathDry')}</span>
                  <span className="text-[#F4B942] text-[10px] font-medium">+XP</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BUTTON: DORMIR */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onSelectScene?.('bedroom');
            onToggleSleep();
          }}
          className={`w-full py-3.5 px-3 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm flex flex-col items-center gap-1.5 shadow-[0_2px_8px_rgba(90,56,40,0.04)] border transition-all cursor-pointer ${
            isSleeping
              ? 'bg-[#312E81] border-[#4338CA] text-white hover:bg-[#3730A3]'
              : 'bg-white border-[#F4D396]/70 text-[#3D2B24] hover:bg-[#FFF8EE]'
          }`}
        >
          <div
            className={`p-1.5 rounded-full ${
              isSleeping ? 'bg-[#4338CA] text-[#FBBF24]' : 'bg-[#EEF2FF] text-[#818CF8]'
            }`}
          >
            {isSleeping ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <span>{isSleeping ? t('wakeBtn') : t('sleepBtn')}</span>
        </motion.button>

        {/* BUTTON: JUGAR / LANZAR PELOTA */}
        <motion.button
          whileHover={!isSleeping && activeBehavior !== ActiveBehavior.Fetch ? { scale: 1.02 } : {}}
          whileTap={!isSleeping && activeBehavior !== ActiveBehavior.Fetch ? { scale: 0.97 } : {}}
          onClick={() => {
            onSelectScene?.('patio');
            onPlayFetch();
          }}
          disabled={isSleeping || activeBehavior === ActiveBehavior.Fetch}
          className={`w-full py-3.5 px-3 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm flex flex-col items-center gap-1.5 shadow-[0_2px_8px_rgba(90,56,40,0.04)] border transition-all cursor-pointer ${
            isSleeping || activeBehavior === ActiveBehavior.Fetch
              ? 'bg-[#FFF8EE]/40 border-[#F4D396]/30 text-[#806F66]/40 cursor-not-allowed'
              : 'bg-white border-[#F4D396]/70 text-[#3D2B24] hover:bg-[#FFF8EE]'
          }`}
        >
          <div className="p-1.5 rounded-full bg-[#ECFDF5] text-[#10B981]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{t('playBtn')}</span>
        </motion.button>
      </div>

      {/* 3. SECONDARY AI TOOLS (Traductor Canino & Diario Secreto) */}
      <div className="flex gap-2.5">
        <motion.button
          whileHover={!isSleeping && !isTranslating ? { scale: 1.01 } : {}}
          whileTap={!isSleeping && !isTranslating ? { scale: 0.98 } : {}}
          onClick={onTranslateBark}
          disabled={isSleeping || isTranslating}
          className={`flex-1 py-3 px-4 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(90,56,40,0.04)] border transition-all cursor-pointer ${
            isSleeping || isTranslating
              ? 'bg-[#FFF8EE]/40 border-[#F4D396]/30 text-[#806F66]/40 cursor-not-allowed'
              : 'bg-[#FFF8EE] border-[#F4D396] text-[#3D2B24] hover:bg-[#FFF0D4]'
          }`}
        >
          <Languages className="w-4 h-4 text-[#F4B942]" />
          <span>{isTranslating ? t('translatingBtn') : t('translateBtn')}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenDiary}
          className="py-3 px-4 rounded-[20px] font-montserrat font-medium text-xs sm:text-sm bg-white border border-[#F4D396] text-[#3D2B24] hover:bg-[#FFF8EE] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(90,56,40,0.04)] cursor-pointer transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#10B981]" />
          <span>{t('diaryBtn')}</span>
        </motion.button>
      </div>
    </div>
  );
}

