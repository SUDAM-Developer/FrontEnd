import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { getSettings } from '@/apis/users';
import { useApiResource } from '@/hooks/useApiResource';
import { ApiState } from '@/components/ApiState';
import { ActionButton } from '@/components/ActionButton';
import { InstallSheet } from '@/features/home/InstallSheet';
import { loadHomeTasks } from '@/features/home/apiData';
import type { HomeTask } from '@/features/home/types';
const PENDING_TASKS: HomeTask[] = [
  { id: 'records', label: '미기록 수업', count: null },
  { id: 'messages', label: '안 보낸 카톡', count: null },
  { id: 'reports', label: '발송 대기 정산 리포트', count: null },
  { id: 'income', label: '미입금', count: null },
];
export default function Screen() {
  const router = useRouter();
  const { state, retry } = useApiResource(getSettings);
  const { state: tasks } = useApiResource(loadHomeTasks);
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
    // 일정 조회 API가 아직 없어 오늘 수업은 0건으로 보고 수업 없음 시안을 표시합니다.
    lessons: [],
    // 할 일 조회 중이거나 실패하면 각 항목을 0건이 아닌 `-`로 표시합니다.
    tasks: tasks.status === 'ready' ? tasks.data : PENDING_TASKS,
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
