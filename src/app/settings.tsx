import OnboardingApp from '@/features/onboarding/OnboardingApp';
import { Redirect } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
export default function Screen() {
  const { profile } = useOnboarding();
  if (!profile.name) return <Redirect href="/" />;
  return <OnboardingApp screen="settings" />;
}
