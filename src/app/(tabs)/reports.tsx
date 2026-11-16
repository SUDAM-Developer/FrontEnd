import { CAN_PREVIEW } from '@/config/review';
import { useState } from 'react';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { ReportScreen } from '@/features/report/ReportScreen';
import { reportPreviewState } from '@/features/report/previewData';
export default function Screen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [retried, setRetried] = useState(false);
  const state = CAN_PREVIEW
    ? reportPreviewState(retried ? 'normal' : preview)
    : { status: 'unavailable' as const };
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <ReportScreen state={state} onRetry={() => setRetried(true)} />
    </>
  );
}
