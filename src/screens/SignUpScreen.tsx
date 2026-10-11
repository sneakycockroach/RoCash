import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthProvider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Pandi } from '../ui/Pandi';

export const SignUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length < 10) return 2;
    return 3;
  };
  const strength = getStrength(password);
  const strengthLabel = strength === 0 ? '' : strength === 1 ? 'Weak' : strength === 2 ? 'Good' : 'Strong';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { session } = await signUp(email, password);
      if (session) {
        navigate('/onboarding');
      } else {
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
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
      setError(err.message || 'Google sign up failed.');
      setGoogleLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col justify-between min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12">
          <Pandi pose="delivery" size={160} />
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--label)] mt-6">
            Check your inbox
          </h1>
          <p className="text-[17px] mt-2 max-w-[280px]" style={{ color: 'var(--label-2)' }}>
            We sent a confirmation link to {email}.
          </p>
        </div>
        <div className="pb-8">
          <Button variant="primary" onClick={() => navigate('/sign-in')}>
            Back to Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-safe pb-safe max-w-[430px] mx-auto bg-[var(--bg)]">
      <div className="pt-10 pb-6">
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--label)]">Create account</h1>
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

          <div className="px-4 py-3">
            <label className="block text-xs font-medium" style={{ color: 'var(--label-2)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-transparent outline-none mt-1 text-[17px] text-[var(--label)]"
              autoComplete="new-password"
              required
            />
          </div>
        </Card>

        {password.length > 0 && (
          <div className="px-1 flex items-center justify-between">
            <div className="flex gap-1.5 w-32">
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength >= 1 ? 'bg-[var(--over)]' : 'bg-[var(--fill)]'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength >= 2 ? 'bg-[var(--accent)]' : 'bg-[var(--fill)]'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full ${
                  strength >= 3 ? 'bg-[var(--accent)]' : 'bg-[var(--fill)]'
                }`}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--label-2)' }}>
              {strengthLabel}
            </span>
          </div>
        )}

        {error && (
          <p className="text-[13px] px-2 text-[var(--over)] font-medium">
            {error}
          </p>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <Button type="submit" variant="primary" loading={loading}>
            Create account
          </Button>

          <Button
            type="button"
            variant="secondary"
            loading={googleLoading}
            onClick={handleGoogle}
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-xs text-center px-4 mt-2" style={{ color: 'var(--label-3)' }}>
          By continuing you agree to the Terms and Privacy Policy.
        </p>
      </form>

      <div className="mt-auto py-8 text-center text-[15px]" style={{ color: 'var(--label-2)' }}>
        Already have an account?{' '}
        <Link to="/sign-in" className="font-semibold text-[var(--label)] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
