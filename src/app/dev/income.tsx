import { CAN_PREVIEW } from '@/config/review';
import { useEffect } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
export default function IncomePreview() {
  const { state } = useLocalSearchParams<{ state?: string }>();
  const { profile, setProfile } = useOnboarding();
  useEffect(() => {
    if (CAN_PREVIEW && !profile.name) setProfile({ name: '미리보기', subjects: [] });
  }, [profile.name, setProfile]);
  if (!CAN_PREVIEW) return <Redirect href="/" />;
  if (!profile.name) return null;
  return <Redirect href={{ pathname: '/income', params: { preview: state ?? 'normal' } }} />;
}
