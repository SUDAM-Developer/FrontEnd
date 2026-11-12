import { CAN_PREVIEW } from '@/config/review';
import { useRef } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import TermsScreen from '@/features/terms/TermsScreen';
import type { SaveTerms } from '@/features/terms/terms';

export default function TermsPreview() {
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const attempts = useRef(0);
  if (!CAN_PREVIEW) return <Redirect href="/terms" />;
  const save: SaveTerms = async (_, signal) => {
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
    <TermsScreen onSave={save} initialChecked={scenario === 'loading' || scenario === 'error'} />
  );
}
