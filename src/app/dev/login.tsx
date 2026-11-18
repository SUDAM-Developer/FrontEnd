import { CAN_PREVIEW } from '@/config/review';
import { useRef } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import LoginScreen from '@/features/auth/LoginScreen';
import type { KakaoLogin } from '@/features/auth/LoginScreen';

/** ?scenario=loading | error | cancel 로 로그인 상태를 확인합니다. */
export default function LoginPreview() {
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const attempts = useRef(0);
  if (!CAN_PREVIEW) return <Redirect href="/login" />;
  const login: KakaoLogin = async (signal) => {
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
    if (scenario === 'cancel') return 'cancelled';
    if (scenario === 'error' && attempt === 1) throw new Error('Preview login failure');
  };
  return <LoginScreen onLogin={login} />;
}
