import { useCallback } from 'react';
import { Redirect } from 'expo-router';
import ProfileScreen from '@/features/profile/ProfileScreen';
import { ApiState } from '@/components/ApiState';
import { useApiResource } from '@/hooks/useApiResource';
import { getMe } from '@/apis/auth';
import { getSettings, saveProfile } from '@/apis/users';
export default function Screen() {
  const load = useCallback(async (signal: AbortSignal) => {
    const me = await getMe(signal);
    const settings = me.status === 'ACTIVE' ? await getSettings(signal) : null;
    return {
      me,
      profile: settings
        ? {
            name: settings.profile.name,
            subjects: settings.profile.subjects.map((subject) => subject.name),
          }
        : undefined,
    };
  }, []);
  const { state, retry } = useApiResource(load);
  if (state.status !== 'ready')
    return (
      <ApiState
        message={state.status === 'error' ? state.message : undefined}
        onRetry={state.status === 'error' ? retry : undefined}
      />
    );
  if (state.data.me.status === 'TERMS_REQUIRED') return <Redirect href="/terms" />;
  return (
    <ProfileScreen
      editingProfile={state.data.me.status === 'ACTIVE'}
      initialProfile={state.data.profile}
      onSave={(value, signal) => saveProfile(value, state.data.me.status === 'ACTIVE', signal)}
    />
  );
}
