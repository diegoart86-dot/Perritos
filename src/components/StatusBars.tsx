import React from 'react';
import { motion } from 'motion/react';
import { GameState } from '../types';
import { Heart, Utensils, Moon, Sparkles, Gamepad2, Zap, Trophy, Coins, Pencil } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface StatusBarsProps {
  gameState: GameState;
  onOpenAchievements: () => void;
  onRenamePet?: () => void;
}

export default function StatusBars({ gameState, onOpenAchievements, onRenamePet }: StatusBarsProps) {
  const { t } = useLanguage();
  const { stats, level, experience, coins, petName } = gameState;

  // Level thresholds: 100 XP per level
  const xpNeeded = 100;
  const xpPercentage = Math.min((experience / xpNeeded) * 100, 100);

  const getBarColor = (key: string, val: number) => {
    if (val <= 20) return '#EF4444';
    switch (key) {
      case 'love':
        return '#F5A6A6';
      case 'hunger':
        return '#F4B942';
      case 'sleep':
        return '#A5B4FC';
      case 'cleanliness':
        return '#93C5FD';
      case 'fun':
        return '#86EFAC';
      case 'energy':
        return '#FBBF24';
      default:
        return '#F4B942';
    }
  };

  const statItems = [
    { key: 'love', label: t('statLove'), value: stats.love, icon: Heart, color: '#F5A6A6', bg: 'bg-[#FDF2F2]' },
    { key: 'hunger', label: t('statHunger'), value: stats.hunger, icon: Utensils, color: '#F4B942', bg: 'bg-[#FFF9EE]' },
    { key: 'sleep', label: t('statSleep'), value: stats.sleep, icon: Moon, color: '#818CF8', bg: 'bg-[#EEF2FF]' },
    { key: 'cleanliness', label: t('statCleanliness'), value: stats.cleanliness, icon: Sparkles, color: '#60A5FA', bg: 'bg-[#EFF6FF]' },
    { key: 'fun', label: t('statFun'), value: stats.fun, icon: Gamepad2, color: '#34D399', bg: 'bg-[#ECFDF5]' },
    { key: 'energy', label: t('statEnergy'), value: stats.energy, icon: Zap, color: '#F59E0B', bg: 'bg-[#FFFBEB]' },
  ];

  return (
    <div
      id="status-dashboard-container"
      className="w-full bg-white/95 backdrop-blur-md rounded-[24px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(90,56,40,0.06)] border border-[#F4D396]/60 flex flex-col gap-3.5 select-none"
    >
      {/* 1. Header: Name, Title, Coins & Achievements */}
      <div className="flex items-center justify-between gap-2 border-b border-[#F4D396]/30 pb-3">
        {/* Pet Name and Level Badge */}
        <div className="flex items-center gap-2">
          {onRenamePet ? (
            <button
              onClick={onRenamePet}
              className="group flex items-center gap-1.5 text-left cursor-pointer hover:opacity-85 transition-opacity"
              title="Haz clic para cambiar el nombre de tu mascota"
            >
              <h2 className="font-montserrat font-medium text-lg sm:text-xl text-[#3D2B24] tracking-tight flex items-center gap-1.5">
                🐾 {petName}
              </h2>
              <span className="w-6 h-6 rounded-full bg-[#FFF8EE] group-hover:bg-[#FFF0D4] border border-[#F4D396] flex items-center justify-center text-[#D97706] transition-colors shadow-2xs">
                <Pencil className="w-3 h-3" />
              </span>
            </button>
          ) : (
            <h2 className="font-montserrat font-medium text-lg sm:text-xl text-[#3D2B24] tracking-tight flex items-center gap-1.5">
              🐾 {petName}
            </h2>
          )}
          <span className="font-montserrat font-medium text-[11px] bg-[#FFF8EE] text-[#5A3828] px-2.5 py-0.5 rounded-full border border-[#F4D396]">
            {t('levelLabel')} {level}
          </span>
        </div>

        {/* Currency & Trophy Action Badges */}
        <div className="flex items-center gap-2">
          <motion.div
            id="coins-badge"
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-1.5 bg-[#FFF8EE] border border-[#F4D396] px-3 py-1 rounded-full text-[#3D2B24] font-montserrat font-medium text-xs shadow-xs"
          >
            <Coins className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
            <span className="font-montserrat font-medium">{coins}</span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenAchievements}
            className="p-1.5 rounded-full hover:bg-[#FFF8EE] bg-white text-[#5A3828] transition-colors border border-[#F4D396] shadow-xs flex items-center justify-center cursor-pointer"
            title={t('achievementsBtn')}
          >
            <Trophy className="w-3.5 h-3.5 text-[#F4B942]" />
          </motion.button>
        </div>
      </div>

      {/* 2. Sleek XP Bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[11px] font-montserrat text-[#806F66] px-0.5">
          <span className="font-montserrat font-normal text-[10px] tracking-wider uppercase text-[#806F66]/80">
            {t('xpLabel')}
          </span>
          <span className="font-montserrat font-medium text-[11px] text-[#3D2B24]">
            {experience} / {xpNeeded} XP
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#FFF8EE] rounded-full overflow-hidden border border-[#F4D396]/60 p-[1px]">
          <motion.div
            className="h-full bg-[#F4B942] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 3. Grid of Stats with Soft Warm Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
        {statItems.map((s) => {
          const Icon = s.icon;
          const barColor = getBarColor(s.key, s.value);
          const isCritical = s.value <= 20;


          return (
            <div
              key={s.label}
              className="bg-[#FFFDF9] border border-[#F4D396]/40 p-2.5 rounded-[18px] flex flex-col gap-1.5 shadow-[0_2px_8px_rgba(90,56,40,0.03)]"
            >
              <div className="flex justify-between items-center">
                <span className="font-montserrat font-normal text-[11px] text-[#3D2B24] flex items-center gap-1.5">
                  <span className={`p-1 rounded-md ${s.bg}`}>
                    <Icon className="w-3 h-3" style={{ color: s.color }} />
                  </span>
                  {s.label}
                </span>
                <span
                  className={`font-montserrat font-medium text-[11px] ${
                    isCritical ? 'text-red-500 font-semibold' : 'text-[#3D2B24]'
                  }`}
                >
                  {s.value}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#FFF8EE] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full transition-all"
                  style={{ backgroundColor: barColor }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
