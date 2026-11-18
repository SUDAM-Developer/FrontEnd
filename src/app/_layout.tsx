import '@/styles/webInputStyles';
import { TutoringDraftProvider } from '@/features/tutoring/TutoringDraftProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';
import { PushBannerProvider } from '@/features/notifications/PushBannerProvider';
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <TutoringDraftProvider>
          <PushBannerProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}
            />
          </PushBannerProvider>
        </TutoringDraftProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
