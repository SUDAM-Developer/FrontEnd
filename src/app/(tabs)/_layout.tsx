import { Link, Redirect, Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';

export default function TabsLayout() {
  const { profile } = useOnboarding();
  const insets = useSafeAreaInsets();
  if (!profile.name) return <Redirect href="/" />;
  return (
    <View style={s.page}>
      <View style={s.phone}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#a8adb7',
            tabBarIcon: () => null,
            tabBarStyle: {
              height: 84 + insets.bottom,
              paddingTop: 16,
              paddingBottom: 16 + insets.bottom,
              paddingHorizontal: 24,
              backgroundColor: '#fff',
              borderTopWidth: 0,
            },
            tabBarItemStyle: { paddingVertical: 0 },
            tabBarIconStyle: { width: 28, height: 28 },
            tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
            headerTitleAlign: 'center',
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: '홈',
              headerRight: () => (
                <Link href="/settings" style={s.settings}>
                  <Text style={s.settingsText}>설정</Text>
                </Link>
              ),
            }}
          />
          <Tabs.Screen name="schedule" options={{ title: '일정' }} />
          <Tabs.Screen name="students" options={{ title: '학생' }} />
          <Tabs.Screen name="reports" options={{ title: '리포트' }} />
          <Tabs.Screen name="income" options={{ title: '수입' }} />
        </Tabs>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', backgroundColor: '#f3f4f7' },
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  settings: { paddingHorizontal: 16, paddingVertical: 8 },
  settingsText: { color: '#343845', fontSize: 14 },
});
