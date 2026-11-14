import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { homePreviewData } from '@/features/home/previewData';
import { CAN_PREVIEW } from '@/config/review';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import type { HomeLesson } from '@/features/home/types';
import { ActionButton } from '@/components/ActionButton';
export default function Screen() {
  const router = useRouter();
  const { profile } = useOnboarding();
  const [notice, setNotice] = useState<string | null>(null);
  const data = CAN_PREVIEW
    ? homePreviewData
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
        onProfile={() => router.push('/settings')}
        onRecord={record}
        onInstallInfo={() =>
          setNotice(
            '브라우저 메뉴의 홈 화면에 추가 기능으로 이용할 수 있어요. 설치 가능 여부는 브라우저와 PWA 설정에 따라 달라요. 수업·입금 알림 수신은 아직 연결되지 않았어요.',
          )
        }
        onTask={(task) => {
          if (task.id === 'income') router.push('/income');
          else if (task.id === 'records' && data.lessons[0]) record(data.lessons[0]);
          else setNotice('해당 기능은 아직 연결되지 않았어요.');
        }}
      />
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
