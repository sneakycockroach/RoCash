import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CalendarRange,
  BarChart2,
  Award,
  Settings as SettingsIcon,
} from 'lucide-react';

interface TabItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const TABS: TabItem[] = [
  { id: 'today', path: '/today', label: 'Today', icon: CalendarDays },
  { id: 'month', path: '/month', label: 'Month', icon: CalendarRange },
  { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart2 },
  { id: 'rewards', path: '/rewards', label: 'Rewards', icon: Award },
  { id: 'settings', path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Active tab determination
  const currentPath = location.pathname;
  const activeTab = TABS.find((tab) => currentPath.startsWith(tab.path)) || TABS[0];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto select-none"
    >
      <div
        className="hairline-t flex items-center justify-around px-2 pt-2 pb-safe"
        style={{
          backgroundColor: 'rgba(var(--surface), 0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          background: 'var(--surface)',
          opacity: 0.98,
        }}
      >
        {TABS.map((tab) => {
          const isSelected = activeTab.id === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] cursor-pointer active:opacity-70 transition-opacity"
            >
              <div className="relative flex flex-col items-center">
                <Icon
                  size={24}
                  strokeWidth={1.75}
                  style={{
                    color: isSelected ? 'var(--accent)' : 'var(--label-2)',
                  }}
                />
                <span
                  className="text-[11px] font-medium tracking-tight mt-1 transition-colors"
                  style={{
                    color: isSelected ? 'var(--accent)' : 'var(--label-2)',
                  }}
                >
                  {tab.label}
                </span>

                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
