import React from 'react';
import { motion } from 'motion/react';
import { GameState, Achievement } from '../types';
import { Trophy, CheckCircle, Coins, Award, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AchievementsPanelProps {
  gameState: GameState;
  onClaimReward: (id: string) => void;
  onClose: () => void;
}

export default function AchievementsPanel({
  gameState,
  onClaimReward,
  onClose,
}: AchievementsPanelProps) {
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
        <div className="bg-[#FFF8EE] border-b border-[#F4D396]/60 p-4.5 text-[#3D2B24] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#FFF0D4] border border-[#F4D396] flex items-center justify-center text-[#F4B942]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#3D2B24]">{t('achievementsTitle')}</h3>
              <p className="text-[11px] text-[#806F66]">
                {gameState.achievements.filter((a) => a.completed).length} {lang === 'es' ? 'de' : 'of'} {gameState.achievements.length} {lang === 'es' ? 'completados' : 'completed'}
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

        {/* List of achievements */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FFFDF9]">
          {gameState.achievements.map((ach) => {
            const percentage = Math.min((ach.progress / ach.target) * 100, 100);
            const isFinished = ach.progress >= ach.target;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-[22px] border transition-all ${
                  ach.completed
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isFinished
                      ? 'bg-[#FFF8EE] border-[#F4B942] shadow-[0_2px_10px_rgba(244,185,66,0.15)]'
                      : 'bg-white border-[#F4D396]/40 shadow-2xs'
                } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}
              >
                {/* Info and Progress */}
                <div className="flex-1 flex gap-3 items-start">
                  <span className="text-3xl p-2 bg-[#FFF8EE] rounded-[16px] border border-[#F4D396]/30">{ach.icon}</span>
                  <div className="flex flex-col gap-1 w-full text-[#3D2B24]">
                    <h4 className="font-semibold text-xs flex items-center gap-1.5">
                      {ach.title}
                      {ach.completed && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                          {t('claimed')}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[#806F66] font-normal leading-relaxed">{ach.description}</p>

                    {/* Progress Bar (if not claimed) */}
                    {!ach.completed && (
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex justify-between items-center text-[10px] text-[#806F66] font-medium">
                          <span>{t('progress')}</span>
                          <span>
                            {ach.progress} / {ach.target}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#FFF0D4] rounded-full overflow-hidden border border-[#F4D396]/30">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isFinished ? 'bg-[#F4B942]' : 'bg-[#E29E2E]'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claim Rewards */}
                <div className="self-end sm:self-auto min-w-[110px] flex justify-end">
                  {ach.completed ? (
                    <div className="flex items-center gap-1 text-emerald-700 font-medium text-xs">
                      <CheckCircle className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                      <span>{t('completed')}</span>
                    </div>
                  ) : isFinished ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onClaimReward(ach.id)}
                      className="px-3.5 py-1.5 bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] font-semibold text-xs rounded-full shadow-xs flex items-center gap-1.5 border border-[#E29E2E] cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#3D2B24] fill-[#3D2B24]" />
                      <span>+{ach.rewardCoins} {t('coins')}</span>
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-1 text-[#806F66] font-medium text-[11px] bg-[#FFF8EE] border border-[#F4D396]/60 px-2.5 py-1 rounded-full shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-[#F4B942]" />
                      <span>+{ach.rewardCoins} {t('coins')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF8EE] border-t border-[#F4D396]/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[18px] bg-[#3D2B24] text-white font-medium text-xs hover:bg-[#5A3828] transition-colors cursor-pointer shadow-xs"
          >
            {t('close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

