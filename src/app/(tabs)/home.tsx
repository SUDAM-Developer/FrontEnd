import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { homePreviewData } from '@/features/home/previewData';
import { CAN_PREVIEW } from '@/config/review';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import type { HomeLesson } from '@/features/home/types';
import { ActionButton } from '@/components/ActionButton';
import { InstallSheet } from '@/features/home/InstallSheet';
export default function Screen() {
  const router = useRouter();
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [finishedPreview, setFinishedPreview] = useState<string | null>(null);
  const previewLoading = CAN_PREVIEW && (preview === 'loading' || preview === 'fast');
  const loading = previewLoading && finishedPreview !== preview;
  useEffect(() => {
    if (!previewLoading) return;
    const timer = setTimeout(() => setFinishedPreview(preview!), preview === 'fast' ? 100 : 3000);
    return () => clearTimeout(timer);
  }, [preview, previewLoading]);
  const { profile } = useOnboarding();
  const [installOpen, setInstallOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const data = CAN_PREVIEW
    ? preview === 'empty'
      ? {
          ...homePreviewData,
          teacherLabel: 'OOO 선생님 · 영어',
          lessons: [],
          tasks: homePreviewData.tasks.map((task) => ({
            ...task,
            count: task.id === 'income' ? 3 : task.count,
          })),
        }
      : homePreviewData
    : {
        teacherLabel: `${profile.name} 선생님${profile.subjects.length ? ` · ${profile.subjects.join(' · ')}` : ''}`,
        dateLabel: new Intl.DateTimeFormat('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timeZone: 'Asia/Seoul',
        }).format(new Date()),
        lessons: [],
        tasks: [],
      };
  function record(lesson: HomeLesson) {
    if (CAN_PREVIEW) router.push({ pathname: '/dev/home-record', params: { lessonId: lesson.id } });
    else setNotice('수업 기록 API는 아직 연결되지 않았어요.');
  }
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <HomeScreen
        data={data}
        loading={loading}
        firstTutoring={CAN_PREVIEW && preview === 'first'}
        onPreparationStep={(step) => {
          if (step === 'student' || step === 'tutoring') router.push('/tutoring/student');
          else
            setNotice(
              step === 'introduction'
                ? '소개서 만들기는 준비 중이에요.'
                : '커리큘럼 받기는 준비 중이에요.',
            );
        }}
        onStudents={() => router.push('/students')}
        onProfile={() => router.push('/settings')}
        onRecord={record}
        onInstallInfo={() => setInstallOpen(true)}
        onTask={(task) => {
          if (task.id === 'income') router.push('/income');
          else if (task.id === 'records' && data.lessons[0]) record(data.lessons[0]);
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
