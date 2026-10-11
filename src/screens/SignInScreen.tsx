import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Eye, EyeOff } from 'lucide-react';

export const SignInScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/today');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      <div className="pt-10 pb-6">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">Sign in</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className={error ? 'border-[var(--over)]' : ''}>
          <div className="px-4 py-3 hairline-b">
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

          <div className="px-4 py-3 relative flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-xs font-medium" style={{ color: 'var(--label-2)' }}>
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none mt-1 text-[17px] text-[var(--label)]"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 cursor-pointer"
              style={{ color: 'var(--label-2)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Card>

        {error && (
          <p className="text-[13px] px-2 text-[var(--over)] font-medium">
            {error}
          </p>
        )}

        <div className="flex justify-end pr-1">
          <Link
            to="/forgot"
            className="text-[15px] hover:underline"
            style={{ color: 'var(--label-2)' }}
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <Button type="submit" variant="primary" loading={loading}>
            Sign in
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow hairline-t" />
            <span className="flex-shrink mx-4 text-xs" style={{ color: 'var(--label-3)' }}>
              or
            </span>
            <div className="flex-grow hairline-t" />
          </div>

          <Button
            type="button"
            variant="secondary"
            loading={googleLoading}
            onClick={handleGoogle}
            icon={
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>
        </div>
      </form>

      <div className="mt-auto py-8 text-center text-[15px]" style={{ color: 'var(--label-2)' }}>
        New here?{' '}
        <Link to="/sign-up" className="font-semibold text-[var(--label)] hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};
