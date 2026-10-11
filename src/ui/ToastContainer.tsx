import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useData } from '../state/DataProvider';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useData();

  return (
    <div
      className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex flex-col items-center space-y-2 px-4"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-center justify-between max-w-sm w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isError
                  ? 'bg-[var(--bg-card)] border-[var(--color-danger)] text-[var(--color-danger)]'
                  : isSuccess
                  ? 'bg-[var(--bg-card)] border-[var(--color-green)] text-[var(--color-green-dark)] dark:text-[var(--color-green)]'
                  : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]'
              }`}
            >
              <div className="flex items-center space-x-2 mr-2">
                {isError ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                )}
                <span className="leading-snug text-xs sm:text-sm">{toast.text}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
