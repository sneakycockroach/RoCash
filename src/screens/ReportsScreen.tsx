import React from 'react';
import { Card } from '../ui/Card';
import { Pandi } from '../ui/Pandi';

export const ReportsScreen: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-28 max-w-[430px] mx-auto bg-[var(--bg)]">
      <header className="pt-3 pb-5">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">
          Reports
        </h1>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <Card className="p-8 w-full flex flex-col items-center">
          <Pandi pose="reading" size={140} />
          <h2 className="text-[20px] font-semibold text-[var(--label)] mt-5">
            Reports need a few days
          </h2>
          <p className="text-[15px] mt-2 max-w-[260px]" style={{ color: 'var(--label-2)' }}>
            Insights, weekly breakdowns and spending categories will appear here.
          </p>
        </Card>
      </div>
    </div>
  );
};
