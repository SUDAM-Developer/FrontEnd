import { useRef } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import ProfileScreen from '@/features/profile/ProfileScreen';
import type { SaveProfile } from '@/features/profile/profile';
export default function ProfilePreview() {
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const attempts = useRef(0);
  if (!__DEV__) return <Redirect href="/profile" />;
  const save: SaveProfile = async (_, signal) => {
    const attempt = ++attempts.current;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => {
          signal.removeEventListener('abort', abort);
          resolve();
        },
        scenario === 'loading' ? 3000 : 650,
      );
      function abort() {
        clearTimeout(timer);
        reject(new Error('Aborted'));
      }
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
    if (scenario === 'error' && attempt === 1) throw new Error('Preview save failure');
  };
  return (
    <ProfileScreen
      onSave={save}
      initialProfile={
        scenario === 'loading' || scenario === 'error'
          ? { name: '김나연', subjects: ['영어'] }
          : undefined
      }
    />
  );
}
