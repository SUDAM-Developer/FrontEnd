import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { getSettings } from '@/apis/users';
import { useApiResource } from '@/hooks/useApiResource';
import { ApiState } from '@/components/ApiState';
import { ActionButton } from '@/components/ActionButton';
import { InstallSheet } from '@/features/home/InstallSheet';
export default function Screen() {
  const router = useRouter();
  const { state, retry } = useApiResource(getSettings);
  const [installOpen, setInstallOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  if (state.status !== 'ready')
    return (
      <ApiState
        message={state.status === 'error' ? state.message : undefined}
        onRetry={state.status === 'error' ? retry : undefined}
      />
    );
  const profile = state.data.profile;
  const subjects = profile.subjects.map((subject) => subject.name);
  const data = {
    teacherLabel: `${profile.name} 선생님${subjects.length ? ` · ${subjects.join(' · ')}` : ''}`,
    dateLabel: new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Seoul',
    }).format(new Date()),
    lessons: [],
    tasks: [],
    scheduleAvailable: false,
    tasksAvailable: false,
  };
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <HomeScreen
        data={data}
        onPreparationStep={(step) => {
          if (step === 'student') router.push('/tutoring/student');
          else if (step === 'tutoring') router.push('/tutoring/operation');
          else
            setNotice(
              step === 'introduction'
                ? '소개서 만들기는 준비 중이에요.'
                : '커리큘럼 받기는 준비 중이에요.',
            );
        }}
        onStudents={() => router.push('/students')}
        onProfile={() => router.push('/settings')}
        onRecord={() => setNotice('수업 일정 연결을 준비 중이에요.')}
        onInstallInfo={() => setInstallOpen(true)}
        onTask={(task) => {
          if (task.id === 'income') router.push('/income');
          else if (task.id === 'reports') router.push('/reports');
          else setNotice('해당 기능은 아직 연결되지 않았어요.');
        }}
      />
      {installOpen && <InstallSheet onClose={() => setInstallOpen(false)} />}
      <Modal
        visible={notice !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNotice(null)}
      >
        <View style={s.overlay}>
          <View style={s.dialog}>
            <Text style={s.title}>안내</Text>
            <Text style={s.body}>{notice}</Text>
            <ActionButton label="확인" onPress={() => setNotice(null)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0006',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: { width: '100%', maxWidth: 342, padding: 24, backgroundColor: '#fff', borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
});
