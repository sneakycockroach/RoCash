import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { Button } from '../ui/Button';
import { Card, CardRow } from '../ui/Card';
import { Pandi } from '../ui/Pandi';
import { Avatar } from '../ui/Avatar';
import type { AvatarStyle } from '../lib/supabase';
import { Clock, Flame, Award, ChevronLeft } from 'lucide-react';

const PASTEL_BG = ['ffd5dc', 'b6e3f4', 'c0aede', 'd1f4d9', 'ffdfba', 'ffefd5'];

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfileState } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.display_name || 'Amara');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(profile?.avatar_style || 'lorelei');
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_seed || 'Amara');
  const [avatarBg, setAvatarBg] = useState(profile?.avatar_bg || 'b6e3f4');
  const [currency] = useState(profile?.currency_code || 'UGX');
  const [dailyBudget, setDailyBudget] = useState(profile?.daily_budget || 20000);
  const [savingGoal, setSavingGoal] = useState(profile?.daily_saving_goal || 5000);
  const [saving, setSaving] = useState(false);

  // Sample avatar seed grid
  const avatarSeeds = [
    'Amara', 'Kofi', 'Zuri', 'Tariq',
    'Nia', 'Leo', 'Maya', 'Eli',
    'Aria', 'Sami', 'Tara', 'Jules'
  ];

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        await updateProfileState({
          display_name: name.trim() || 'Amara',
          avatar_style: avatarStyle,
          avatar_seed: avatarSeed,
          avatar_bg: avatarBg,
          currency_code: currency,
          daily_budget: dailyBudget,
          daily_saving_goal: savingGoal,
          onboarded: true,
        });
        navigate('/today');
      } catch (e) {
        console.error('Failed to complete onboarding', e);
        navigate('/today');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      {/* 6-segment thin progress bar */}
      <div className="pt-2 pb-4">
        <div className="flex items-center justify-between mb-3 h-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-[17px] -ml-2 p-1 cursor-pointer"
              style={{ color: 'var(--label-2)' }}
            >
              <ChevronLeft size={22} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}
          <span className="text-xs font-semibold" style={{ color: 'var(--label-2)' }}>
            Step {step} of 6
          </span>
        </div>
        <div className="flex gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: s <= step ? 'var(--label)' : 'var(--fill)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Screen contents */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        {step === 1 && (
          <div className="text-center flex flex-col items-center">
            <Pandi pose="video-call" size={160} />
            <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)] mt-6">
              Hi, I'm Pandi.
            </h1>
            <p className="text-[17px] mt-2 max-w-[300px]" style={{ color: 'var(--label-2)' }}>
              I'll help you see where your money goes and keep a little more of it.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col">
            <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)] mb-6">
              What should we call you?
            </h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-[var(--separator)] pb-2 text-[28px] font-bold text-[var(--label)] outline-none"
              autoFocus
            />
            <p className="text-[13px] mt-3" style={{ color: 'var(--label-2)' }}>
              You can change this later.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="p-1 rounded-full border-[3px] border-[var(--accent)]">
                <Avatar
                  seed={avatarSeed}
                  style={avatarStyle}
                  backgroundColor={avatarBg}
                  size={120}
                />
              </div>
            </div>

            {/* Segmented Control */}
            <div className="flex w-full p-1 rounded-full bg-[var(--fill)] mb-4">
              {(['lorelei', 'notionists', 'thumbs'] as AvatarStyle[]).map((styleOption) => (
                <button
                  key={styleOption}
                  type="button"
                  onClick={() => setAvatarStyle(styleOption)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                    avatarStyle === styleOption
                      ? 'bg-[var(--surface)] text-[var(--label)] hairline-border shadow-xs'
                      : 'text-[var(--label-2)]'
                  }`}
                >
                  {styleOption}
                </button>
              ))}
            </div>

            {/* Grid of 12 */}
            <div className="grid grid-cols-4 gap-3 w-full mb-4">
              {avatarSeeds.map((s, idx) => {
                const bg = PASTEL_BG[idx % PASTEL_BG.length];
                const isSelected = avatarSeed === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setAvatarSeed(s);
                      setAvatarBg(bg);
                    }}
                    className={`flex items-center justify-center p-1 rounded-full transition-transform cursor-pointer ${
                      isSelected ? 'ring-3 ring-[var(--accent)]' : ''
                    }`}
                  >
                    <Avatar seed={s} style={avatarStyle} backgroundColor={bg} size={48} />
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              fullWidth={false}
              onClick={() => {
                const randomSeed = `Seed${Math.floor(Math.random() * 1000)}`;
                setAvatarSeed(randomSeed);
                setAvatarBg(PASTEL_BG[Math.floor(Math.random() * PASTEL_BG.length)]);
              }}
              className="text-sm px-6 h-10"
            >
              Shuffle
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col">
            <div className="flex justify-center mb-4">
              <Pandi pose="whiteboard" size={120} />
            </div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mb-4">
              Set your daily goals
            </h1>
            <Card>
              <CardRow>
                <span className="text-[17px] text-[var(--label)]">Currency</span>
                <span className="text-[17px] font-medium" style={{ color: 'var(--label-2)' }}>
                  UGX
                </span>
              </CardRow>
              <CardRow>
                <span className="text-[17px] text-[var(--label)]">Daily budget</span>
                <input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value) || 0)}
                  className="text-right text-[17px] font-medium bg-transparent outline-none max-w-[140px]"
                />
              </CardRow>
              <CardRow isLast>
                <span className="text-[17px] text-[var(--label)]">Daily saving goal</span>
                <input
                  type="number"
                  value={savingGoal}
                  onChange={(e) => setSavingGoal(Number(e.target.value) || 0)}
                  className="text-right text-[17px] font-medium bg-transparent outline-none max-w-[140px]"
                />
              </CardRow>
            </Card>
            <p className="text-[13px] mt-3" style={{ color: 'var(--label-2)' }}>
              Change anytime in Settings.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col">
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mb-4">
              Your categories
            </h1>
            <Card>
              <CardRow>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#007AFF] text-xs font-bold">
                    T
                  </div>
                  <span className="text-[17px]">Transport</span>
                </div>
              </CardRow>
              <CardRow>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#30B0C7] text-xs font-bold">
                    D
                  </div>
                  <span className="text-[17px]">Data & Airtime</span>
                </div>
              </CardRow>
              <CardRow>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#FF9500] text-xs font-bold">
                    F
                  </div>
                  <span className="text-[17px]">Food</span>
                </div>
              </CardRow>
              <CardRow>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#8E8E93] text-xs font-bold">
                    O
                  </div>
                  <span className="text-[17px]">Other</span>
                </div>
              </CardRow>
              <CardRow isLast>
                <span className="text-[17px] font-semibold text-[var(--accent)]">
                  + Add your own
                </span>
              </CardRow>
            </Card>
            <p className="text-[13px] mt-3" style={{ color: 'var(--label-2)' }}>
              Other is always there if you can't find the word.
            </p>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center text-center">
            <Pandi pose="teamwork" size={160} />
            <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)] mt-6 mb-4">
              You're all set, {name || 'Amara'}.
            </h1>
            <div className="w-full text-left space-y-3 my-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <Clock size={20} className="text-[var(--accent)]" />
                <span className="text-[17px] text-[var(--label)]">Log in 5 seconds</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <Flame size={20} className="text-[var(--gold)]" />
                <span className="text-[17px] text-[var(--label)]">Keep your streak</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <Award size={20} className="text-[var(--accent)]" />
                <span className="text-[17px] text-[var(--label)]">Collect badges</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pinned Bottom Button */}
      <div className="pb-6">
        <Button variant="primary" loading={saving} onClick={handleNext}>
          {step === 6 ? 'Start with today' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
