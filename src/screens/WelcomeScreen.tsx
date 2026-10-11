import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pandi } from '../ui/Pandi';
import { Button } from '../ui/Button';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
        <Pandi pose="base" size={160} />
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)] mt-6">
          Your money, calmly.
        </h1>
        <p className="text-[17px] mt-2 max-w-[280px]" style={{ color: 'var(--label-2)' }}>
          Track what you spend, see what you save.
        </p>
      </div>

      <div className="flex flex-col gap-3 pb-8">
        <Button variant="primary" onClick={() => navigate('/sign-up')}>
          Get started
        </Button>
        <Button variant="secondary" onClick={() => navigate('/sign-in')}>
          I already have an account
        </Button>
        <button
          type="button"
          onClick={() => navigate('/debug')}
          className="text-xs text-center mt-2 py-2"
          style={{ color: 'var(--label-2)' }}
        >
          Open Database Debugger (/debug)
        </button>
      </div>
    </div>
  );
};
