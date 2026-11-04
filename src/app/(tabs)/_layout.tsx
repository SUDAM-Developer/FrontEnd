import { Link, Redirect, Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';

export default function TabsLayout() {
  const { profile } = useOnboarding();
  if (!profile.name) return <Redirect href="/" />;
  return (
    <View style={s.page}>
      <View style={s.phone}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#219bff',
            tabBarInactiveTintColor: '#7c8391',
            tabBarIcon: () => null,
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
