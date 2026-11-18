import { Tabs } from 'expo-router';
import { ReportScreen } from '@/features/report/ReportScreen';
import { loadReports } from '@/features/report/apiData';
import { useApiResource } from '@/hooks/useApiResource';
export default function Screen() {
  const { state, retry } = useApiResource(loadReports);
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <ReportScreen state={state} onRetry={retry} />
    </>
  );
}
