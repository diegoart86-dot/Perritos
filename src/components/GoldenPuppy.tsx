import React from 'react';
import { motion } from 'motion/react';
import { Emotion, ActiveBehavior, Accessory } from '../types';

interface GoldenPuppyProps {
  behavior: ActiveBehavior;
  emotion: Emotion;
  accessories: Accessory[];
  equipped: {
    collar?: string;
    hat?: string;
    glasses?: string;
    backpack?: string;
    bandana?: string;
  };
  isPetting: boolean;
  onPetClick: () => void;
}

export default function GoldenPuppy({
  behavior,
  emotion,
  accessories,
  equipped,
  isPetting,
  onPetClick,
}: GoldenPuppyProps) {
  // Equipped accessories lookup
  const currentCollar = accessories.find((a) => a.id === equipped.collar);
  const currentHat = accessories.find((a) => a.id === equipped.hat);
  const currentGlasses = accessories.find((a) => a.id === equipped.glasses);
  const currentBackpack = accessories.find((a) => a.id === equipped.backpack);
  const currentBandana = accessories.find((a) => a.id === equipped.bandana);

  // Exact Reference Character Color Palette & Thick Contour
  const outlineColor = '#502C16'; // Thick dark espresso contour from reference
  const coatColor = '#F1B55B'; // Pure warm golden coat
  const earColor = '#DE9943'; // Warmer golden shading for ears & hind legs
  const eyeColor = '#502C16'; // Big friendly dark espresso eyes
  const mouthCaveColor = '#662426'; // Deep warm mouth cavity
  const tongueColor = '#FD9BA0'; // Sweet pink tongue & paw pads
  const blushColor = '#FD9BA0'; // Soft rosy cheek blush

  // State checks
  const isSleeping = behavior === ActiveBehavior.Sleeping;
  const isBath = behavior === ActiveBehavior.Bath;
  const isBellyRub = behavior === ActiveBehavior.BellyRub;
  const isPuppyEyes = behavior === ActiveBehavior.PuppyEyes;
  const isEating = behavior === ActiveBehavior.Eating;
  const isFetch = behavior === ActiveBehavior.Fetch;
  const isStolenItem =
    behavior === ActiveBehavior.StoleSock || behavior === ActiveBehavior.StoleSlipper;

  // Emotional states resolution
  const isSuperHappy = emotion === Emotion.MuyFeliz || isPetting || isBellyRub;
  const isHungry = emotion === Emotion.Hambriento;
  const isBored = emotion === Emotion.Aburrido;
  const isSad = emotion === Emotion.Triste;
  const isClean = emotion === Emotion.MuyLimpio;

  // Dynamic Head Rotation & Tilt: kept stable so eyes don't move or shift
  const headTilt = 0;

  return (
    <div
      id="golden-character-stage"
      className="relative w-full max-w-md h-[340px] sm:h-[350px] flex items-center justify-center cursor-pointer select-none"
      onClick={onPetClick}
      title="¡Toca a tu Golden Retriever para darle cariños!"
    >
      {/* 1. SOFT NATURAL FLOOR SHADOW (Only if not in bath or sleeping in bed) */}
      {!isBath && (
        <motion.div
          className="absolute bottom-5 w-44 h-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(80, 44, 22, 0.22) 0%, rgba(80, 44, 22, 0) 70%)',
          }}
          animate={
            isSleeping
              ? { scale: [1, 1.03, 1], opacity: [0.5, 0.6, 0.5] }
              : isPetting
              ? { scale: [1, 1.06, 0.98, 1] }
              : { scale: [1, 1.03, 1], opacity: [0.65, 0.75, 0.65] }
          }
          transition={{ duration: isSleeping ? 3.5 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* 2. BATH ENVIRONMENT BUBBLES */}
      {isBath && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end overflow-hidden pb-8">
          {[1, 2, 3, 4, 5].map((b) => (
            <motion.div
              key={b}
              className="absolute bg-white/85 border border-[#BAE6FD] rounded-full shadow-xs"
              style={{
                width: b * 7 + 10,
                height: b * 7 + 10,
                bottom: 30,
                left: `${16 + b * 13}%`,
              }}
              animate={{
                y: [-10, -200],
                x: [0, b % 2 === 0 ? 15 : -15],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 2.4 + b * 0.4,
                repeat: Infinity,
                delay: b * 0.35,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 3. CLEAN SPARKLES */}
      {isClean && (
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3, 4].map((s) => (
            <motion.div
              key={s}
              className="absolute text-yellow-400 text-xl font-bold"
              style={{
                top: `${16 + s * 16}%`,
                left: `${14 + s * 20}%`,
              }}
              animate={{
                scale: [0.6, 1.25, 0.6],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 180],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: s * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. FLOATING HEARTS WHEN BEING PETTED */}
      {isPetting && (
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3, 4].map((h) => (
            <motion.div
              key={h}
              className="absolute text-[#FD9BA0] text-2xl font-bold select-none"
              style={{
                top: '32%',
                left: `${28 + h * 13}%`,
              }}
              animate={{
                y: [-10, -110],
                x: [h % 2 === 0 ? -22 : 22, h % 2 === 0 ? 18 : -18],
                scale: [0.8, 1.3, 0.7],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.1,
                ease: 'easeOut',
              }}
            >
              💖
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. ZZZ FLOATING BUBBLES WHEN SLEEPING */}
      {isSleeping && (
        <div className="absolute right-[18%] top-[8%] pointer-events-none flex flex-col gap-1 items-start z-30">
          {['z', 'Z', 'Zzz'].map((z, i) => (
            <motion.span
              key={i}
              className="font-montserrat text-[#FDE047] font-bold select-none drop-shadow-sm"
              style={{ fontSize: 13 + i * 5 }}
              animate={{
                y: [15, -60],
                x: [0, 14],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.75,
                ease: 'easeOut',
              }}
            >
              {z}
            </motion.span>
          ))}
        </div>
      )}

      {/* 6. MAIN CHARACTER VECTOR SVG - SOURCE OF TRUTH (TRANSPARENT BACKGROUND) */}
      <motion.svg
        width="270"
        height="270"
        viewBox="0 0 200 200"
        className="z-10 overflow-visible"
        animate={
          isBellyRub
            ? { y: [0, -6, 0], rotate: [0, -2, 2, 0] }
            : isStolenItem
            ? { x: [-3, 3, -3], y: [-2, 2, -2] }
            : isPetting
            ? { scale: [1, 1.04, 0.98, 1] }
            : isFetch
            ? { y: [0, -6, 0] }
            : { y: [0, -2.5, 0] } // Natural calm breathing cycle
        }
        transition={{
          duration: isBellyRub ? 0.35 : isStolenItem ? 0.18 : isFetch ? 0.4 : 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* BACKPACK ACCESSORY (Behind body if equipped) */}
        {currentBackpack && !isSleeping && !isBath && (
          <g id="accessory-backpack">
            <rect
              x="36"
              y="114"
              width="24"
              height="30"
              rx="6"
              fill="#2E7D32"
              stroke={outlineColor}
              strokeWidth="4"
            />
            <rect x="41" y="121" width="14" height="15" rx="3" fill="#1B5E20" />
            <circle cx="48" cy="128" r="2.5" fill="#FFD477" />
          </g>
        )}

        {/* ============================================================ */}
        {/* TAIL (RELAXED, NATURAL, SLOW MOTION AS REQUESTED) */}
        {/* ============================================================ */}
        <motion.g
          id="golden-fluffy-tail"
          style={{ originX: '136px', originY: '148px' }}
          animate={
            isSleeping
              ? { rotate: [-2, 3, -2] }
              : isSuperHappy || isPetting
              ? { rotate: [-16, 16, -16] }
              : isFetch || isStolenItem
              ? { rotate: [-14, 14, -14] }
              : { rotate: [-10, 10, -10] } // Relaxed, smooth, paused wagging
          }
          transition={{
            // Note: Slow, gentle, pausado! Duration 2.2s for normal, 1.1s for excited (never 0.18s or fast nervous twitching)
            duration: isSleeping ? 3.8 : isSuperHappy || isPetting ? 1.1 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Fluffy Golden Tail with tuft curve matching reference */}
          <path
            d="M 136 148 
               C 168 148, 192 124, 186 102 
               C 178 96, 156 118, 138 138 Z"
            fill={coatColor}
            stroke={outlineColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Shadow/accent inside tail */}
          <path
            d="M 148 138 C 166 122, 178 110, 178 106"
            fill="none"
            stroke={earColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ============================================================ */}
        {/* SEATED BODY & LEGS (MATCHING REFERENCE PROPORTIONS) */}
        {/* ============================================================ */}
        <g id="dog-seated-body">
          {/* LEFT HIND LEG & FOOT */}
          <ellipse cx="54" cy="154" rx="18" ry="16" fill={earColor} stroke={outlineColor} strokeWidth="5" />
          <ellipse cx="46" cy="164" rx="14" ry="8" fill={coatColor} stroke={outlineColor} strokeWidth="5" />
          <line x1="43" y1="162" x2="43" y2="168" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="49" y1="162" x2="49" y2="168" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />

          {/* RIGHT HIND LEG & FOOT */}
          <ellipse cx="146" cy="154" rx="18" ry="16" fill={earColor} stroke={outlineColor} strokeWidth="5" />
          <ellipse cx="154" cy="164" rx="14" ry="8" fill={coatColor} stroke={outlineColor} strokeWidth="5" />
          <line x1="151" y1="162" x2="151" y2="168" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="157" y1="162" x2="157" y2="168" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />

          {/* MAIN ROUND SEATED TORSO */}
          <ellipse cx="100" cy="136" rx="38" ry="28" fill={coatColor} stroke={outlineColor} strokeWidth="5.5" />

          {/* FRONT LEGS */}
          {/* Front Left Paw */}
          <path
            d="M 68 130 C 68 120, 84 120, 84 130 L 84 162 C 84 168, 68 168, 68 162 Z"
            fill={coatColor}
            stroke={outlineColor}
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          <line x1="73" y1="158" x2="73" y2="166" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="79" y1="158" x2="79" y2="166" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />

          {/* Front Right Paw: Waving / Petting / Sitting */}
          {isPetting || isSuperHappy ? (
            // Playful raised paw with pink toe pads as in reference image!
            <g id="front-paw-waving">
              <path
                d="M 118 128 C 114 104, 146 104, 142 128 Z"
                fill={coatColor}
                stroke={outlineColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              {/* Pink paw pads */}
              <ellipse cx="130" cy="120" rx="6" ry="5" fill={tongueColor} />
              <circle cx="122" cy="112" r="1.8" fill={tongueColor} />
              <circle cx="128" cy="108" r="2" fill={tongueColor} />
              <circle cx="134" cy="108" r="2" fill={tongueColor} />
              <circle cx="139" cy="112" r="1.8" fill={tongueColor} />
            </g>
          ) : (
            // Standard seated front right paw
            <g id="front-paw-sitting">
              <path
                d="M 116 130 C 116 120, 132 120, 132 130 L 132 162 C 132 168, 116 168, 116 162 Z"
                fill={coatColor}
                stroke={outlineColor}
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              <line x1="121" y1="158" x2="121" y2="166" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
              <line x1="127" y1="158" x2="127" y2="166" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* COLLAR ACCESSORY */}
          {currentCollar && !isBath && !currentBandana && (
            <g id="accessory-collar">
              <ellipse
                cx="100"
                cy="114"
                rx="24"
                ry="6"
                fill={currentCollar.color || '#ef4444'}
                stroke={outlineColor}
                strokeWidth="4"
              />
              <circle cx="100" cy="120" r="4.5" fill="#F4B942" stroke={outlineColor} strokeWidth="2" />
            </g>
          )}

          {/* BANDANA ACCESSORY */}
          {currentBandana && !isBath && (
            <g id="accessory-bandana">
              <path
                d="M 74 110 Q 100 134 126 110 L 100 138 Z"
                fill={currentBandana.color || '#F97316'}
                stroke={outlineColor}
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <circle cx="75" cy="110" r="3" fill={outlineColor} />
              <circle cx="125" cy="110" r="3" fill={outlineColor} />
            </g>
          )}

          {/* ============================================================ */}
          {/* HEAD GROUP (EXACT REFERENCE SHAPE & PROPORTIONS) */}
          {/* ============================================================ */}
          <motion.g
            id="dog-head-group"
            animate={{ rotate: headTilt }}
            style={{ originX: '100px', originY: '95px' }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          >
            {/* LEFT FLOPPY EAR */}
            <motion.ellipse
              id="ear-left"
              cx="57"
              cy="98"
              rx="13"
              ry="25"
              fill={earColor}
              stroke={outlineColor}
              strokeWidth="5.5"
              transform="rotate(8 57 98)"
              animate={
                isSuperHappy
                  ? { rotate: [4, 12, 4] }
                  : isSad || isBored
                  ? { rotate: 2, y: 2 }
                  : { rotate: [6, 10, 6] }
              }
              transition={{ duration: isSuperHappy ? 0.6 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* RIGHT FLOPPY EAR */}
            <motion.ellipse
              id="ear-right"
              cx="143"
              cy="98"
              rx="13"
              ry="25"
              fill={earColor}
              stroke={outlineColor}
              strokeWidth="5.5"
              transform="rotate(-8 143 98)"
              animate={
                isSuperHappy
                  ? { rotate: [-4, -12, -4] }
                  : isSad || isBored
                  ? { rotate: -2, y: 2 }
                  : { rotate: [-6, -10, -6] }
              }
              transition={{ duration: isSuperHappy ? 0.6 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* HEAD MAIN SHAPE - EXACT ROUND/WIDE ELLIPSE FROM REFERENCE */}
            <ellipse
              cx="100"
              cy="95"
              rx="42"
              ry="37"
              fill={coatColor}
              stroke={outlineColor}
              strokeWidth="5.5"
            />

            {/* SOFT BLUSHING CHEEKS */}
            <ellipse cx="68" cy="98" rx="6.5" ry="4.5" fill={blushColor} opacity={isSuperHappy || isPetting ? 0.65 : 0.4} />
            <ellipse cx="132" cy="98" rx="6.5" ry="4.5" fill={blushColor} opacity={isSuperHappy || isPetting ? 0.65 : 0.4} />

            {/* EYES RENDERING (EXACT CARTOON EYES WITH DUAL SPECULAR HIGHLIGHTS) */}
            {isSleeping ? (
              // Sleeping peacefully: Curved closed lines (∪ ∪)
              <g id="eyes-sleeping">
                <path d="M 75 85 Q 83 93 91 85" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 109 85 Q 117 93 125 85" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
              </g>
            ) : isPuppyEyes || (isSad && !isPetting) ? (
              // Tender big glassy Puppy Eyes
              <g id="eyes-puppy">
                <circle cx="83" cy="83" r="8" fill={eyeColor} />
                <circle cx="80.5" cy="80" r="3" fill="#FFFFFF" />
                <circle cx="85.5" cy="85.5" r="1.5" fill="#FFFFFF" />

                <circle cx="117" cy="83" r="8" fill={eyeColor} />
                <circle cx="114.5" cy="80" r="3" fill="#FFFFFF" />
                <circle cx="119.5" cy="85.5" r="1.5" fill="#FFFFFF" />
              </g>
            ) : isSuperHappy && !isEating ? (
              // Joyful squinting eyes (^ ^)
              <g id="eyes-super-happy">
                <path d="M 75 87 Q 83 78 91 87" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 109 87 Q 117 78 125 87" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
              </g>
            ) : (
              // Natural, expressive stationary eyes (no moving/blinking)
              <g id="eyes-standard">
                <g id="eye-left">
                  <circle cx="83" cy="83" r="6.8" fill={eyeColor} />
                  <circle cx="80.5" cy="80.5" r="2.2" fill="#FFFFFF" />
                  <circle cx="85" cy="85" r="1" fill="#FFFFFF" />
                </g>

                <g id="eye-right">
                  <circle cx="117" cy="83" r="6.8" fill={eyeColor} />
                  <circle cx="114.5" cy="80.5" r="2.2" fill="#FFFFFF" />
                  <circle cx="119" cy="85" r="1" fill="#FFFFFF" />
                </g>
              </g>
            )}

            {/* BLACK / DARK ESPRESSO NOSE FROM REFERENCE */}
            <path
              d="M 93 92 C 93 88, 107 88, 107 92 C 107 96, 101 100, 100 100 C 99 100, 93 96, 93 92 Z"
              fill={outlineColor}
            />
            {/* Highlight shine on nose */}
            <circle cx="97" cy="90.5" r="1.3" fill="#FFFFFF" />

            {/* Vertical philtrum link line */}
            <line x1="100" y1="100" x2="100" y2="104" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />

            {/* ============================================================ */}
            {/* MOUTH & TONGUE RENDERING (MATCHING REFERENCE EXACTLY) */}
            {/* ============================================================ */}
            {isSuperHappy || isPetting || isFetch || behavior === ActiveBehavior.Idle ? (
              // Joyful open mouth with soft pink tongue from reference
              <g id="mouth-joyful">
                {/* Dark cavity */}
                <path
                  d="M 86 103 C 86 103, 100 101, 114 103 C 114 113, 100 126, 100 126 C 100 126, 86 113, 86 103 Z"
                  fill={mouthCaveColor}
                  stroke={outlineColor}
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                {/* Rosy pink tongue */}
                <path
                  d="M 91 112 C 91 108, 109 108, 109 112 C 109 123, 91 123, 91 112 Z"
                  fill={tongueColor}
                  stroke={outlineColor}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <line x1="100" y1="112" x2="100" y2="120" stroke="#E6737B" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            ) : isEating ? (
              // Chewing motion
              <motion.g animate={{ y: [-1, 3, -1] }} transition={{ duration: 0.22, repeat: Infinity }}>
                <path d="M 88 103 Q 100 112 112 103" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
              </motion.g>
            ) : isHungry ? (
              // Drooling cute mouth
              <g id="mouth-hungry">
                <path d="M 88 103 Q 100 108 112 103" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
                <motion.circle
                  cx="108"
                  cy="110"
                  r="2.2"
                  fill="#93C5FD"
                  animate={{ y: [0, 6], opacity: [1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </g>
            ) : (
              // Gentle closed sweet smile
              <path d="M 86 103 Q 100 110 114 103" fill="none" stroke={outlineColor} strokeWidth="4.5" strokeLinecap="round" />
            )}

            {/* GLASSES ACCESSORY */}
            {currentGlasses && !isBath && (
              <g id="accessory-glasses">
                {currentGlasses.id === 'glasses-cool' ? (
                  <>
                    <rect x="68" y="73" width="28" height="18" rx="4" fill="#1E293B" stroke={outlineColor} strokeWidth="3.5" />
                    <rect x="104" y="73" width="28" height="18" rx="4" fill="#1E293B" stroke={outlineColor} strokeWidth="3.5" />
                    <line x1="96" y1="80" x2="104" y2="80" stroke={outlineColor} strokeWidth="4.5" />
                  </>
                ) : (
                  <>
                    <circle cx="83" cy="83" r="14" fill="none" stroke="#2563EB" strokeWidth="4" />
                    <circle cx="117" cy="83" r="14" fill="none" stroke="#2563EB" strokeWidth="4" />
                    <line x1="97" y1="83" x2="103" y2="83" stroke="#2563EB" strokeWidth="4.5" />
                  </>
                )}
              </g>
            )}

            {/* HATS ACCESSORY */}
            {currentHat && !isBath && (
              <g id="accessory-hat">
                {currentHat.id === 'hat-party' ? (
                  <g>
                    <path d="M 85 58 L 100 16 L 115 58 Z" fill="#EC4899" stroke={outlineColor} strokeWidth="4" />
                    <circle cx="100" cy="14" r="5" fill="#F4B942" stroke={outlineColor} strokeWidth="2" />
                  </g>
                ) : currentHat.id === 'hat-detective' ? (
                  <g>
                    <path d="M 68 62 Q 100 28 132 62 Z" fill="#854D0E" stroke={outlineColor} strokeWidth="4" />
                    <path d="M 60 62 C 60 62, 100 68, 140 62" stroke={outlineColor} strokeWidth="5" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    <path d="M 74 62 L 100 12 L 126 62 Z" fill="#581C87" stroke={outlineColor} strokeWidth="4" />
                    <ellipse cx="100" cy="62" rx="34" ry="5" fill="#4C1D95" stroke={outlineColor} strokeWidth="3.5" />
                    <polygon points="100,24 102,30 108,30 103,34 105,40 100,36 95,40 97,34 92,30 98,30" fill="#F4B942" />
                  </g>
                )}
              </g>
            )}

            {/* STOLEN ITEMS (Sock or Slipper held in mouth) */}
            {behavior === ActiveBehavior.StoleSock && (
              <motion.g
                id="stolen-sock"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 0.16, repeat: Infinity }}
                style={{ originX: '100px', originY: '103px' }}
              >
                <path d="M 96 103 L 78 124 L 62 122 L 65 111 L 81 111 Z" fill="#EF4444" stroke={outlineColor} strokeWidth="3.5" />
                <line x1="88" y1="108" x2="82" y2="115" stroke="#FFFFFF" strokeWidth="2.5" />
              </motion.g>
            )}

            {behavior === ActiveBehavior.StoleSlipper && (
              <motion.g
                id="stolen-slipper"
                animate={{ rotate: [5, -5, 5] }}
                transition={{ duration: 0.16, repeat: Infinity }}
                style={{ originX: '100px', originY: '103px' }}
              >
                <rect x="72" y="103" width="20" height="12" rx="5" fill="#3B82F6" stroke={outlineColor} strokeWidth="3.5" />
                <path d="M 68 109 Q 77 120 84 109" stroke="#1D4ED8" strokeWidth="2.5" fill="none" />
              </motion.g>
            )}

            {/* TENNIS BALL IN MOUTH (When playing Fetch) */}
            {isFetch && (
              <g id="fetch-tennis-ball">
                <circle cx="100" cy="111" r="10" fill="#84CC16" stroke={outlineColor} strokeWidth="4" />
                <path d="M 93 106 Q 100 111 100 118" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}
          </motion.g>
        </g>

        {/* SHOWER CAP AND FOAM BUBBLES IF IN BATH */}
        {isBath && (
          <g id="bath-cap-and-bubbles" className="pointer-events-none">
            <path d="M 74 62 Q 100 40 126 62 Z" fill="#93C5FD" stroke={outlineColor} strokeWidth="3.5" opacity="0.9" />
            <ellipse cx="100" cy="61" rx="28" ry="4.5" fill="#60A5FA" />
            {/* Suds bubbles on head */}
            <circle cx="86" cy="56" r="6" fill="#FFFFFF" stroke={outlineColor} strokeWidth="2" />
            <circle cx="114" cy="56" r="6" fill="#FFFFFF" stroke={outlineColor} strokeWidth="2" />
            <circle cx="100" cy="51" r="7" fill="#FFFFFF" stroke={outlineColor} strokeWidth="2" />
          </g>
        )}
      </motion.svg>

      {/* EATING FOOD BOWL & CRUMBS */}
      {isEating && (
        <div className="absolute bottom-[14%] left-1/2 transform -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
          <div className="flex gap-2 mb-1">
            {[1, 2, 3].map((c) => (
              <motion.span
                key={c}
                className="text-amber-900 text-xs font-bold"
                animate={{
                  y: [-4, -20],
                  x: [0, c % 2 === 0 ? 8 : -8],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: c * 0.14,
                }}
              >
                🦴
              </motion.span>
            ))}
          </div>
          {/* Food Bowl matching style */}
          <svg width="48" height="24" viewBox="0 0 48 24" className="overflow-visible">
            <ellipse cx="24" cy="18" rx="20" ry="5" fill="rgba(80, 44, 22, 0.2)" />
            <path
              d="M 4 12 Q 24 28 44 12 L 39 5 L 9 5 Z"
              fill="#F4B942"
              stroke={outlineColor}
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <circle cx="19" cy="9" r="2.8" fill="#502C16" />
            <circle cx="24" cy="8" r="2.8" fill="#502C16" />
            <circle cx="29" cy="9" r="2.8" fill="#502C16" />
          </svg>
        </div>
      )}
    </div>
  );
}
