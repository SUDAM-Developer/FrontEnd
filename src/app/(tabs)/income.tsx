import { CAN_PREVIEW } from '@/config/review';
import { useState } from 'react';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { IncomeScreen } from '@/features/income/IncomeScreen';
import { incomePreviewState } from '@/features/income/previewData';
export default function Screen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [retried, setRetried] = useState(false);
  const state = CAN_PREVIEW
    ? incomePreviewState(retried ? 'normal' : preview)
    : { status: 'unavailable' as const };
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <IncomeScreen state={state} onRetry={() => setRetried(true)} />
    </>
  );
}
