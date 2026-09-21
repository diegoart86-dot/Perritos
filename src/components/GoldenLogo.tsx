import React from 'react';
import GoldenAppIcon from './GoldenAppIcon';

interface GoldenLogoProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
}

export default function GoldenLogo({
  size = 'md',
  subtitle,
  className = '',
}: GoldenLogoProps) {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 54,
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <GoldenAppIcon size={iconSizes[size]} withBackground={false} />
      <div className="flex flex-col">
        <span
          className={`font-montserrat font-medium text-[#3D2B24] tracking-tight leading-tight ${textSizes[size]}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          Golden <span className="text-[#F4B942]">Life</span>
        </span>
        {subtitle && (
          <span className="font-montserrat font-normal text-[11px] text-[#806F66] tracking-normal leading-none mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
