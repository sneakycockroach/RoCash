import React from 'react';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  onClick,
  type = 'button',
}) => {
  const isDisabled = disabled || loading;

  let baseStyle = 'h-[52px] rounded-full font-semibold text-[17px] flex items-center justify-center transition-opacity px-6 select-none';

  if (fullWidth) {
    baseStyle += ' w-full';
  }

  let colorStyle = '';
  if (variant === 'primary') {
    colorStyle = 'bg-[var(--button-bg)] text-[var(--button-label)]';
  } else if (variant === 'secondary') {
    colorStyle = 'bg-[var(--fill)] text-[var(--label)]';
  } else if (variant === 'tertiary') {
    colorStyle = 'bg-transparent text-[var(--accent)] hover:opacity-80';
  } else if (variant === 'destructive') {
    colorStyle = 'bg-[var(--fill)] text-[var(--destructive)] font-semibold';
  }

  if (isDisabled) {
    baseStyle += ' opacity-40 cursor-not-allowed';
  } else {
    baseStyle += ' cursor-pointer active:opacity-90';
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      className={`${baseStyle} ${colorStyle} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      )}
    </motion.button>
  );
};
