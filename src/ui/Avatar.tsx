import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei, notionists, thumbs } from '@dicebear/collection';
import type { AvatarStyle } from '../lib/supabase';

interface AvatarProps {
  seed?: string;
  style?: AvatarStyle;
  backgroundColor?: string; // 6 hex without #
  size?: number; // e.g. 36, 64, 120
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  seed = 'Amara',
  style = 'lorelei',
  backgroundColor = 'e2e8f0',
  size = 36,
  className = '',
}) => {
  const svgUri = useMemo(() => {
    try {
      const selectedCollection =
        style === 'notionists'
          ? notionists
          : style === 'thumbs'
          ? thumbs
          : lorelei;

      const cleanBg = (backgroundColor || 'e2e8f0').replace(/^#/, '');

      const avatar = createAvatar(selectedCollection as any, {
        seed: seed || 'Amara',
        backgroundColor: [cleanBg],
      });

      return avatar.toDataUri();
    } catch (e) {
      console.warn('Avatar generation failed, using fallback', e);
      return '';
    }
  }, [seed, style, backgroundColor]);

  if (!svgUri) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-semibold text-xs hairline-border ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: `#${backgroundColor.replace(/^#/, '')}`,
          color: 'var(--label)',
        }}
      >
        {(seed || 'A').slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={svgUri}
      alt="User avatar"
      className={`rounded-full hairline-border object-cover select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
      loading="lazy"
    />
  );
};
