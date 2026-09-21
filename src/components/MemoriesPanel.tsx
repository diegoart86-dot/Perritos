import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Share2, Sparkles, Lock, CheckCircle2, Award, Calendar, 
  ChevronRight, Copy, Check, Camera, Upload, Trash2, Pencil, Image as ImageIcon, Loader2, AlertCircle
} from 'lucide-react';
import { PetMemory, GameState } from '../types';
import { calculateDominantPersonality } from '../memoriesData';
import { processPetPhoto } from '../utils/imageProcessor';

interface MemoriesPanelProps {
  gameState: GameState;
  memories: PetMemory[];
  onClose: () => void;
  selectedMemoryId?: string | null;
  onUpdateMemoryPhoto: (memoryId: string, photoUrl: string | undefined) => void;
  onOpenRenamePet?: () => void;
}

export default function MemoriesPanel({
  gameState,
  memories,
  onClose,
  selectedMemoryId,
  onUpdateMemoryPhoto,
  onOpenRenamePet,
}: MemoriesPanelProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'milestone' | 'mischief' | 'secret'>('all');
  const [viewingMemory, setViewingMemory] = useState<PetMemory | null>(() => {
    if (selectedMemoryId) {
      return memories.find((m) => m.id === selectedMemoryId) || null;
    }
    return null;
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isProcessingMemoryId, setIsProcessingMemoryId] = useState<string | null>(null);

  // Statistics
  const totalCount = memories.length;
  const unlockedCount = memories.filter((m) => m.unlocked).length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filter memories
  const filteredMemories = memories.filter((mem) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'secret') return mem.secret;
    return mem.category === activeFilter;
  });

  const personalityTrait = calculateDominantPersonality(gameState.personality);

  const handleOpenDetail = (memory: PetMemory) => {
    if (!memory.unlocked) return; // Locked memories don't open full details
    setViewingMemory(memory);
  };

  const handleUploadPhoto = async (file: File, memoryId: string) => {
    try {
      setIsProcessingMemoryId(memoryId);
      setErrorToast(null);

      const dataUrl = await processPetPhoto(file);
      onUpdateMemoryPhoto(memoryId, dataUrl);
      
      // Update local viewingMemory state if open
      if (viewingMemory && viewingMemory.id === memoryId) {
        setViewingMemory({
          ...viewingMemory,
          photoUrl: dataUrl,
        });
      }

      setUploadToast('¡Foto de tu mascota guardada en este recuerdo! 📸');
      setTimeout(() => setUploadToast(null), 3500);
    } catch (err: any) {
      console.error('Error procesando foto:', err);
      setErrorToast(err.message || 'No se pudo procesar la foto de tu celular. Intenta con otra imagen.');
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsProcessingMemoryId(null);
    }
  };

  const handleRemovePhoto = (memoryId: string) => {
    onUpdateMemoryPhoto(memoryId, undefined);
    if (viewingMemory && viewingMemory.id === memoryId) {
      setViewingMemory({
        ...viewingMemory,
        photoUrl: undefined,
      });
    }
    setUploadToast('Foto personalizada removida. Se muestra la foto predeterminada.');
    setTimeout(() => setUploadToast(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, memoryId: string) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUploadPhoto(e.dataTransfer.files[0], memoryId);
    }
  };

  const handleShare = async (memory: PetMemory) => {
    const shareText = `🐾 Golden Life - Recuerdo desbloqueado:\n"${memory.title}"\n${memory.description}\nCon mi mascota ${gameState.petName} (Nivel ${memory.levelRecorded || gameState.level} • Día ${memory.dayRecorded || gameState.daysTogether})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Golden Life: ${memory.title}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard modal
      }
    }

    // Open share modal
    setShowShareModal(true);
  };

  const handleCopyShareCard = () => {
    if (!viewingMemory) return;
    const shareText = `--------------------------------\n        GOLDEN LIFE\n       🐕 ${gameState.petName}\n\n   "${viewingMemory.title}"\n\n       ${viewingMemory.icon}\n\n       Nivel ${viewingMemory.levelRecorded || gameState.level}\n       Día ${viewingMemory.dayRecorded || gameState.daysTogether}\n\n       "${viewingMemory.description}"\n\n       Golden Life\n--------------------------------`;
    
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF9] border-2 border-[#F4D396] rounded-[28px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* PROCESSING SPINNER TOAST */}
        <AnimatePresence>
          {isProcessingMemoryId && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-70 bg-[#3D2B24] text-white text-xs font-montserrat font-medium px-4 py-2 rounded-full shadow-lg border border-[#F4D396] flex items-center gap-2"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F4B942]" />
              <span>Procesando foto de tu celular... 🐶📸</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR TOAST */}
        <AnimatePresence>
          {errorToast && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-70 bg-rose-700 text-white text-xs font-montserrat font-medium px-4 py-2 rounded-full shadow-lg border border-rose-400 flex items-center gap-2 max-w-[90%]"
            >
              <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
              <span className="truncate">{errorToast}</span>
              <button onClick={() => setErrorToast(null)} className="ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOAST NOTIFICATION FOR PHOTO UPLOAD */}
        <AnimatePresence>
          {uploadToast && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-60 bg-[#3D2B24] text-white text-xs font-montserrat font-medium px-4 py-2 rounded-full shadow-lg border border-[#F4D396] flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{uploadToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#FFF5E5] to-[#FFFDF9] p-4 sm:p-6 border-b border-[#F4D396]/60 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-[#F4D396] text-[#806F66] hover:text-[#3D2B24] hover:bg-[#FFF8EE] transition-all flex items-center justify-center cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0D4] border border-[#F4B942] flex items-center justify-center text-2xl shadow-xs shrink-0">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-montserrat font-bold text-xl sm:text-2xl text-[#3D2B24]">
                  Mis Recuerdos
                </h2>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  Álbum de Fotos
                </span>
                {/* RENAME PET BADGE BUTTON */}
                {onOpenRenamePet && (
                  <button
                    onClick={onOpenRenamePet}
                    className="inline-flex items-center gap-1 text-[11px] font-montserrat font-medium bg-white text-[#5C453B] px-2.5 py-0.5 rounded-full border border-[#F4D396] hover:bg-[#FFF0D4] transition-colors cursor-pointer shadow-2xs"
                    title="Cambiar el nombre de tu mascota"
                  >
                    <Pencil className="w-3 h-3 text-[#D97706]" />
                    <span>Mascota: <strong>{gameState.petName}</strong></span>
                  </button>
                )}
              </div>
              <p className="font-montserrat text-xs sm:text-sm text-[#806F66] mt-0.5">
                Guarda y adjunta fotos de cada acción y travesura vivida con {gameState.petName}.
              </p>
            </div>
          </div>

          {/* PROGRESS BAR & PERSONALITY */}
          <div className="mt-4 pt-3 border-t border-[#F4D396]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-montserrat font-medium text-[#3D2B24] mb-1">
                <span>Colección fotográfica</span>
                <span className="font-bold text-[#D97706]">{unlockedCount} de {totalCount} recuerdos ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-[#F4B942] to-[#F59E0B] h-full rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/80 border border-[#F4D396] px-3 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[11px] font-montserrat font-medium text-[#3D2B24]">
                {personalityTrait}
              </span>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-0.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'milestone', label: '🐶 Hitos' },
              { id: 'mischief', label: '🧦 Travesuras' },
              { id: 'secret', label: '🔒 Secretos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-montserrat font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-[#3D2B24] text-white shadow-xs'
                    : 'bg-white/80 text-[#806F66] border border-[#F4D396]/60 hover:bg-[#FFF8EE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MEMORIES GRID */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredMemories.map((mem) => {
              const isUnlocked = mem.unlocked;
              const isSecret = mem.secret && !isUnlocked;
              const activePhoto = mem.photoUrl || mem.defaultPhotoUrl;

              return (
                <motion.div
                  key={mem.id}
                  whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => isUnlocked && handleOpenDetail(mem)}
                  className={`relative p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                    isUnlocked
                      ? 'bg-white border-[#F4D396] shadow-[0_3px_12px_rgba(90,56,40,0.06)] cursor-pointer hover:border-[#F4B942]'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] opacity-80 cursor-default'
                  }`}
                >
                  {/* UNLOCKED BADGE / LOCK ICON */}
                  <div className="flex items-center justify-between mb-2">
                    {isUnlocked ? (
                      <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-[#A7F3D0]">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Desbloqueado
                      </span>
                    ) : (
                      <span className="bg-[#F3F4F6] text-[#6B7280] text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-[#E5E7EB]">
                        <Lock className="w-2.5 h-2.5" /> Bloqueado
                      </span>
                    )}

                    {isUnlocked && (
                      <span className="text-[10px] font-montserrat text-[#9CA3AF]">
                        Nvl {mem.levelRecorded || 1}
                      </span>
                    )}
                  </div>

                  {/* PHOTO / SNAPSHOT OF THE ACTION */}
                  <div className="my-1.5 flex flex-col items-center justify-center">
                    <div
                      className={`w-full aspect-square max-h-36 rounded-xl overflow-hidden relative flex items-center justify-center border transition-transform ${
                        isUnlocked
                          ? 'bg-[#FFF9EE] border-[#F4D396]'
                          : 'bg-[#F3F4F6] border-[#E5E7EB] grayscale'
                      }`}
                    >
                      {isSecret ? (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Lock className="w-7 h-7 mb-1" />
                          <span className="text-[10px] font-montserrat">Secreto</span>
                        </div>
                      ) : activePhoto && isUnlocked ? (
                        <>
                          <img
                            src={activePhoto}
                            alt={mem.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails, hide and show emoji fallback
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                          {mem.photoUrl && (
                            <span className="absolute top-1.5 right-1.5 bg-[#3D2B24]/80 backdrop-blur-xs text-[#F4D396] text-[9px] font-montserrat px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-[#F4D396]/40">
                              <Camera className="w-2.5 h-2.5" /> Propia
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="text-4xl">{mem.icon}</div>
                      )}
                    </div>
                  </div>

                  {/* TITLE & DETAILS */}
                  <div className="text-center mt-1">
                    <h3 className="font-montserrat font-semibold text-xs sm:text-sm text-[#3D2B24] line-clamp-1">
                      {isSecret ? '???' : mem.title}
                    </h3>
                    <p className="font-montserrat text-[11px] text-[#806F66] mt-0.5 line-clamp-2">
                      {isSecret
                        ? 'Este recuerdo todavía no ha sido descubierto.'
                        : isUnlocked
                        ? mem.description
                        : mem.hint || 'Descúbrelo jugando con Golden.'}
                    </p>
                  </div>

                  {/* QUICK PHOTO ATTACH / VIEW FOOTER */}
                  <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[10px] text-[#9CA3AF]">
                    {isUnlocked ? (
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#D97706] hover:text-[#B45309] font-medium flex items-center gap-1 cursor-pointer bg-[#FFF8EE] px-2.5 py-1 rounded-full border border-[#FDE68A] hover:bg-[#FFF0D4] transition-all relative overflow-hidden active:scale-95 shadow-2xs"
                        title="Adjuntar una foto de tu mascota a esta acción"
                      >
                        {isProcessingMemoryId === mem.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-[#D97706]" />
                        ) : (
                          <Camera className="w-3 h-3 text-[#D97706] pointer-events-none" />
                        )}
                        <span className="pointer-events-none">
                          {isProcessingMemoryId === mem.id ? 'Subiendo...' : mem.photoUrl ? 'Cambiar foto' : 'Adjuntar foto'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,image/jpeg,image/png,image/heic,image/heif,image/webp"
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          disabled={isProcessingMemoryId === mem.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadPhoto(file, mem.id);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                    ) : (
                      <span>Por descubrir</span>
                    )}

                    {isUnlocked && (
                      <span className="text-[#806F66] font-medium flex items-center">
                        Ver <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM HELPER */}
        <div className="bg-[#FFFDF9] border-t border-[#F4D396]/40 p-3 sm:p-4 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-montserrat text-[#806F66]">
            ✨ Toca cualquier recuerdo para ver su foto en grande, arrastrar tu propia foto o compartirla.
          </p>
          {onOpenRenamePet && (
            <button
              onClick={onOpenRenamePet}
              className="text-xs font-montserrat font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 cursor-pointer underline"
            >
              <Pencil className="w-3 h-3" /> Cambiar nombre de mi mascota
            </button>
          )}
        </div>
      </motion.div>

      {/* DETAIL MODAL (CUANDO TOCA UN RECUERDO DESBLOQUEADO) */}
      <AnimatePresence>
        {viewingMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setViewingMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-2 border-[#F4D396] rounded-[24px] max-w-md w-full p-4 sm:p-6 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setViewingMemory(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#FFF8EE] text-[#806F66] hover:text-[#3D2B24] flex items-center justify-center cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                
                {/* BIG POLAROID PHOTO WITH DRAG & DROP ZONE (TOUCH & MOBILE DIRECT SELECTOR) */}
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, viewingMemory.id)}
                  className={`bg-[#FFFDF9] p-3 sm:p-4 rounded-2xl border-2 transition-all shadow-sm mb-3 w-full flex flex-col items-center cursor-pointer group relative overflow-hidden ${
                    isDragging
                      ? 'border-[#D97706] bg-[#FFF5E5] scale-[1.01]'
                      : 'border-[#F4D396] hover:border-[#F4B942]'
                  }`}
                  title="Toca o arrastra una foto de tu mascota para adjuntarla"
                >
                  <input
                    type="file"
                    accept="image/*,image/jpeg,image/png,image/heic,image/heif,image/webp"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    disabled={isProcessingMemoryId === viewingMemory.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadPhoto(file, viewingMemory.id);
                      }
                      e.target.value = '';
                    }}
                  />
                  <div className="w-full aspect-4/3 max-h-56 rounded-xl overflow-hidden bg-[#FFF9EE] border border-[#F4D396]/60 flex items-center justify-center relative shadow-inner pointer-events-none">
                    {viewingMemory.photoUrl || viewingMemory.defaultPhotoUrl ? (
                      <img
                        src={viewingMemory.photoUrl || viewingMemory.defaultPhotoUrl}
                        alt={viewingMemory.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">{viewingMemory.icon}</div>
                    )}

                    {/* OVERLAY HOVER HINT */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                      <Camera className="w-7 h-7 mb-1 text-[#F4D396]" />
                      <span className="text-xs font-montserrat font-bold">
                        {viewingMemory.photoUrl ? 'Cambiar foto de tu mascota' : 'Adjuntar foto de tu mascota'}
                      </span>
                      <span className="text-[10px] opacity-80 mt-0.5">
                        Toca aquí para seleccionar una foto de tu celular
                      </span>
                    </div>

                    {/* BADGE: PROPIA VS DEFAULT */}
                    {viewingMemory.photoUrl ? (
                      <span className="absolute top-2 left-2 bg-[#3D2B24]/85 text-[#F4B942] text-[10px] font-montserrat font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#F4D396]/40">
                        <Camera className="w-3 h-3" /> Foto de {gameState.petName}
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-white/90 text-[#854D0E] text-[10px] font-montserrat font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#FDE68A]">
                        📸 Foto temática
                      </span>
                    )}

                    {/* SPINNER OVERLAY IF PROCESSING */}
                    {isProcessingMemoryId === viewingMemory.id && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-3 z-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#F4D396] mb-1.5" />
                        <span className="text-xs font-montserrat font-medium">Procesando foto de tu celular...</span>
                      </div>
                    )}
                  </div>

                  {/* POLAROID FOOTER INFO */}
                  <div className="w-full mt-2.5 flex items-center justify-between px-1 pointer-events-none">
                    <span className="text-[11px] font-montserrat font-bold text-[#D97706] uppercase tracking-wider">
                      Momento con {gameState.petName}
                    </span>
                    <span className="text-[10px] text-[#806F66] font-montserrat">
                      {viewingMemory.unlockedAt || 'Inolvidable'}
                    </span>
                  </div>
                </label>

                {/* PHOTO ACTION BUTTONS */}
                <div className="w-full flex items-center justify-center gap-2 mb-3">
                  <label
                    className="flex-1 py-2 px-3 bg-[#FFF8EE] hover:bg-[#FFF0D4] border border-[#F4D396] text-[#3D2B24] rounded-xl text-xs font-montserrat font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs relative overflow-hidden active:scale-95"
                  >
                    {isProcessingMemoryId === viewingMemory.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#D97706] pointer-events-none" />
                    )}
                    <span className="pointer-events-none">
                      {isProcessingMemoryId === viewingMemory.id
                        ? 'Procesando...'
                        : viewingMemory.photoUrl
                        ? 'Cambiar foto de tu mascota'
                        : 'Adjuntar foto de tu mascota'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,image/jpeg,image/png,image/heic,image/heif,image/webp"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      disabled={isProcessingMemoryId === viewingMemory.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadPhoto(file, viewingMemory.id);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {viewingMemory.photoUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(viewingMemory.id)}
                      className="py-2 px-2.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-montserrat font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
                      title="Quitar foto personalizada y volver a la predeterminada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restablecer</span>
                    </button>
                  )}
                </div>

                <h3 className="font-montserrat font-bold text-xl text-[#3D2B24]">
                  {viewingMemory.title}
                </h3>

                <p className="font-montserrat text-sm text-[#5C453B] mt-1.5 italic">
                  "{viewingMemory.description}"
                </p>

                {viewingMemory.eventStory && (
                  <div className="bg-[#FFFDF9] border border-[#F4D396]/60 rounded-xl p-3 mt-3 w-full text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E]">
                      Lo que pasó:
                    </span>
                    <p className="text-xs text-[#3D2B24] mt-1 font-montserrat">
                      {viewingMemory.eventStory}
                    </p>
                  </div>
                )}

                {/* METADATA CHIPS */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                  <span className="bg-[#FFF0D4] text-[#854D0E] text-xs font-montserrat font-medium px-2.5 py-1 rounded-full border border-[#FDE68A] flex items-center gap-1">
                    <Award className="w-3 h-3" /> Nivel {viewingMemory.levelRecorded || gameState.level}
                  </span>
                  <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-montserrat font-medium px-2.5 py-1 rounded-full border border-[#FDE68A] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Día {viewingMemory.dayRecorded || gameState.daysTogether}
                  </span>
                  {viewingMemory.rewardXp && (
                    <span className="bg-[#ECFDF5] text-[#065F46] text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                      +{viewingMemory.rewardXp} XP
                    </span>
                  )}
                  {viewingMemory.rewardCoins && (
                    <span className="bg-[#FEF9C3] text-[#854D0E] text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full border border-[#FDE047]">
                      +{viewingMemory.rewardCoins} 🪙
                    </span>
                  )}
                  {viewingMemory.rewardBones && (
                    <span className="bg-[#FFF7ED] text-[#9A3412] text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full border border-[#FED7AA]">
                      +{viewingMemory.rewardBones} 🦴
                    </span>
                  )}
                </div>

                {/* SHARE BUTTON */}
                <button
                  onClick={() => handleShare(viewingMemory)}
                  className="mt-4 w-full py-2.5 bg-[#F4B942] hover:bg-[#E29E2E] text-[#3D2B24] font-montserrat font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir este recuerdo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE CARD VISUAL MODAL */}
      <AnimatePresence>
        {showShareModal && viewingMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] max-w-sm w-full p-5 shadow-2xl flex flex-col items-center"
            >
              <div className="flex justify-between items-center w-full mb-3">
                <span className="text-xs font-montserrat font-bold text-[#806F66]">
                  TARJETA PARA COMPARTIR
                </span>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* POSTAL CARD VISUAL */}
              <div className="w-full bg-[#FFFDF9] border-2 border-[#F4D396] rounded-2xl p-4 text-center shadow-md flex flex-col items-center">
                <span className="font-montserrat font-bold text-xs tracking-widest text-[#D97706]">
                  GOLDEN LIFE
                </span>
                <span className="font-montserrat font-medium text-sm text-[#3D2B24] mt-1">
                  🐕 {gameState.petName}
                </span>

                {/* PHOTO EMBEDDED IN CARD */}
                <div className="my-3 w-full aspect-video rounded-xl overflow-hidden bg-[#FFF5E5] border border-[#F4B942] flex items-center justify-center shadow-inner">
                  {viewingMemory.photoUrl || viewingMemory.defaultPhotoUrl ? (
                    <img
                      src={viewingMemory.photoUrl || viewingMemory.defaultPhotoUrl}
                      alt={viewingMemory.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">{viewingMemory.icon}</div>
                  )}
                </div>

                <h4 className="font-montserrat font-bold text-base text-[#3D2B24]">
                  "{viewingMemory.title}"
                </h4>

                <p className="font-montserrat text-xs text-[#806F66] mt-1.5 italic px-2">
                  "{viewingMemory.description}"
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#F4D396]/60 w-full flex justify-around text-xs font-montserrat font-medium text-[#5C453B]">
                  <span>Nivel {viewingMemory.levelRecorded || gameState.level}</span>
                  <span>•</span>
                  <span>Día {viewingMemory.dayRecorded || gameState.daysTogether}</span>
                </div>

                <span className="text-[10px] text-[#A8988F] font-montserrat mt-2">
                  ✨ Golden Life App
                </span>
              </div>

              <button
                onClick={handleCopyShareCard}
                className="mt-4 w-full py-2.5 bg-[#3D2B24] text-white font-montserrat font-medium text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#5C453B] transition-colors cursor-pointer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> ¡Texto Copiado al Portapapeles!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Tarjeta de Recuerdo
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
