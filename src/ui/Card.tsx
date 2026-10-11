import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[22px] bg-[var(--surface)] hairline-border overflow-hidden transition-colors ${className}`}
    >
      {children}
    </div>
  );
};

export const CardRow: React.FC<{
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, isLast = false, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`min-h-[52px] flex items-center justify-between px-4 py-3 transition-colors ${
        !isLast ? 'hairline-b' : ''
      } ${onClick ? 'cursor-pointer active:bg-[var(--fill)]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
