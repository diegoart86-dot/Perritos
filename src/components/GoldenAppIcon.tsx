import React from 'react';

interface GoldenAppIconProps {
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export default function GoldenAppIcon({
  size = 48,
  className = '',
  withBackground = true,
}: GoldenAppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`overflow-visible select-none ${className}`}
      aria-label="Golden Life Icon"
    >
      {withBackground && (
        <defs>
          <linearGradient id="goldenIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#FFF0D4" />
          </linearGradient>
          <filter id="iconSoftShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#5A3828" floodOpacity="0.08" />
          </filter>
        </defs>
      )}

      {/* Rounded App Icon Container */}
      {withBackground && (
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="24"
          fill="url(#goldenIconBg)"
          stroke="#F4D396"
          strokeWidth="1.5"
          filter="url(#iconSoftShadow)"
        />
      )}

      {/* Soft warm glow behind the head */}
      <circle cx="50" cy="54" r="32" fill="#FFEDB8" opacity="0.6" />

      {/* LEFT FLOPPY EAR */}
      <path
        d="M 28 32 C 16 34 16 54 20 68 C 22 74 30 76 34 70 C 36 65 37 56 36 48 Z"
        fill="#E29E2E"
        stroke="#5A3828"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* RIGHT FLOPPY EAR */}
      <path
        d="M 72 32 C 84 34 84 54 80 68 C 78 74 70 76 66 70 C 64 65 63 56 64 48 Z"
        fill="#E29E2E"
        stroke="#5A3828"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* HEAD MAIN SHAPE */}
      <path
        d="M 50 24 
           C 66 24 75 31 77 44 
           C 80 46 82 52 78 55 
           C 81 58 82 64 77 67 
           C 71 72 65 77 50 77 
           C 35 77 29 72 23 67 
           C 18 64 19 58 22 55 
           C 18 52 20 46 23 44 
           C 25 31 34 24 50 24 Z"
        fill="#F4B942"
        stroke="#5A3828"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* FOREHEAD HIGHLIGHT TUFT */}
      <path
        d="M 44 26 C 47 28 53 28 56 26 C 54 32 46 32 44 26 Z"
        fill="#FFD477"
      />

      {/* SOFT ROSY CHEEKS */}
      <ellipse cx="29" cy="56" rx="4.5" ry="3" fill="#F5A6A6" opacity="0.65" />
      <ellipse cx="71" cy="56" rx="4.5" ry="3" fill="#F5A6A6" opacity="0.65" />

      {/* EYES */}
      {/* Left Eye */}
      <circle cx="37" cy="46" r="4.8" fill="#3D2B24" />
      <circle cx="35.5" cy="44.2" r="1.6" fill="#FFFFFF" />
      <circle cx="38.5" cy="47.5" r="0.8" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="63" cy="46" r="4.8" fill="#3D2B24" />
      <circle cx="61.5" cy="44.2" r="1.6" fill="#FFFFFF" />
      <circle cx="64.5" cy="47.5" r="0.8" fill="#FFFFFF" />

      {/* CREAM SNOUT / MUZZLE */}
      <ellipse cx="50" cy="58" rx="14" ry="10" fill="#FFF8EE" stroke="#5A3828" strokeWidth="2.5" />

      {/* NOSE */}
      <path
        d="M 44 52 C 44 48 56 48 56 52 C 56 56 52 59 50 59 C 48 59 44 56 44 52 Z"
        fill="#5A3828"
      />
      <circle cx="47" cy="51" r="1.1" fill="#FFFFFF" />

      {/* SMILE & TONGUE */}
      <line x1="50" y1="59" x2="50" y2="62" stroke="#5A3828" strokeWidth="2.5" strokeLinecap="round" />
      {/* Joyful open smile with tongue */}
      <path
        d="M 41 61 Q 50 59 59 61 Q 55 72 50 72 Q 45 72 41 61"
        fill="#6B3728"
        stroke="#5A3828"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 45 66 C 45 66 45 74 50 74 C 55 74 55 66 55 66 Z"
        fill="#F5A6A6"
        stroke="#5A3828"
        strokeWidth="1.8"
      />

      {/* SWEET LITTLE DISTINGUISHING HEART BADGE NEAR CHEEK */}
      <g transform="translate(68, 22) scale(0.75)">
        <path
          d="M 12 4.5 C 12 2 10 0 7.5 0 C 5 0 4 2 4 2 C 4 2 3 0 0.5 0 C -2 0 -4 2 -4 4.5 C -4 9 4 14 4 14 C 4 14 12 9 12 4.5 Z"
          fill="#F5A6A6"
          stroke="#5A3828"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}
