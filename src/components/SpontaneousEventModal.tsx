import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Dog, Heart } from 'lucide-react';
import { SpontaneousEvent } from '../types';

interface SpontaneousEventModalProps {
  event: SpontaneousEvent;
  petName: string;
  onComplete: (choice: 'A' | 'B') => void;
  onClose: () => void;
}

export default function SpontaneousEventModal({
  event,
  petName,
  onComplete,
  onClose,
}: SpontaneousEventModalProps) {
  const [chosen, setChosen] = useState<'A' | 'B' | null>(null);

  const handleChoose = (choice: 'A' | 'B') => {
    setChosen(choice);
  };

  const handleFinish = () => {
    if (chosen) {
      onComplete(chosen);
    }
  };

  const currentChoiceData = chosen === 'A' ? event.choiceA : event.choiceB;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF9] border-2 border-[#F4D396] rounded-[26px] max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#F4D396] text-[#806F66] hover:text-[#3D2B24] flex items-center justify-center cursor-pointer shadow-2xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER BADGE */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-montserrat font-bold px-2.5 py-0.5 rounded-full border border-[#FDE68A] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D97706]" /> EVENTO ESPONTÁNEO
          </span>
          <span className="text-[11px] text-[#806F66] font-montserrat">
            Momentos con {petName}
          </span>
        </div>

        {!chosen ? (
          <div className="flex flex-col items-center text-center">
            {/* ANIMATED BIG EMOJI */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-[#FFF5E5] border-2 border-[#F4B942] flex items-center justify-center text-4xl shadow-sm mb-3"
            >
              {event.icon}
            </motion.div>

            <h3 className="font-montserrat font-bold text-xl text-[#3D2B24]">
              {event.title}
            </h3>

            <p className="font-montserrat text-xs sm:text-sm text-[#5C453B] mt-1.5 px-2">
              {event.description}
            </p>

            <div className="bg-[#FFF8EE] border border-[#F4D396] rounded-2xl p-3.5 mt-3 w-full text-left">
              <div className="flex items-center gap-1.5 mb-1 text-[#B45309] font-bold text-xs font-montserrat">
                <Dog className="w-3.5 h-3.5" /> {petName}:
              </div>
              <p className="font-montserrat text-xs sm:text-sm text-[#3D2B24] italic">
                "{event.dialogue}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-4">
              <button
                onClick={() => handleChoose('A')}
                className="py-3 px-3 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>{event.choiceA.label}</span>
                <span className="text-[10px] opacity-85 font-normal">
                  +{event.choiceA.rewardXp || 25} XP • +{event.choiceA.rewardCoins || 20} 🪙
                </span>
              </button>

              {event.choiceB && (
                <button
                  onClick={() => handleChoose('B')}
                  className="py-3 px-3 bg-white border border-[#F4D396] hover:bg-[#FFF8EE] text-[#5C453B] font-montserrat font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5"
                >
                  <span>{event.choiceB.label}</span>
                  <span className="text-[10px] text-[#806F66] font-normal">
                    +{event.choiceB.rewardXp || 25} XP • +{event.choiceB.rewardCoins || 20} 🪙
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-2"
          >
            <div className="w-16 h-16 rounded-full bg-[#FFF0D4] border border-[#F4B942] flex items-center justify-center text-3xl shadow-sm mb-3">
              💖
            </div>

            <h3 className="font-montserrat font-bold text-lg text-[#3D2B24]">
              {event.title}
            </h3>

            <div className="bg-[#FFF8EE] border border-[#F4D396] rounded-2xl p-4 my-3 w-full text-left">
              <p className="font-montserrat text-sm text-[#3D2B24] leading-relaxed">
                {currentChoiceData?.reaction}
              </p>
            </div>

            {/* REWARDS */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-[#ECFDF5] text-[#065F46] font-montserrat font-semibold text-xs px-3 py-1 rounded-full border border-[#A7F3D0]">
                +{currentChoiceData?.rewardXp || 25} XP
              </span>
              <span className="bg-[#FEF9C3] text-[#854D0E] font-montserrat font-semibold text-xs px-3 py-1 rounded-full border border-[#FDE047]">
                +{currentChoiceData?.rewardCoins || 20} 🪙
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Continuar 🐾
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
