import React from 'react';
import { Flame, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { useData } from '../state/DataProvider';
import { Avatar } from './Avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showAvatar = true,
}) => {
  const { profile } = useAuth();
  const { effectiveStreak } = useData();

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--bg-tabbar)] backdrop-blur-md transition-colors"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
      }}
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--text-tertiary)] leading-none mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Streak indicator - Gold only on the streak flame */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)]"
            title={`Current streak: ${effectiveStreak} day(s)`}
          >
            <Flame
              className={`w-4 h-4 ${
                effectiveStreak > 0 ? 'text-[var(--color-gold)] fill-[var(--color-gold)]' : 'text-[var(--text-tertiary)]'
              }`}
            />
            <span
              className={`text-xs font-semibold tnum ${
                effectiveStreak > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
              }`}
            >
              {effectiveStreak}
            </span>
          </div>

          {/* Quick link to /debug */}
          <Link
            to="/debug"
            className="p-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)]"
            title="Database & Queue Debugger"
            aria-label="Debug Panel"
          >
            <Wrench className="w-4 h-4" />
          </Link>

          {/* User Avatar */}
          {showAvatar && (
            <Link to="/settings" aria-label="Go to Settings">
              <Avatar
                style={profile?.avatar_style || 'lorelei'}
                seed={profile?.avatar_seed || 'User'}
                bgHex={profile?.avatar_bg || '10B981'}
                size={32}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
