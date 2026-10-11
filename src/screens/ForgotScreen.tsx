import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ChevronLeft } from 'lucide-react';

export const ForgotScreen: React.FC = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      <div className="pt-4 pb-2">
        <button
          type="button"
          onClick={() => navigate('/sign-in')}
          className="flex items-center text-[17px] -ml-2 p-2 cursor-pointer"
          style={{ color: 'var(--accent)' }}
        >
          <ChevronLeft size={24} />
          <span>Back</span>
        </button>
      </div>

      <div className="pt-4 pb-6">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">Reset password</h1>
      </div>

      {sent ? (
        <Card className="p-5 text-center mt-4">
          <h2 className="text-lg font-semibold text-[var(--label)]">Link sent</h2>
          <p className="text-[15px] mt-2" style={{ color: 'var(--label-2)' }}>
            We sent a password reset link to {email}. Check your email and open the link.
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate('/sign-in')}>
              Back to Sign in
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card>
            <div className="px-4 py-3">
              <label className="block text-xs font-medium" style={{ color: 'var(--label-2)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amara@example.com"
                className="w-full bg-transparent outline-none mt-1 text-[17px] text-[var(--label)]"
                autoCapitalize="none"
                autoComplete="email"
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
              Send reset link
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
