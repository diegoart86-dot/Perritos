import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GoldenAppIcon from './GoldenAppIcon';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep splash screen brief and gentle (1.8s total)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 400); // give time for exit animation
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onFinish, 200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="golden-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onClick={handleSkip}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF8EE] select-none cursor-pointer px-6"
        >
          {/* Subtle warm background circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="w-96 h-96 rounded-full bg-[#FFD477]/20 blur-3xl" />
            <div className="w-64 h-64 rounded-full bg-[#F5A6A6]/15 blur-2xl transform translate-x-20 -translate-y-20" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Animated Golden Character Icon */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative"
            >
              <GoldenAppIcon size={120} withBackground={true} />

              {/* Heart float animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.9], y: [-10, -35] }}
                transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 0.6 }}
                className="absolute -top-3 -right-2 text-2xl"
              >
                💖
              </motion.div>
            </motion.div>

            {/* Brand Logo & Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center flex flex-col items-center"
            >
              <h1 className="font-montserrat font-medium text-3xl sm:text-4xl text-[#3D2B24] tracking-tight">
                Golden <span className="text-[#F4B942]">Life</span>
              </h1>
              <p className="font-montserrat font-normal text-xs sm:text-sm text-[#806F66] mt-1.5 tracking-wide">
                Tu compañero virtual adorable
              </p>
            </motion.div>

            {/* Micro loading dots or hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1.5 mt-2"
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 rounded-full bg-[#F4B942]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Quick tap hint */}
          <span className="absolute bottom-8 font-montserrat font-normal text-[11px] text-[#806F66]/60">
            Toca para continuar
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
