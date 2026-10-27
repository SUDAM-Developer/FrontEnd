import OnboardingApp from '@/features/onboarding/OnboardingApp';
import { Redirect } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
export default function Screen() {
  const { agreed, editing, profile } = useOnboarding();
  if (!agreed.every(Boolean) && !(editing && profile.name)) return <Redirect href="/terms" />;
  return <OnboardingApp screen="profile" />;
}
