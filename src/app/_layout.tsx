import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';
import { PushBannerProvider } from '@/features/notifications/PushBannerProvider';
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <PushBannerProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}
          />
        </PushBannerProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
