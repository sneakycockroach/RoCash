import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { useTheme } from '../lib/theme';
import { Card, CardRow } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ChevronRight, Wrench } from 'lucide-react';
import type { AppTheme } from '../lib/supabase';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/welcome');
    } catch (e) {
      console.error('Error signing out', e);
      setSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-28 max-w-[430px] mx-auto bg-[var(--bg)]">
      <header className="pt-3 pb-5">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">
          Settings
        </h1>
      </header>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardRow isLast>
            <div className="flex items-center gap-3">
              <Avatar
                seed={profile?.avatar_seed || 'Amara'}
                style={profile?.avatar_style || 'lorelei'}
                backgroundColor={profile?.avatar_bg || 'b6e3f4'}
                size={52}
              />
              <div>
                <h3 className="text-[17px] font-semibold text-[var(--label)]">
                  {profile?.display_name || 'Amara'}
                </h3>
                <p className="text-[13px]" style={{ color: 'var(--label-2)' }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </CardRow>
        </Card>

        {/* Money Group */}
        <div>
          <span
            className="text-[12px] font-semibold tracking-wider block mb-2 px-1 uppercase"
            style={{ color: 'var(--label-2)' }}
          >
            Money
          </span>
          <Card>
            <CardRow>
              <span className="text-[17px] text-[var(--label)]">Currency</span>
              <span className="text-[17px]" style={{ color: 'var(--label-2)' }}>
                {profile?.currency_code || 'UGX'}
              </span>
            </CardRow>
            <CardRow>
              <span className="text-[17px] text-[var(--label)]">Daily budget</span>
              <span className="text-[17px]" style={{ color: 'var(--label-2)' }}>
                {profile?.currency_code || 'UGX'} {Number(profile?.daily_budget || 20000).toLocaleString()}
              </span>
            </CardRow>
            <CardRow isLast>
              <span className="text-[17px] text-[var(--label)]">Daily saving goal</span>
              <span className="text-[17px]" style={{ color: 'var(--label-2)' }}>
                {profile?.currency_code || 'UGX'} {Number(profile?.daily_saving_goal || 5000).toLocaleString()}
              </span>
            </CardRow>
          </Card>
        </div>

        {/* App Appearance Group */}
        <div>
          <span
            className="text-[12px] font-semibold tracking-wider block mb-2 px-1 uppercase"
            style={{ color: 'var(--label-2)' }}
          >
            Appearance
          </span>
          <Card>
            <div className="p-3">
              <div className="flex rounded-full bg-[var(--fill)] p-1">
                {(['system', 'light', 'dark'] as AppTheme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer transition-all ${
                      theme === t
                        ? 'bg-[var(--surface)] text-[var(--label)] hairline-border shadow-xs'
                        : 'text-[var(--label-2)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Developer / Database Verification Link */}
        <div>
          <span
            className="text-[12px] font-semibold tracking-wider block mb-2 px-1 uppercase"
            style={{ color: 'var(--label-2)' }}
          >
            Developer
          </span>
          <Card>
            <CardRow isLast onClick={() => navigate('/debug')}>
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-[var(--accent)]" />
                <span className="text-[17px] text-[var(--label)]">Database Debugger (/debug)</span>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--label-3)' }} />
            </CardRow>
          </Card>
        </div>

        {/* Account Group */}
        <div>
          <span
            className="text-[12px] font-semibold tracking-wider block mb-2 px-1 uppercase"
            style={{ color: 'var(--label-2)' }}
          >
            Account
          </span>
          <Card>
            <CardRow isLast onClick={handleSignOut}>
              <span className="text-[17px] font-semibold text-[var(--destructive)]">
                {signingOut ? 'Signing out...' : 'Sign out'}
              </span>
            </CardRow>
          </Card>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-2 text-center text-xs space-y-1" style={{ color: 'var(--label-3)' }}>
          <p>RoCash 1.0 · Developed by Shina</p>
          <p>Pandi mascot by svgapp.ai (MIT) · DiceBear avatars</p>
        </div>
      </div>
    </div>
  );
};
