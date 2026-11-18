import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { getMe } from '@/apis/auth';
import { ApiState } from '@/components/ApiState';
import { useApiResource } from '@/hooks/useApiResource';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
export function AuthGate({ children }: { children: ReactNode }) {
  const { state, retry } = useApiResource(getMe);
  const { setProfile } = useOnboarding();
  useEffect(() => {
    if (state.status === 'ready' && state.data.name)
      setProfile((current) => ({ ...current, name: state.data.name ?? '' }));
  }, [state, setProfile]);
  if (state.status !== 'ready')
    return (
      <ApiState
        message={state.status === 'error' ? state.message : undefined}
        onRetry={state.status === 'error' ? retry : undefined}
      />
    );
  if (state.data.status === 'TERMS_REQUIRED') return <Redirect href="/terms" />;
  if (state.data.status === 'PROFILE_REQUIRED') return <Redirect href="/profile" />;
  return children;
}
