import React, { useState } from 'react';
import { useAuth } from '../state/AuthProvider';
import { useData } from '../state/DataProvider';
import { formatHeaderDate, formatMoney, formatTime } from '../lib/format';
import { Avatar } from '../ui/Avatar';
import { Card, CardRow } from '../ui/Card';
import { Button } from '../ui/Button';
import { Pandi } from '../ui/Pandi';
import { Flame, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalToday } from '../lib/dates';

export const TodayScreen: React.FC = () => {
  const { profile } = useAuth();
  const {
    todayEntries,
    categories,
    activeStreak,
    addEntry,
    removeEntry,
    isTodayNoSpend,
  } = useData();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<'spend' | 'save'>('spend');
  const [amountStr, setAmountStr] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currency = profile?.currency_code || 'UGX';
  const dailyBudget = profile?.daily_budget || 20000;
  const savingGoal = profile?.daily_saving_goal || 5000;

  // Calculate totals
  const totalSpent = todayEntries
    .filter((e) => e.type === 'spend')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalSaved = todayEntries
    .filter((e) => e.type === 'save')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const remaining = Math.max(0, dailyBudget - totalSpent);
  const isOver = totalSpent > dailyBudget;
  const overAmount = totalSpent - dailyBudget;

  const progressPercent = Math.min(100, Math.round((totalSpent / (dailyBudget || 1)) * 100));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amountStr.replace(/,/g, ''));
    if (!numericAmount || numericAmount <= 0) return;

    const catId = addType === 'spend' ? (selectedCategoryId || categories[0]?.id || null) : null;

    setIsSubmitting(true);
    try {
      await addEntry({
        type: addType,
        amount: numericAmount,
        category_id: catId,
        note: note.trim() || null,
        entry_date: getLocalToday(),
      });
      setIsAddOpen(false);
      setAmountStr('');
      setNote('');
      showToast(`Added ${formatMoney(numericAmount, currency)}`);
    } catch (err: any) {
      alert(err.message || 'Could not save entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find category helper
  const getCategory = (catId?: string | null) => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-28 max-w-[430px] mx-auto bg-[var(--bg)]">
      {/* 1. Header */}
      <header className="pt-3 pb-5 flex items-center justify-between">
        <div>
          <span
            className="text-[12px] font-semibold tracking-wider block"
            style={{ color: 'var(--label-2)' }}
          >
            {formatHeaderDate()}
          </span>
          <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)] leading-tight">
            Today
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Gold streak flame chip */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--fill)] select-none">
            <Flame size={16} className="text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-[14px] font-bold text-[var(--label)]">
              {activeStreak}
            </span>
          </div>

          {/* User avatar */}
          <Avatar
            seed={profile?.avatar_seed || 'Amara'}
            style={profile?.avatar_style || 'lorelei'}
            backgroundColor={profile?.avatar_bg || 'b6e3f4'}
            size={36}
          />
        </div>
      </header>

      {/* 2. One Ring Card (Calm Rules: one ring card only, no glows, no second lap) */}
      <Card className="p-5 mb-6">
        <div className="flex flex-col items-center justify-center my-3">
          {/* Circular progress visual */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="var(--fill)"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={isOver ? 'var(--over)' : 'var(--accent)'}
                strokeWidth="10"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center px-2">
              <span className="text-[28px] font-bold text-[var(--label)] tracking-tight leading-none">
                {isOver
                  ? formatMoney(overAmount, currency)
                  : formatMoney(remaining, currency)}
              </span>
              <span className="text-[12px] mt-1 font-medium" style={{ color: isOver ? 'var(--over)' : 'var(--label-2)' }}>
                {isOver ? `over today's ${formatMoney(dailyBudget, currency)}` : `left of ${formatMoney(dailyBudget, currency)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Card Inset Rows: Spent and Saved */}
        <div className="mt-4 pt-3 hairline-t space-y-2">
          <div className="flex justify-between items-center text-[15px]">
            <span style={{ color: 'var(--label-2)' }}>Spent</span>
            <span className="font-semibold text-[var(--label)]">
              {formatMoney(totalSpent, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span style={{ color: 'var(--label-2)' }}>Saved</span>
            <span className="font-semibold text-[var(--accent)]">
              {formatMoney(totalSaved, currency)} of {formatMoney(savingGoal, currency)}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. One List (Calm Rules: Today shows only header, one ring card, one list, Add button) */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[17px] font-semibold text-[var(--label)]">
            Today's Entries
          </h2>
          {isTodayNoSpend && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--fill)] text-[var(--accent)] font-medium">
              No-spend day 🌿
            </span>
          )}
        </div>

        {todayEntries.length === 0 ? (
          <Card className="p-8 flex flex-col items-center text-center">
            <Pandi pose="cloudwatching" size={130} />
            <h3 className="text-[17px] font-semibold text-[var(--label)] mt-4">
              Nothing logged yet
            </h3>
            <p className="text-[14px] mt-1" style={{ color: 'var(--label-2)' }}>
              Add your first entry and your streak begins.
            </p>
          </Card>
        ) : (
          <Card>
            {todayEntries.map((entry, idx) => {
              const cat = getCategory(entry.category_id);
              const isLast = idx === todayEntries.length - 1;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardRow isLast={isLast}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            entry.type === 'save'
                              ? 'var(--accent)'
                              : cat?.color || 'var(--color-other)',
                        }}
                      >
                        {entry.type === 'save' ? '★' : cat?.name?.slice(0, 1) || '•'}
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[var(--label)]">
                          {entry.type === 'save' ? 'Savings' : cat?.name || 'Expense'}
                        </div>
                        <div className="text-[12px]" style={{ color: 'var(--label-2)' }}>
                          {entry.note ? `${entry.note} · ` : ''}
                          {formatTime(entry.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[15px] font-semibold ${
                          entry.type === 'save' ? 'text-[var(--accent)]' : 'text-[var(--label)]'
                        }`}
                      >
                        {entry.type === 'save' ? '+' : ''}
                        {formatMoney(entry.amount, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        className="p-1 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                        title="Delete entry"
                      >
                        <Trash2 size={16} className="text-[var(--destructive)]" />
                      </button>
                    </div>
                  </CardRow>
                </motion.div>
              );
            })}
          </Card>
        )}
      </section>

      {/* 4. Floating Black Capsule "+ Add" Button pinned above Tab Bar */}
      <div className="fixed bottom-20 left-0 right-0 max-w-[430px] mx-auto px-5 flex justify-center z-30 pointer-events-none">
        <motion.button
          type="button"
          onClick={() => setIsAddOpen(true)}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="pointer-events-auto h-[48px] px-6 rounded-full bg-[var(--button-bg)] text-[var(--button-label)] font-semibold text-[16px] flex items-center gap-2 hairline-border cursor-pointer shadow-md"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add</span>
        </motion.button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-28 left-0 right-0 max-w-[340px] mx-auto z-50 px-4 py-2 rounded-full bg-[var(--surface-raised)] hairline-border text-center text-sm font-medium text-[var(--label)] shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Flow Bottom Sheet Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="w-full max-w-[430px] rounded-t-[28px] bg-[var(--surface-raised)] p-5 pb-safe hairline-t max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3">
                {/* Drag Handle */}
                <div className="w-10 h-1 bg-[var(--separator)] rounded-full mx-auto absolute left-0 right-0 top-3" />
                <h3 className="text-[20px] font-bold text-[var(--label)] pt-2">Add Entry</h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 cursor-pointer pt-2"
                  style={{ color: 'var(--label-2)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Segmented Control */}
              <div className="flex p-1 rounded-full bg-[var(--fill)] my-4">
                <button
                  type="button"
                  onClick={() => setAddType('spend')}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                    addType === 'spend'
                      ? 'bg-[var(--surface)] text-[var(--label)] hairline-border'
                      : 'text-[var(--label-2)]'
                  }`}
                >
                  Spent
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('save')}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                    addType === 'save'
                      ? 'bg-[var(--surface)] text-[var(--accent)] hairline-border'
                      : 'text-[var(--label-2)]'
                  }`}
                >
                  Saved
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--label-2)' }}>
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0"
                    autoFocus
                    required
                    className="w-full bg-[var(--fill)] rounded-2xl px-4 py-3 text-[28px] font-bold text-[var(--label)] outline-none"
                  />
                </div>

                {/* Category picker (only for spend) */}
                {addType === 'spend' && (
                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--label-2)' }}>
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => {
                        const isSelected =
                          selectedCategoryId === c.id ||
                          (!selectedCategoryId && c.id === categories[0]?.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(c.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-[var(--label)] text-[var(--bg)] ring-2 ring-[var(--label)]'
                                : 'bg-[var(--fill)] text-[var(--label)]'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--label-2)' }}>
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={addType === 'spend' ? 'Lunch, boda, coffee...' : "What's it for?"}
                    className="w-full bg-[var(--fill)] rounded-2xl px-4 py-2.5 text-[17px] text-[var(--label)] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    Save
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
