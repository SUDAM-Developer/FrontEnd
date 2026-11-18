import { useEffect } from 'react';
import OnboardingApp from '@/features/onboarding/OnboardingApp';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useApiResource } from '@/hooks/useApiResource';
import { getSettings, deleteAccount } from '@/apis/users';
import { logout } from '@/apis/auth';
import { ApiState } from '@/components/ApiState';
export default function Screen() {
  const { state, retry } = useApiResource(getSettings);
  const { setProfile } = useOnboarding();
  useEffect(() => {
    if (state.status === 'ready')
      setProfile({
        name: state.data.profile.name,
        subjects: state.data.profile.subjects.map((subject) => subject.name),
      });
  }, [state, setProfile]);
  if (state.status !== 'ready')
    return (
      <ApiState
        message={state.status === 'error' ? state.message : undefined}
        onRetry={state.status === 'error' ? retry : undefined}
      />
    );
  return <OnboardingApp onLogout={logout} onDelete={deleteAccount} />;
}
