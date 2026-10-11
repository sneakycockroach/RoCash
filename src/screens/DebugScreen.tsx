import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { useData } from '../state/DataProvider';
import { getCategoryTotals, getPeriodTotals } from '../lib/api/reports';
import { getMyStats } from '../lib/api/profiles';
import { getRecentErrors, subscribeErrors, type QueueErrorRecord } from '../lib/queue';
import { getLocalToday, getCurrentMonthRange } from '../lib/dates';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const DebugScreen: React.FC = () => {
  const navigate = useNavigate();
  const { session, user, profile, refreshProfile } = useAuth();
  const {
    categories,
    recentEntries,
    queue,
    queueCount,
    flushNow,
    addEntry,
    markNoSpendToday,
    claimUserBadge,
    refreshAll,
  } = useData();

  const [recentErrors, setRecentErrors] = useState<QueueErrorRecord[]>(getRecentErrors());
  const [actionOutput, setActionOutput] = useState<{ title: string; data: any } | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeErrors((errs) => setRecentErrors([...errs]));
    return unsub;
  }, []);

  // Format token expiry
  const tokenExpiry = session?.expires_at
    ? new Date(session.expires_at * 1000).toLocaleString()
    : 'No active session';

  // Find food category
  const foodCategory = categories.find((c) => c.name.toLowerCase().includes('food')) || categories[0];

  // Button 1: Add test spend (4,500 Food)
  const handleAddTestSpend = async () => {
    setRunningAction('spend');
    try {
      const result = await addEntry({
        type: 'spend',
        amount: 4500,
        category_id: foodCategory?.id || null,
        note: 'Test Lunch',
        entry_date: getLocalToday(),
      });
      setActionOutput({
        title: 'Add test spend (4,500 Food) Result',
        data: result,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Add test spend (4,500 Food) Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Button 2: Add test saving (2,000)
  const handleAddTestSaving = async () => {
    setRunningAction('saving');
    try {
      const result = await addEntry({
        type: 'save',
        amount: 2000,
        category_id: null,
        note: 'Test saving',
        entry_date: getLocalToday(),
      });
      setActionOutput({
        title: 'Add test saving (2,000) Result',
        data: result,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Add test saving (2,000) Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Button 3: Mark no-spend today
  const handleMarkNoSpendToday = async () => {
    setRunningAction('nospend');
    try {
      await markNoSpendToday();
      setActionOutput({
        title: 'Mark no-spend today Result',
        data: { success: true, log_date: getLocalToday() },
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Mark no-spend today Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Button 4: Load my_stats
  const handleLoadMyStats = async () => {
    setRunningAction('stats');
    try {
      const stats = await getMyStats();
      setActionOutput({
        title: 'Load my_stats Result',
        data: stats,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Load my_stats Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Button 5: Run category_totals for this month
  const handleCategoryTotals = async () => {
    setRunningAction('category_totals');
    try {
      const { from, to } = getCurrentMonthRange();
      const totals = await getCategoryTotals(from, to);
      setActionOutput({
        title: `Run category_totals (${from} to ${to}) Result`,
        data: totals,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Run category_totals Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Extra RPC test: Run period_totals for this month
  const handlePeriodTotals = async () => {
    setRunningAction('period_totals');
    try {
      const { from, to } = getCurrentMonthRange();
      const totals = await getPeriodTotals(from, to, 'day');
      setActionOutput({
        title: `Run period_totals day bucket (${from} to ${to}) Result`,
        data: totals,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Run period_totals Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Button 6: Claim badge report_viewed
  const handleClaimBadge = async () => {
    setRunningAction('badge');
    try {
      const claimed = await claimUserBadge('report_viewed');
      setActionOutput({
        title: 'Claim badge report_viewed Result',
        data: { badge_code: 'report_viewed', claimed_new: claimed },
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Claim badge report_viewed Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  // Flush offline queue
  const handleFlushNow = async () => {
    setRunningAction('flush');
    try {
      const res = await flushNow();
      setActionOutput({
        title: 'Flush Queue Result',
        data: res,
      });
    } catch (err: any) {
      setActionOutput({
        title: 'Flush Queue Error',
        data: { error: err.message || String(err) },
      });
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-safe pb-safe max-w-[500px] mx-auto bg-[var(--bg)] font-mono text-xs">
      {/* Header */}
      <div className="py-4 flex items-center justify-between hairline-b mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-sans font-semibold text-sm cursor-pointer"
          style={{ color: 'var(--accent)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refreshProfile();
              refreshAll();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--fill)] text-[var(--label)] cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reload All</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold font-sans text-[var(--label)]">RoCash Database Debugger</h1>
        <p className="text-[12px] font-sans" style={{ color: 'var(--label-2)' }}>
          End-to-end Supabase schema, RPCs, views and offline queue verification.
        </p>
      </div>

      {/* Action Buttons Bar */}
      <div className="mb-6 space-y-2 font-sans">
        <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--label-2)' }}>
          Database Verification Actions
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'spend'}
            onClick={handleAddTestSpend}
          >
            Add test spend (4,500 Food)
          </Button>

          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'saving'}
            onClick={handleAddTestSaving}
          >
            Add test saving (2,000)
          </Button>

          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'nospend'}
            onClick={handleMarkNoSpendToday}
          >
            Mark no-spend today
          </Button>

          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'stats'}
            onClick={handleLoadMyStats}
          >
            Load my_stats view
          </Button>

          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'category_totals'}
            onClick={handleCategoryTotals}
          >
            Run category_totals
          </Button>

          <Button
            variant="secondary"
            className="!h-10 !text-xs !px-2"
            loading={runningAction === 'badge'}
            onClick={handleClaimBadge}
          >
            Claim badge report_viewed
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="!h-9 !text-xs !px-2 flex-1"
            loading={runningAction === 'period_totals'}
            onClick={handlePeriodTotals}
          >
            Run period_totals RPC
          </Button>
        </div>
      </div>

      {/* Raw Action Output Window */}
      {actionOutput && (
        <div className="mb-6">
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-[var(--accent)] font-sans">{actionOutput.title}</span>
            <button
              type="button"
              onClick={() => setActionOutput(null)}
              className="text-xs cursor-pointer hover:underline font-sans"
              style={{ color: 'var(--label-2)' }}
            >
              Clear
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-black/80 text-green-400 overflow-x-auto text-[11px] leading-relaxed max-h-56">
            {JSON.stringify(actionOutput.data, null, 2)}
          </pre>
        </div>
      )}

      {/* 1. Session Information */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 font-sans" style={{ color: 'var(--label-2)' }}>
          1. Session & Auth
        </span>
        <Card className="p-3">
          <div className="space-y-1">
            <div>
              <span className="font-bold">User ID: </span>
              <span className="break-all">{user?.id || 'Not signed in'}</span>
            </div>
            <div>
              <span className="font-bold">Email: </span>
              <span>{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-bold">Token Expiry: </span>
              <span>{tokenExpiry}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Profile JSON */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 font-sans" style={{ color: 'var(--label-2)' }}>
          2. Profile JSON
        </span>
        <Card className="p-3">
          <pre className="overflow-x-auto text-[11px] max-h-48">
            {profile ? JSON.stringify(profile, null, 2) : 'No profile loaded'}
          </pre>
        </Card>
      </div>

      {/* 3. Offline Queue */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider font-sans" style={{ color: 'var(--label-2)' }}>
            3. Offline Queue ({queueCount} pending)
          </span>
          <button
            type="button"
            onClick={handleFlushNow}
            disabled={runningAction === 'flush'}
            className="px-2.5 py-1 rounded bg-[var(--accent)] text-white font-sans font-bold text-xs cursor-pointer disabled:opacity-50"
          >
            Flush now
          </button>
        </div>
        <Card className="p-3">
          {queue.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-sans">
              <CheckCircle size={14} />
              <span>Queue is empty. All operations synchronized.</span>
            </div>
          ) : (
            <pre className="overflow-x-auto text-[11px] max-h-48 text-[var(--label)]">
              {JSON.stringify(queue, null, 2)}
            </pre>
          )}
        </Card>
      </div>

      {/* 4. Categories */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 font-sans" style={{ color: 'var(--label-2)' }}>
          4. Categories ({categories.length})
        </span>
        <Card className="p-3">
          <pre className="overflow-x-auto text-[11px] max-h-48">
            {JSON.stringify(categories, null, 2)}
          </pre>
        </Card>
      </div>

      {/* 5. Last 10 Entries */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 font-sans" style={{ color: 'var(--label-2)' }}>
          5. Last 10 Entries ({recentEntries.length})
        </span>
        <Card className="p-3">
          <pre className="overflow-x-auto text-[11px] max-h-48">
            {JSON.stringify(recentEntries, null, 2)}
          </pre>
        </Card>
      </div>

      {/* 6. Last 20 Errors */}
      <div className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 font-sans" style={{ color: 'var(--label-2)' }}>
          6. Last 20 Errors ({recentErrors.length})
        </span>
        <Card className="p-3">
          {recentErrors.length === 0 ? (
            <div className="flex items-center gap-2 text-neutral-500 font-sans">
              <CheckCircle size={14} />
              <span>No logged client/validation errors.</span>
            </div>
          ) : (
            <pre className="overflow-x-auto text-[11px] max-h-48 text-red-500">
              {JSON.stringify(recentErrors, null, 2)}
            </pre>
          )}
        </Card>
      </div>
    </div>
  );
};
