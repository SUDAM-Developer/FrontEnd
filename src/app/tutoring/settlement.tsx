import { useLocalSearchParams } from 'expo-router';
import { SettlementScreen } from '@/features/tutoring/SettlementScreen';
import { isPrefillSource } from '@/features/tutoring/TutoringFormLayout';

export default function Screen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  return <SettlementScreen prefillSource={isPrefillSource(source) ? source : undefined} />;
}
