import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award, Dog } from 'lucide-react';
import { MischiefItem } from '../types';

interface MischiefModalProps {
  mischief: MischiefItem;
  petName: string;
  isDaily?: boolean;
  onComplete: (choice: 'A' | 'B', rewardXp: number, rewardCoins: number) => void;
  onClose: () => void;
}

export default function MischiefModal({
  mischief,
  petName,
  isDaily = false,
  onComplete,
  onClose,
}: MischiefModalProps) {
  const [step, setStep] = useState<'intro' | 'action' | 'result'>('intro');
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [caughtSuccess, setCaughtSuccess] = useState(false);

  // If user chooses action
  const handleSelectChoice = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    
    // If choice A is catch or grab, do a quick interactive animation
    if (choice === 'A' && (mischief.id === 'mischief-sock' || mischief.id === 'mischief-slipper')) {
      setIsCatching(true);
      setTimeout(() => {
        setIsCatching(false);
        setCaughtSuccess(true);
        setStep('result');
      }, 1000);
    } else {
      setStep('result');
    }
  };

  const handleFinish = () => {
    if (!selectedChoice) return;
    const choiceData = selectedChoice === 'A' ? mischief.choiceA : mischief.choiceB;
    // Add bonus if daily mischief
    const xpBonus = isDaily ? choiceData.rewardXp + 25 : choiceData.rewardXp;
    const coinsBonus = isDaily ? choiceData.rewardCoins + 20 : choiceData.rewardCoins;
    onComplete(selectedChoice, xpBonus, coinsBonus);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF9] border-2 border-[#F4D396] rounded-[26px] max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#F4D396] text-[#806F66] hover:text-[#3D2B24] flex items-center justify-center cursor-pointer shadow-2xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER BADGE */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border border-[#FDE68A] flex items-center gap-1">
            {isDaily ? '🐾 TRAVESURA DEL DÍA' : '🧦 TRAVESURA EN ACCIÓN'}
          </span>
          {isDaily && (
            <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              Misión especial diaria
            </span>
          )}
        </div>

        {/* INTRO OR CATCHING STAGE */}
        {step === 'intro' && (
          <div className="flex flex-col items-center text-center">
            {/* BIG ANIMATED ICON */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-3xl bg-[#FFF5E5] border-2 border-[#F4B942] flex items-center justify-center text-5xl shadow-sm mb-3"
            >
              {mischief.icon}
            </motion.div>

            <h3 className="font-montserrat font-bold text-xl text-[#3D2B24]">
              {mischief.title}
            </h3>

            <div className="bg-[#FFF8EE] border border-[#F4D396] rounded-2xl p-3.5 mt-3 w-full text-left">
              <div className="flex items-center gap-2 mb-1 text-[#B45309] font-bold text-xs font-montserrat">
                <Dog className="w-3.5 h-3.5" /> {petName} dice:
              </div>
              <p className="font-montserrat text-sm text-[#3D2B24] italic">
                "{mischief.dialogue}"
              </p>
            </div>

            <p className="font-montserrat text-xs text-[#806F66] mt-3 px-2">
              {mischief.description}
            </p>

            {/* DECISION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-5">
              <button
                onClick={() => handleSelectChoice('A')}
                className="py-3 px-3 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span>{mischief.choiceA.label}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  +{isDaily ? mischief.choiceA.rewardXp + 25 : mischief.choiceA.rewardXp} XP • +{isDaily ? mischief.choiceA.rewardCoins + 20 : mischief.choiceA.rewardCoins} 🪙
                </span>
              </button>

              <button
                onClick={() => handleSelectChoice('B')}
                className="py-3 px-3 bg-white border border-[#F4D396] hover:bg-[#FFF8EE] text-[#5C453B] font-montserrat font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-transform active:scale-95 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <span>{mischief.choiceB.label}</span>
                <span className="text-[10px] text-[#806F66] font-normal">
                  +{isDaily ? mischief.choiceB.rewardXp + 25 : mischief.choiceB.rewardXp} XP • +{isDaily ? mischief.choiceB.rewardCoins + 20 : mischief.choiceB.rewardCoins} 🪙
                </span>
              </button>
            </div>
          </div>
        )}

        {/* CATCHING RUNNING ANIMATION */}
        {isCatching && (
          <div className="py-8 flex flex-col items-center text-center">
            <motion.div
              animate={{ x: [-80, 80, -80], scaleX: [1, -1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="text-5xl mb-4"
            >
              🐕💨 {mischief.icon}
            </motion.div>
            <h4 className="font-montserrat font-bold text-base text-[#3D2B24]">
              ¡Corriendo detrás de {petName}!
            </h4>
            <p className="text-xs font-montserrat text-[#806F66] mt-1">
              ¡Cuidado con la curva de la alfombra!
            </p>
          </div>
        )}

        {/* RESULT STAGE */}
        {step === 'result' && selectedChoice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-2"
          >
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-3xl shadow-sm mb-3">
              🎉
            </div>

            <h3 className="font-montserrat font-bold text-lg text-[#3D2B24]">
              {selectedChoice === 'A' ? '¡Misión cumplida!' : '¡Momento divertido!'}
            </h3>

            <div className="bg-[#FFF8EE] border border-[#F4D396] rounded-2xl p-4 my-3 w-full text-left">
              <p className="font-montserrat text-sm text-[#3D2B24] leading-relaxed">
                {selectedChoice === 'A' ? mischief.choiceA.text : mischief.choiceB.text}
              </p>
            </div>

            {/* REWARDS SUMMARY */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-[#ECFDF5] text-[#065F46] font-montserrat font-semibold text-xs px-3 py-1 rounded-full border border-[#A7F3D0]">
                +{isDaily ? (selectedChoice === 'A' ? mischief.choiceA.rewardXp + 25 : mischief.choiceB.rewardXp + 25) : (selectedChoice === 'A' ? mischief.choiceA.rewardXp : mischief.choiceB.rewardXp)} XP
              </span>
              <span className="bg-[#FEF9C3] text-[#854D0E] font-montserrat font-semibold text-xs px-3 py-1 rounded-full border border-[#FDE047]">
                +{isDaily ? (selectedChoice === 'A' ? mischief.choiceA.rewardCoins + 20 : mischief.choiceB.rewardCoins + 20) : (selectedChoice === 'A' ? mischief.choiceA.rewardCoins : mischief.choiceB.rewardCoins)} 🪙
              </span>
              {isDaily && (
                <span className="bg-[#FFF7ED] text-[#9A3412] font-montserrat font-semibold text-xs px-3 py-1 rounded-full border border-[#FED7AA]">
                  +2 🦴 Huesos
                </span>
              )}
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              ¡Genial, continuar! 🐾
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
