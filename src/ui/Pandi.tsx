import React from 'react';
import { motion } from 'framer-motion';

export type PandiPose =
  | 'base'
  | 'video-call'
  | 'whiteboard'
  | 'teamwork'
  | 'cloudwatching'
  | 'yoga'
  | 'painting'
  | 'reading'
  | 'clipboard'
  | 'skateboard'
  | 'gaming'
  | 'designer'
  | 'delivery'
  | 'campfire';

interface PandiProps {
  pose?: PandiPose;
  size?: number; // max 160px per calm rules
  caption?: string;
  className?: string;
}

export const Pandi: React.FC<PandiProps> = ({
  pose = 'base',
  size = 140,
  caption,
  className = '',
}) => {
  // Cap at 160px per Calm rules: "Pandi max 160px, only where DESIGN.md says."
  const clampedSize = Math.min(160, Math.max(80, size));

  const remoteUrl =
    pose === 'base'
      ? 'https://svgapp.ai/static/mascots/pandi.svg'
      : `https://svgapp.ai/static/poses/pandi-${pose}.svg`;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: clampedSize, height: clampedSize }}
        className="relative flex items-center justify-center"
      >
        <img
          src={remoteUrl}
          alt={`Pandi ${pose}`}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback inline stylized illustration if offline / CDN issue
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.pandi-fallback');
            if (fallback) (fallback as HTMLElement).style.display = 'flex';
          }}
        />

        {/* Crisp vector fallback for offline environments */}
        <div
          className="pandi-fallback hidden w-full h-full flex-col items-center justify-center rounded-3xl"
          style={{ display: 'none' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Red panda ears */}
            <circle cx="30" cy="30" r="14" fill="#E65100" />
            <circle cx="30" cy="30" r="8" fill="#FFF3E0" />
            <circle cx="70" cy="30" r="14" fill="#E65100" />
            <circle cx="70" cy="30" r="8" fill="#FFF3E0" />
            {/* Head */}
            <circle cx="50" cy="46" r="28" fill="#F57C00" />
            {/* White face markings */}
            <circle cx="36" cy="48" r="8" fill="#FFF8E1" />
            <circle cx="64" cy="48" r="8" fill="#FFF8E1" />
            <ellipse cx="50" cy="54" rx="12" ry="8" fill="#FFF8E1" />
            {/* Eyes & Nose */}
            <circle cx="42" cy="45" r="3" fill="#212121" />
            <circle cx="58" cy="45" r="3" fill="#212121" />
            <ellipse cx="50" cy="51" rx="3.5" ry="2.5" fill="#212121" />
            {/* Green hoodie */}
            <path d="M24 74 C 24 58, 76 58, 76 74 L 74 96 L 26 96 Z" fill="#30B566" />
            <path d="M 46 68 L 54 68 L 50 78 Z" fill="#2E7D32" />
          </svg>
        </div>
      </motion.div>
      {caption && (
        <span className="text-xs mt-2" style={{ color: 'var(--label-2)' }}>
          {caption}
        </span>
      )}
    </div>
  );
};
