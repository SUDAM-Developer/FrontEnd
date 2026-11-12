import ProfileScreen from '@/features/profile/ProfileScreen';
import { Redirect } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
export default function Screen() {
  const { agreed, editing, profile } = useOnboarding();
  if (!agreed.every(Boolean) && !(editing && profile.name)) return <Redirect href="/terms" />;
  return <ProfileScreen />;
}
