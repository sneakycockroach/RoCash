import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ResetScreen: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError(null);
    setLoading(true);
    try {
      await updatePassword(password);
      navigate('/today');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      <div className="pt-10 pb-6">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">New password</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card>
          <div className="px-4 py-3">
            <label className="block text-xs font-medium" style={{ color: 'var(--label-2)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-transparent outline-none mt-1 text-[17px] text-[var(--label)]"
              required
            />
          </div>
        </Card>

        {error && (
          <p className="text-[13px] px-2 text-[var(--over)] font-medium">
            {error}
          </p>
        )}

        <div className="mt-2">
          <Button type="submit" variant="primary" loading={loading}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
};
