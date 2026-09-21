import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SceneryType = 'eating' | 'bathroom' | 'bedroom' | 'patio' | 'living-room' | 'garden';

interface DynamicSceneryProps {
  scenery: SceneryType;
  isSleeping: boolean;
  isBath: boolean;
  children: React.ReactNode;
}

export default function DynamicScenery({
  scenery,
  isSleeping,
  isBath,
  children,
}: DynamicSceneryProps) {
  // Resolve effective scene: if sleeping, always bedroom; if bath active, always bathroom
  const resolved = isSleeping
    ? 'bedroom'
    : isBath
    ? 'bathroom'
    : scenery;
  const effectiveScene: SceneryType = resolved === 'garden' ? 'patio' : (resolved as SceneryType);

  const outline = '#502C16';

  return (
    <div
      id="dynamic-scenery-container"
      className="relative w-full max-w-md h-[380px] sm:h-[400px] rounded-[32px] overflow-hidden border-2 border-[#502C16]/25 shadow-[0_8px_30px_rgba(80,44,22,0.08)] flex items-center justify-center select-none"
      style={{
        background:
          effectiveScene === 'bedroom'
            ? 'linear-gradient(180deg, #2B2342 0%, #3B3356 60%, #201A33 100%)'
            : effectiveScene === 'bathroom'
            ? 'linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 55%, #BAE6FD 100%)'
            : effectiveScene === 'eating'
            ? 'linear-gradient(180deg, #FFF3E0 0%, #FFF8EE 50%, #FFE0B2 100%)'
            : effectiveScene === 'patio' || effectiveScene === 'garden'
            ? 'linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 45%, #DCFCE7 100%)'
            : 'linear-gradient(180deg, #FFF6E5 0%, #FFFDF9 50%, #FFECC8 100%)',
      }}
    >
      {/* 1. SCENERY BACKGROUND & PROPS (ANIMATED CROSSFADE) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={effectiveScene}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* ============================================================ */}
          {/* A. 🛁 BAÑO (BATHROOM SCENARIO) */}
          {/* ============================================================ */}
          {effectiveScene === 'bathroom' && (
            <div className="absolute inset-0">
              {/* Pastel Tile Wall Background */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="bathTiles" width="36" height="36" patternUnits="userSpaceOnUse">
                    <rect width="36" height="36" fill="#EBF6FD" stroke="#C9E6F8" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="70%" fill="url(#bathTiles)" />

                {/* Bathroom floor */}
                <rect y="70%" width="100%" height="30%" fill="#D0E8F7" />
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke={outline} strokeWidth="3.5" />

                {/* Hanging mirror / shelf on the wall */}
                <rect x="25" y="25" width="55" height="70" rx="27" fill="#FFFFFF" stroke={outline} strokeWidth="3" />
                <rect x="30" y="30" width="45" height="60" rx="22" fill="#E0F2FE" />
                <path d="M 38 42 L 54 34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                {/* Small shelf with dog shampoo */}
                <rect x="320" y="65" width="60" height="8" rx="4" fill="#FFFFFF" stroke={outline} strokeWidth="2.5" />
                {/* Shampoo bottle */}
                <rect x="330" y="42" width="16" height="24" rx="4" fill="#F472B6" stroke={outline} strokeWidth="2.5" />
                <rect x="335" y="36" width="6" height="6" fill="#FDF2F8" stroke={outline} strokeWidth="2" />
                {/* Soap bar */}
                <rect x="352" y="52" width="18" height="13" rx="4" fill="#FDE047" stroke={outline} strokeWidth="2.5" />
              </svg>

              {/* Floating Soap Bubbles */}
              {[
                { x: '18%', y: '35%', size: 22, delay: 0 },
                { x: '78%', y: '28%', size: 28, delay: 0.5 },
                { x: '25%', y: '18%', size: 16, delay: 0.9 },
                { x: '82%', y: '48%', size: 18, delay: 1.2 },
                { x: '12%', y: '55%', size: 24, delay: 1.7 },
              ].map((bubble, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-sky-300/80 bg-white/70 shadow-xs"
                  style={{
                    left: bubble.x,
                    top: bubble.y,
                    width: bubble.size,
                    height: bubble.size,
                  }}
                  animate={{
                    y: [0, -18, 0],
                    x: [0, i % 2 === 0 ? 8 : -8, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: bubble.delay,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white ml-1 mt-1 opacity-90" />
                </motion.div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* B. 🛏️ DORMIR (SLEEP / BEDROOM SCENARIO) */}
          {/* ============================================================ */}
          {effectiveScene === 'bedroom' && (
            <div className="absolute inset-0">
              {/* Cozy Night Room: Deep indigo wall with starry window */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Night Bedroom Floor */}
                <rect y="72%" width="100%" height="28%" fill="#231C35" />
                <line x1="0" y1="72%" x2="100%" y2="72%" stroke={outline} strokeWidth="3.5" />

                {/* Arched Window with Crescent Moon and Stars */}
                <path
                  d="M 40 140 L 40 60 C 40 30, 95 30, 95 60 L 95 140 Z"
                  fill="#1B152B"
                  stroke={outline}
                  strokeWidth="3.5"
                />
                <line x1="67" y1="36" x2="67" y2="140" stroke={outline} strokeWidth="2.5" />
                <line x1="40" y1="85" x2="95" y2="85" stroke={outline} strokeWidth="2.5" />

                {/* Crescent Moon */}
                <path
                  d="M 58 50 C 58 58, 52 64, 46 66 C 54 66, 62 60, 62 50 C 62 45, 59 41, 56 38 C 58 41, 58 46, 58 50 Z"
                  fill="#FDE047"
                />

                {/* Night Lamp on small bedside table */}
                <rect x="330" y="150" width="45" height="70" rx="6" fill="#3D3058" stroke={outline} strokeWidth="3" />
                {/* Lamp base */}
                <path d="M 345 150 L 360 150 L 354 125 L 351 125 Z" fill="#F4B942" stroke={outline} strokeWidth="2" />
                {/* Lamp shade */}
                <path d="M 338 125 L 367 125 L 361 100 L 344 100 Z" fill="#FEF08A" stroke={outline} strokeWidth="2.5" />
                {/* Soft warm lamp light glow */}
                <ellipse cx="352" cy="115" rx="28" ry="18" fill="#FEF08A" opacity="0.25" />
              </svg>

              {/* Twinkling Bedroom Window Stars */}
              {[
                { x: '18%', y: '16%', delay: 0 },
                { x: '13%', y: '26%', delay: 0.6 },
                { x: '21%', y: '28%', delay: 1.1 },
                { x: '75%', y: '14%', delay: 0.4 },
                { x: '85%', y: '22%', delay: 0.9 },
              ].map((star, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-200 text-xs font-bold"
                  style={{ left: star.x, top: star.y }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.25, 0.8],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                >
                  ✦
                </motion.div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* 🦴 COMER (EATING SCENARIO - FONDO DE HUESOS) */}
          {/* ============================================================ */}
          {effectiveScene === 'eating' && (
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Bone and paw print wallpaper pattern */}
                  <pattern id="boneWallpaper" width="48" height="48" patternUnits="userSpaceOnUse">
                    {/* Cute cartoon bone */}
                    <g transform="translate(14, 14) rotate(32)" fill="#FDBA74" opacity="0.6">
                      <path d="M -7 -2.5 C -9.5 -4.5 -11.5 -2.5 -9.5 0 C -11.5 2.5 -9.5 4.5 -7 2.5 L 7 2.5 C 9.5 4.5 11.5 2.5 9.5 0 C 11.5 -2.5 9.5 -4.5 7 -2.5 Z" />
                    </g>
                    {/* Cute cartoon paw print */}
                    <g transform="translate(36, 36) scale(0.6)" fill="#FB923C" opacity="0.45">
                      <ellipse cx="0" cy="5" rx="5" ry="4" />
                      <circle cx="-5" cy="-2" r="1.8" />
                      <circle cx="0" cy="-5" r="2.0" />
                      <circle cx="5" cy="-2" r="1.8" />
                    </g>
                  </pattern>
                </defs>

                {/* Wall with Bone Wallpaper */}
                <rect width="100%" height="70%" fill="#FFF7ED" />
                <rect width="100%" height="70%" fill="url(#boneWallpaper)" />

                {/* Wall molding / baseboard */}
                <rect y="68%" width="100%" height="4%" fill="#FDE7BD" stroke={outline} strokeWidth="2.5" />

                {/* Warm kitchen wooden floor */}
                <rect y="72%" width="100%" height="28%" fill="#FED7AA" />
                <line x1="0" y1="72%" x2="100%" y2="72%" stroke={outline} strokeWidth="3.5" />
                {/* Floor planks */}
                <line x1="80" y1="72%" x2="50" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.25" />
                <line x1="180" y1="72%" x2="160" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.25" />
                <line x1="280" y1="72%" x2="270" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.25" />
                <line x1="360" y1="72%" x2="370" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.25" />

                {/* Bone Bunting Garland on the wall */}
                <path d="M 30 25 Q 110 50 190 25 Q 270 50 350 25" fill="none" stroke={outline} strokeWidth="2" />
                {[65, 115, 160, 220, 270, 315].map((bx, idx) => (
                  <g key={idx} transform={`translate(${bx}, ${idx % 2 === 0 ? 34 : 37}) rotate(${idx % 2 === 0 ? 12 : -12}) scale(0.85)`}>
                    <path
                      d="M -8 -3 C -11 -5 -13 -3 -11 0 C -13 3 -11 5 -8 3 L 8 3 C 11 5 13 3 11 0 C 13 -3 11 -5 8 -3 Z"
                      fill={idx % 3 === 0 ? '#F97316' : idx % 3 === 1 ? '#FBBF24' : '#FB7185'}
                      stroke={outline}
                      strokeWidth="2"
                    />
                  </g>
                ))}

                {/* Treat Jar Shelf on right */}
                <rect x="290" y="58" width="85" height="10" rx="3" fill="#E2A66C" stroke={outline} strokeWidth="2.5" />
                {/* Glass Jar with bones */}
                <rect x="305" y="28" width="28" height="30" rx="6" fill="#F8FAFC" stroke={outline} strokeWidth="2.5" opacity="0.9" />
                <rect x="310" y="24" width="18" height="5" rx="2" fill="#E2A66C" stroke={outline} strokeWidth="2" />
                <text x="319" y="47" fontSize="12" textAnchor="middle">🦴</text>
                {/* Box of Dog Biscuits */}
                <rect x="340" y="32" width="24" height="26" rx="3" fill="#FDBA74" stroke={outline} strokeWidth="2.5" />
                <text x="352" y="48" fontSize="10" textAnchor="middle">🍪</text>

                {/* Bone-shaped food rug under the puppy */}
                <g transform="translate(195, 330) scale(1.15)">
                  <rect x="-70" y="-18" width="140" height="36" rx="14" fill="#FFEDD5" stroke={outline} strokeWidth="3" />
                  <circle cx="-70" cy="-14" r="14" fill="#FFEDD5" stroke={outline} strokeWidth="3" />
                  <circle cx="-70" cy="14" r="14" fill="#FFEDD5" stroke={outline} strokeWidth="3" />
                  <circle cx="70" cy="-14" r="14" fill="#FFEDD5" stroke={outline} strokeWidth="3" />
                  <circle cx="70" cy="14" r="14" fill="#FFEDD5" stroke={outline} strokeWidth="3" />
                </g>
              </svg>

              {/* Floating Little Bone Treats */}
              {[
                { x: '12%', y: '30%', delay: 0 },
                { x: '82%', y: '24%', delay: 0.7 },
                { x: '20%', y: '50%', delay: 1.3 },
                { x: '86%', y: '48%', delay: 1.9 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl pointer-events-none select-none"
                  style={{ left: b.x, top: b.y }}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, i % 2 === 0 ? 12 : -12, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    delay: b.delay,
                    ease: 'easeInOut',
                  }}
                >
                  🦴
                </motion.div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* C. 🌳 PATIO / JARDÍN (OUTDOOR PLAY SCENARIO) */}
          {/* ============================================================ */}
          {(effectiveScene === 'patio' || effectiveScene === 'garden') && (
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Fluffy Cartoon Clouds */}
                <g fill="#FFFFFF" stroke={outline} strokeWidth="3" strokeLinejoin="round">
                  <path d="M 40 45 Q 50 30 65 35 Q 80 25 95 38 Q 110 35 115 48 L 40 48 Z" />
                  <path d="M 280 60 Q 295 45 315 50 Q 330 40 345 55 L 280 60 Z" />
                </g>

                {/* Friendly Cartoon Sun */}
                <circle cx="340" cy="35" r="22" fill="#FDE047" stroke={outline} strokeWidth="3.5" />
                {/* Sun rays */}
                <line x1="340" y1="6" x2="340" y2="2" stroke={outline} strokeWidth="3" strokeLinecap="round" />
                <line x1="365" y1="16" x2="369" y2="13" stroke={outline} strokeWidth="3" strokeLinecap="round" />
                <line x1="369" y1="35" x2="373" y2="35" stroke={outline} strokeWidth="3" strokeLinecap="round" />

                {/* Background Hills */}
                <path d="M -20 220 Q 120 160 260 210 Q 340 170 440 210 L 440 400 L -20 400 Z" fill="#86EFAC" />

                {/* White Picket Fence */}
                <g fill="#FFFFFF" stroke={outline} strokeWidth="2.5">
                  {[20, 55, 90, 125, 290, 325, 360].map((fx) => (
                    <path key={fx} d={`M ${fx} 210 L ${fx + 10} 190 L ${fx + 20} 210 L ${fx + 20} 250 L ${fx} 250 Z`} />
                  ))}
                  <rect x="15" y="220" width="135" height="8" rx="2" />
                  <rect x="285" y="220" width="100" height="8" rx="2" />
                </g>

                {/* Big Friendly Rounded Tree on the left */}
                <path d="M -15 250 Q -5 180 5 130 Q 35 80 85 110 Q 120 130 100 180 Q 75 220 50 260 Z" fill="#4ADE80" stroke={outline} strokeWidth="3.5" />
                <circle cx="30" cy="140" r="18" fill="#22C55E" opacity="0.3" />

                {/* Main Foreground Lawn */}
                <path
                  d="M -20 255 Q 180 230 420 255 L 420 400 L -20 400 Z"
                  fill="#4ADE80"
                  stroke={outline}
                  strokeWidth="4"
                />

                {/* Little Daisies & Wildflowers in grass */}
                {[
                  { x: 45, y: 310, color: '#FEF08A' },
                  { x: 95, y: 335, color: '#F472B6' },
                  { x: 310, y: 315, color: '#FFFFFF' },
                  { x: 355, y: 330, color: '#FEF08A' },
                  { x: 260, y: 345, color: '#F472B6' },
                ].map((flower, idx) => (
                  <g key={idx} transform={`translate(${flower.x}, ${flower.y})`}>
                    <circle cx="0" cy="-4" r="3.5" fill={flower.color} stroke={outline} strokeWidth="1.5" />
                    <circle cx="4" cy="0" r="3.5" fill={flower.color} stroke={outline} strokeWidth="1.5" />
                    <circle cx="0" cy="4" r="3.5" fill={flower.color} stroke={outline} strokeWidth="1.5" />
                    <circle cx="-4" cy="0" r="3.5" fill={flower.color} stroke={outline} strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="2.5" fill="#EAB308" />
                  </g>
                ))}
              </svg>

              {/* Gentle Fluttering Butterfly */}
              <motion.div
                className="absolute text-lg select-none"
                style={{ left: '72%', top: '35%' }}
                animate={{
                  x: [0, 20, -15, 0],
                  y: [0, -25, -10, 0],
                  rotate: [-5, 12, -8, -5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🦋
              </motion.div>
            </div>
          )}

          {/* ============================================================ */}
          {/* D. 🏠 SALA (LIVING ROOM / DEFAULT SCENARIO) */}
          {/* ============================================================ */}
          {effectiveScene === 'living-room' && (
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Warm Living Room Wall */}
                <rect width="100%" height="70%" fill="#FFF6E5" />

                {/* Wall molding / baseboard */}
                <rect y="68%" width="100%" height="4%" fill="#FDE7BD" stroke={outline} strokeWidth="2.5" />

                {/* Parquet wooden floor */}
                <rect y="72%" width="100%" height="28%" fill="#ECC185" />
                <line x1="0" y1="72%" x2="100%" y2="72%" stroke={outline} strokeWidth="3.5" />
                {/* Floor planks */}
                <line x1="80" y1="72%" x2="40" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.3" />
                <line x1="180" y1="72%" x2="160" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.3" />
                <line x1="280" y1="72%" x2="270" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.3" />
                <line x1="360" y1="72%" x2="370" y2="400" stroke={outline} strokeWidth="1.5" opacity="0.3" />

                {/* Cute framed paw print portrait on the wall */}
                <rect x="45" y="45" width="55" height="50" rx="8" fill="#FFFFFF" stroke={outline} strokeWidth="3.5" />
                <rect x="52" y="52" width="41" height="36" rx="4" fill="#FEF3C7" />
                {/* Paw print inside frame */}
                <ellipse cx="72" cy="72" rx="7" ry="5.5" fill="#F4B942" />
                <circle cx="65" cy="62" r="2.5" fill="#F4B942" />
                <circle cx="72" cy="59" r="2.8" fill="#F4B942" />
                <circle cx="79" cy="62" r="2.5" fill="#F4B942" />

                {/* Cozy Sunny Window on the right */}
                <rect x="290" y="35" width="75" height="85" rx="12" fill="#BAE6FD" stroke={outline} strokeWidth="3.5" />
                <line x1="327" y1="35" x2="327" y2="120" stroke={outline} strokeWidth="2.5" />
                <line x1="290" y1="77" x2="365" y2="77" stroke={outline} strokeWidth="2.5" />

                {/* Houseplant in terracotta pot */}
                <path d="M 330 260 L 350 260 L 346 280 L 334 280 Z" fill="#EA580C" stroke={outline} strokeWidth="2.5" />
                <ellipse cx="340" cy="245" rx="12" ry="16" fill="#22C55E" stroke={outline} strokeWidth="2" />
                <ellipse cx="330" cy="252" rx="10" ry="12" fill="#16A34A" stroke={outline} strokeWidth="2" />
                <ellipse cx="350" cy="252" rx="10" ry="12" fill="#16A34A" stroke={outline} strokeWidth="2" />

                {/* Soft Braided Round Living Room Rug under the puppy */}
                <ellipse cx="200" cy="325" rx="140" ry="42" fill="#FED7AA" stroke={outline} strokeWidth="3.5" />
                <ellipse cx="200" cy="325" rx="115" ry="32" fill="#FFEDD5" stroke={outline} strokeWidth="2" strokeDasharray="6 4" />
              </svg>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 2. THE GOLDEN RETRIEVER PUPPY & PROTAGONIST STAGE */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>

      {/* 3. FOREGROUND PROPS SPECIFIC TO ACTIVITY (Bathtub or Dog Bed) */}
      <AnimatePresence>
        {/* ============================================================ */}
        {/* 🛁 FOREGROUND BATHTUB (PUPPY INSIDE THE BATHTUB) */}
        {/* ============================================================ */}
        {effectiveScene === 'bathroom' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-4 inset-x-0 flex flex-col items-center pointer-events-none z-20"
          >
            <svg width="320" height="110" viewBox="0 0 320 110" className="overflow-visible">
              {/* Bathtub legs */}
              <path d="M 60 85 L 52 104 C 50 108, 62 110, 64 104 L 72 85 Z" fill="#CBD5E1" stroke={outline} strokeWidth="3.5" />
              <path d="M 260 85 L 268 104 C 270 108, 258 110, 256 104 L 248 85 Z" fill="#CBD5E1" stroke={outline} strokeWidth="3.5" />

              {/* Water Inside the Bathtub with ripples */}
              <ellipse cx="160" cy="26" rx="115" ry="16" fill="#38BDF8" opacity="0.85" />
              <path d="M 70 26 Q 160 38 250 26" fill="none" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" />

              {/* Bathtub Body */}
              <path
                d="M 35 22
                   C 35 15, 60 10, 160 10
                   C 260 10, 285 15, 285 22
                   C 285 55, 265 88, 160 88
                   C 55 88, 35 55, 35 22 Z"
                fill="#F8FAFC"
                stroke={outline}
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* Rolled rim highlight */}
              <path
                d="M 32 20 C 32 10, 60 6, 160 6 C 260 6, 288 10, 288 20"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
              />

              {/* Paw Print Badge on front of tub */}
              <g transform="translate(160, 52) scale(0.85)">
                <ellipse cx="0" cy="6" rx="7" ry="5.5" fill="#93C5FD" />
                <circle cx="-7" cy="-4" r="2.5" fill="#93C5FD" />
                <circle cx="0" cy="-7" r="2.8" fill="#93C5FD" />
                <circle cx="7" cy="-4" r="2.5" fill="#93C5FD" />
              </g>

              {/* Mounds of Fluffy Soap Bubbles on Tub Rim */}
              {/* Left Bubble Mound */}
              <g fill="#FFFFFF" stroke={outline} strokeWidth="3">
                <circle cx="58" cy="18" r="10" />
                <circle cx="70" cy="14" r="12" />
                <circle cx="82" cy="18" r="9" />
                <circle cx="68" cy="8" r="8" />
              </g>

              {/* Right Bubble Mound with Cute Rubber Duck */}
              <g fill="#FFFFFF" stroke={outline} strokeWidth="3">
                <circle cx="238" cy="18" r="10" />
                <circle cx="250" cy="14" r="12" />
                <circle cx="262" cy="18" r="9" />
              </g>

              {/* Little Yellow Rubber Duck resting on bubbles */}
              <g transform="translate(242, -4) scale(0.9)">
                {/* Body */}
                <ellipse cx="10" cy="12" rx="11" ry="8" fill="#FACC15" stroke={outline} strokeWidth="2.5" />
                {/* Head */}
                <circle cx="16" cy="4" r="7" fill="#FACC15" stroke={outline} strokeWidth="2.5" />
                {/* Beak */}
                <path d="M 22 4 L 28 6 L 22 8 Z" fill="#F97316" stroke={outline} strokeWidth="2" />
                {/* Eye */}
                <circle cx="18" cy="3" r="1.2" fill="#000000" />
              </g>
            </svg>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 🍖 FOREGROUND FOOD & BONES (EATING SCENARIO) */}
        {/* ============================================================ */}
        {effectiveScene === 'eating' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-4 inset-x-0 flex flex-col items-center pointer-events-none z-20"
          >
            <svg width="260" height="70" viewBox="0 0 260 70" className="overflow-visible">
              {/* Double Bowls */}
              {/* Left Bowl: Sparkling Water */}
              <ellipse cx="90" cy="42" rx="42" ry="18" fill="#E2E8F0" stroke={outline} strokeWidth="3.5" />
              <ellipse cx="90" cy="38" rx="36" ry="14" fill="#38BDF8" />
              {/* Water ripple */}
              <ellipse cx="90" cy="38" rx="24" ry="8" fill="none" stroke="#BAE6FD" strokeWidth="2" />

              {/* Right Bowl: Kibble & Bone */}
              <ellipse cx="170" cy="42" rx="42" ry="18" fill="#F43F5E" stroke={outline} strokeWidth="3.5" />
              <ellipse cx="170" cy="38" rx="36" ry="14" fill="#92400E" />
              {/* Crunchy kibbles */}
              <circle cx="160" cy="36" r="3.5" fill="#D97706" />
              <circle cx="170" cy="34" r="4" fill="#B45309" />
              <circle cx="180" cy="37" r="3.5" fill="#D97706" />
              <circle cx="165" cy="40" r="3" fill="#F59E0B" />
              <circle cx="175" cy="41" r="3" fill="#F59E0B" />

              {/* Juicy Bone in the Bowl */}
              <g transform="translate(170, 22) rotate(-18) scale(0.95)">
                <path
                  d="M -16 -6 C -20 -10 -24 -6 -21 0 C -24 6 -20 10 -16 6 L 16 6 C 20 10 24 6 21 0 C 24 -6 20 -10 16 -6 Z"
                  fill="#FFFBEB"
                  stroke={outline}
                  strokeWidth="3"
                />
              </g>

              {/* Front Badge on Red Bowl */}
              <ellipse cx="170" cy="49" rx="8" ry="5" fill="#FFE4E6" stroke={outline} strokeWidth="1.5" />
              <circle cx="170" cy="49" r="2" fill="#F43F5E" />
            </svg>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 🎾 FOREGROUND TENNIS BALL (PATIO / JARDÍN SCENARIO) */}
        {/* ============================================================ */}
        {(effectiveScene === 'patio' || effectiveScene === 'garden') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-6 right-10 pointer-events-none z-20"
          >
            <svg width="45" height="45" viewBox="0 0 45 45">
              <circle cx="22" cy="22" r="18" fill="#A3E635" stroke={outline} strokeWidth="3" />
              <path d="M 10 12 C 16 18, 16 26, 10 32" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 34 12 C 28 18, 28 26, 34 32" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 🛏️ FOREGROUND DOG BED (WHEN SLEEPING / BEDROOM) */}
        {/* ============================================================ */}
        {effectiveScene === 'bedroom' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-5 inset-x-0 flex flex-col items-center pointer-events-none z-20"
          >
            <svg width="310" height="90" viewBox="0 0 310 90" className="overflow-visible">
              {/* Cozy plush round dog bed outer rim */}
              <ellipse
                cx="155"
                cy="48"
                rx="135"
                ry="38"
                fill="#6366F1"
                stroke={outline}
                strokeWidth="4.5"
              />
              {/* Plush inner cushion */}
              <ellipse
                cx="155"
                cy="44"
                rx="115"
                ry="28"
                fill="#818CF8"
                stroke={outline}
                strokeWidth="3.5"
              />

              {/* Folded warm quilt / blanket corner */}
              <path
                d="M 65 38 Q 110 58 150 48 Q 180 38 210 52 L 205 68 Q 140 76 65 54 Z"
                fill="#F472B6"
                stroke={outline}
                strokeWidth="3.5"
              />
              {/* Blanket dots */}
              <circle cx="110" cy="50" r="2.5" fill="#FDF2F8" />
              <circle cx="140" cy="54" r="2.5" fill="#FDF2F8" />
              <circle cx="170" cy="52" r="2.5" fill="#FDF2F8" />

              {/* Soft sleeping pillow on the left */}
              <rect
                x="55"
                y="18"
                width="48"
                height="26"
                rx="12"
                fill="#C7D2FE"
                stroke={outline}
                strokeWidth="3"
                transform="rotate(-8 79 31)"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
