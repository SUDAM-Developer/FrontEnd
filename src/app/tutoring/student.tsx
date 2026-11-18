import { useLocalSearchParams } from 'expo-router';
import { StudentInfoScreen } from '@/features/tutoring/StudentInfoScreen';
import { isPrefillSource } from '@/features/tutoring/TutoringFormLayout';
export default function Screen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  return <StudentInfoScreen prefillSource={isPrefillSource(source) ? source : undefined} />;
}
