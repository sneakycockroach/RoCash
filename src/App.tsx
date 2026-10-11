import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './state/AuthProvider';
import { DataProvider } from './state/DataProvider';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { ForgotScreen } from './screens/ForgotScreen';
import { ResetScreen } from './screens/ResetScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TodayScreen } from './screens/TodayScreen';
import { MonthScreen } from './screens/MonthScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DebugScreen } from './screens/DebugScreen';

// UI
import { TabBar } from './ui/TabBar';

// Tab routes where the 5-tab bar appears
const TAB_ROUTES = ['/today', '/month', '/reports', '/rewards', '/settings'];

// Guard for protected screens
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, profile, loading, profileLoading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--label-2)]">
        <span className="text-sm font-medium">Loading RoCash...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  // Profile check: if loaded and not onboarded, redirect to onboarding
  if (!profileLoading && profile && profile.onboarded === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Guard for onboarding
const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--label-2)]">
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  if (profile && profile.onboarded === true) {
    return <Navigate to="/today" replace />;
  }

  return <>{children}</>;
};

// Root redirector based on session and onboarding
const RootRedirect: React.FC = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--label-2)]">
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  if (profile && profile.onboarded === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/today" replace />;
};

const AnimatedPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const showTabBar = TAB_ROUTES.some((path) => location.pathname.startsWith(path));

  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth Flow */}
          <Route
            path="/welcome"
            element={
              <AnimatedPageWrapper>
                <WelcomeScreen />
              </AnimatedPageWrapper>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AnimatedPageWrapper>
                <SignInScreen />
              </AnimatedPageWrapper>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AnimatedPageWrapper>
                <SignUpScreen />
              </AnimatedPageWrapper>
            }
          />
          <Route
            path="/forgot"
            element={
              <AnimatedPageWrapper>
                <ForgotScreen />
              </AnimatedPageWrapper>
            }
          />
          <Route
            path="/reset"
            element={
              <AnimatedPageWrapper>
                <ResetScreen />
              </AnimatedPageWrapper>
            }
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <RequireOnboarding>
                <AnimatedPageWrapper>
                  <OnboardingScreen />
                </AnimatedPageWrapper>
              </RequireOnboarding>
            }
          />

          {/* Tab Pages */}
          <Route
            path="/today"
            element={
              <RequireAuth>
                <AnimatedPageWrapper>
                  <TodayScreen />
                </AnimatedPageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/month"
            element={
              <RequireAuth>
                <AnimatedPageWrapper>
                  <MonthScreen />
                </AnimatedPageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <AnimatedPageWrapper>
                  <ReportsScreen />
                </AnimatedPageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/rewards"
            element={
              <RequireAuth>
                <AnimatedPageWrapper>
                  <RewardsScreen />
                </AnimatedPageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <AnimatedPageWrapper>
                  <SettingsScreen />
                </AnimatedPageWrapper>
              </RequireAuth>
            }
          />

          {/* Debug Screen */}
          <Route
            path="/debug"
            element={
              <AnimatedPageWrapper>
                <DebugScreen />
              </AnimatedPageWrapper>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Persistent 5-tab bar on main screens */}
      {showTabBar && <TabBar />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppShell />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
