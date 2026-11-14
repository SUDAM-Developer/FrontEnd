import { useLocalSearchParams } from 'expo-router';
import { TextbookScreen } from '@/features/tutoring/TextbookScreen';
import { isPrefillSource } from '@/features/tutoring/TutoringFormLayout';

export default function Screen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  return <TextbookScreen prefillSource={isPrefillSource(source) ? source : undefined} />;
}
