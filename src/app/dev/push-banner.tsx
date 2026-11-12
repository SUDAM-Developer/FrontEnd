import { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { usePushBanner } from '@/features/notifications/PushBannerProvider';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
export default function BannerPreview() {
  const { show, dismiss } = usePushBanner();
  const ids = useRef<string[]>([]);
  const [opened, setOpened] = useState(false);
  const sample = useCallback(
    (durationMs = 0) => {
      const id = show({
        title: '윤서아 학생 수업이 끝났어요',
        message: '잊기 전에 8회차를 기록해 주세요',
        durationMs,
        onPress: () => setOpened(true),
      });
      ids.current.push(id);
    },
    [show],
  );
  useEffect(() => {
    if (__DEV__) sample();
    const ownIds = ids.current;
    return () => {
      ownIds.forEach((id) => dismiss(id));
    };
  }, [sample, dismiss]);
  if (!__DEV__) return <Redirect href="/home" />;
  function clear() {
    ids.current.forEach((id) => dismiss(id));
    ids.current.length = 0;
  }
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content}>
        <Text role="heading" style={s.heading}>
          배너 미리보기
        </Text>
        <Text style={s.body}>
          화면 위쪽에 알림이 표시됩니다. 배너를 누르면 닫히고 확인 동작을 실행해요.
        </Text>
        {opened && (
          <Text role="status" style={s.result}>
            배너를 눌렀어요. 실제 회차 기록 이동은 연결 전입니다.
          </Text>
        )}
        <View style={s.buttons}>
          <ActionButton
            label="시안 배너 표시"
            onPress={() => {
              clear();
              sample();
            }}
          />
          <ActionButton
            label="5초 후 자동 닫기"
            variant="secondary"
            onPress={() => {
              clear();
              sample(5000);
            }}
          />
          <ActionButton
            label="알림 두 개 순서대로 표시"
            variant="secondary"
            onPress={() => {
              clear();
              sample(2000);
              const id = show({
                title: '두 번째 알림',
                message: '여러 알림은 겹치지 않고 차례로 표시돼요.',
                durationMs: 0,
              });
              ids.current.push(id);
            }}
          />
          <ActionButton
            label="긴 알림 표시"
            variant="secondary"
            onPress={() => {
              clear();
              const id = show({
                title:
                  '학생의 수업 기록과 다음 숙제를 확인해 주세요. 긴 제목도 화면 너비에 맞춰 표시됩니다.',
                message: '긴 본문은 두 줄까지 표시하고 나머지는 줄임표로 표시해요.',
                durationMs: 0,
              });
              ids.current.push(id);
            }}
          />
          <ActionButton label="알림 닫기" variant="secondary" onPress={clear} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', backgroundColor: c.surface.input },
  content: {
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 24,
    paddingTop: 180,
    paddingBottom: 40,
  },
  heading: { ...t.heading[1].semiBold, color: c.text.default.strong, marginBottom: 12 },
  body: { ...t.body[4].regular, color: c.text.default.weak, marginBottom: 24 },
  result: { ...t.body[4].medium, color: c.text.brand.assistive, marginBottom: 16 },
  buttons: { gap: 12 },
});
