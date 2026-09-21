import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Dog, Sparkles, Pencil } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface RenamePetModalProps {
  currentName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

const NAME_SUGGESTIONS = [
  'Golden Buddy', 'Max', 'Luna', 'Toby', 'Simba', 
  'Rocky', 'Bella', 'Zeus', 'Milo', 'Coco', 'Bruno'
];

export default function RenamePetModal({
  currentName,
  onSave,
  onClose,
}: RenamePetModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    if (trimmed.length > 20) {
      setError('El nombre debe tener máximo 20 caracteres.');
      return;
    }
    onSave(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-[#F4D396] rounded-[26px] max-w-sm w-full p-5 sm:p-6 shadow-2xl relative"
      >
        <button
          id="btn-close-rename"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF8EE] text-[#806F66] hover:text-[#3D2B24] flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5E5] border border-[#F4B942] flex items-center justify-center text-3xl shadow-inner mb-3">
            🐕
          </div>

          <h3 className="font-montserrat font-bold text-lg sm:text-xl text-[#3D2B24] flex items-center gap-1.5">
            Cambiar nombre
          </h3>
          <p className="font-montserrat text-xs text-[#806F66] mt-1 max-w-xs">
            Personaliza cómo llamarás a tu mascota en todos sus momentos y recuerdos.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col gap-3">
            <div className="relative">
              <input
                id="pet-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                maxLength={20}
                placeholder="Ej. Golden Buddy, Toby, Luna..."
                autoFocus
                className="w-full px-4 py-3 bg-[#FFFDF9] border-2 border-[#F4D396] rounded-xl text-center font-montserrat font-semibold text-[#3D2B24] text-base focus:outline-hidden focus:border-[#F4B942] transition-colors placeholder:text-gray-400"
              />
              <span className="absolute right-3 top-3.5 text-[10px] text-gray-400 font-montserrat">
                {name.length}/20
              </span>
            </div>

            {error && (
              <span className="text-xs text-rose-500 font-montserrat font-medium">
                {error}
              </span>
            )}

            {/* Quick Suggestions Pills */}
            <div className="flex flex-col items-start mt-1">
              <span className="text-[11px] font-montserrat font-medium text-[#806F66] mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Sugerencias populares:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {NAME_SUGGESTIONS.map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => {
                      setName(sugg);
                      setError('');
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-montserrat ${
                      name === sugg
                        ? 'bg-[#3D2B24] text-white border-[#3D2B24]'
                        : 'bg-[#FFF8EE] text-[#5C453B] border-[#F4D396]/80 hover:bg-[#FFF0D4]'
                    }`}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-2 border-t border-[#F4D396]/40">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-xs font-montserrat font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                id="btn-save-pet-name"
                type="submit"
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                Guardar nombre
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
