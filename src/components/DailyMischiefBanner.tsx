import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { MischiefItem } from '../types';

interface DailyMischiefBannerProps {
  mischief: MischiefItem;
  petName: string;
  isCompletedToday: boolean;
  onPlay: () => void;
}

export default function DailyMischiefBanner({
  mischief,
  petName,
  isCompletedToday,
  onPlay,
}: DailyMischiefBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-[#FFF5E5] via-[#FFFDF9] to-[#FFF0D4] border border-[#F4D396] rounded-[22px] p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(90,56,40,0.04)] flex items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-white border border-[#F4B942] flex items-center justify-center text-2xl shadow-2xs shrink-0">
          {mischief.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1">
              🐾 TRAVESURA DEL DÍA
            </span>
            {isCompletedToday ? (
              <span className="bg-[#ECFDF5] text-[#059669] text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-[#A7F3D0] flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Completada
              </span>
            ) : (
              <span className="bg-[#FEF3C7] text-[#D97706] text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-[#FDE68A]">
                Hoy
              </span>
            )}
          </div>
          <h4 className="font-montserrat font-semibold text-xs sm:text-sm text-[#3D2B24] truncate mt-0.5">
            {isCompletedToday ? `¡${petName} cumplió su misión de hoy!` : mischief.title}
          </h4>
          <p className="font-montserrat text-[11px] text-[#806F66] truncate">
            {isCompletedToday
              ? 'Vuelve mañana para una nueva travesura de Golden.'
              : `Misión: ${mischief.dialogue}`}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {isCompletedToday ? (
          <div className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#E5E7EB] text-[11px] font-montserrat text-[#6B7280] font-medium">
            Mañana +🦴
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onPlay}
            className="px-3.5 py-2 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> JUGAR
          </motion.button>
        )}
      </div>
    </div>
  );
}
