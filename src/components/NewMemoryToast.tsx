import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye } from 'lucide-react';
import { PetMemory } from '../types';

interface NewMemoryToastProps {
  memory: PetMemory;
  onView: (memory: PetMemory) => void;
  onDismiss: () => void;
}

export default function NewMemoryToast({
  memory,
  onView,
  onDismiss,
}: NewMemoryToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[92vw] max-w-md bg-gradient-to-r from-[#FFF0D4] via-[#FFFDF9] to-[#FFF0D4] border-2 border-[#F4B942] rounded-2xl p-4 shadow-[0_10px_30px_rgba(217,119,6,0.25)] flex items-center gap-3.5"
    >
      {/* GLOWING ICON */}
      <div className="relative shrink-0">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-13 h-13 rounded-2xl bg-white border-2 border-[#F4B942] flex items-center justify-center text-3xl shadow-sm"
        >
          {memory.icon}
        </motion.div>
        <div className="absolute -top-1 -right-1 text-xs">✨</div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span className="text-[10px] font-montserrat font-bold tracking-wider uppercase text-[#B45309]">
            ¡NUEVO RECUERDO DESBLOQUEADO!
          </span>
        </div>
        <h4 className="font-montserrat font-bold text-sm text-[#3D2B24] truncate">
          {memory.title}
        </h4>
        <p className="font-montserrat text-xs text-[#806F66] line-clamp-1">
          {memory.description}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={() => onView(memory)}
          className="px-3 py-1.5 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Eye className="w-3 h-3" /> Ver
        </button>
        <button
          onClick={onDismiss}
          className="text-[10px] font-montserrat text-[#806F66] hover:text-[#3D2B24] text-center cursor-pointer py-0.5"
        >
          Cerrar
        </button>
      </div>
    </motion.div>
  );
}
