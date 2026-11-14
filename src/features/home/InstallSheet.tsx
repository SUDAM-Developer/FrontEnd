import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { primitive } from '@/styles/colors';
export function InstallSheet({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [notice, setNotice] = useState(false);
  return (
    <Modal transparent visible animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable
          role="button"
          accessibilityLabel="홈 화면 추가 안내 닫기"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          <View style={s.handle} />
          <ScrollView contentContainerStyle={s.content} bounces={false}>
            <Text role="heading" style={s.title}>
              홈 화면 수담 추가하기
            </Text>
            <Text style={s.description}>
              앱처럼 열리고 알림을 받을 수 있어요. 아이폰은 홈 화면에 추가해야 알림이 와요.(iOS 16.4
              이상)
            </Text>
            <View style={s.instructions}>
              <View style={s.instructionRow}>
                <Text style={s.browser}>아이폰 Safari</Text>
                <Text style={s.direction}>공유 버튼 → 홈 화면에 추가</Text>
              </View>
              <View style={[s.instructionRow, s.divider]}>
                <Text style={s.browser}>안드로이드 Chrome</Text>
                <Text style={s.direction}>⋮ 더보기 버튼 → 홈 화면에 추가</Text>
              </View>
            </View>
            <Text style={s.hint}>추가한 뒤 알림 허용하기 버튼을 누르세요</Text>
            {notice && (
              <Text role="alert" accessibilityLiveRegion="polite" style={s.notice}>
                알림 설정을 준비 중이에요. 이용 가능해지면 안내해 드릴게요.
              </Text>
            )}
            <ActionButton label="알림 허용하기" onPress={() => setNotice(true)} />
            <View style={s.later}>
              <ActionButton label="나중에" variant="secondary" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const { gray, blue } = primitive;
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0f111773',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '90%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: gray[0],
  },
  handle: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: gray[100],
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  content: { paddingHorizontal: 24 },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '700', color: gray[650] },
  description: { fontSize: 13, lineHeight: 18, color: gray[350], marginTop: 8 },
  instructions: { backgroundColor: gray[50], marginTop: 16, paddingHorizontal: 12 },
  instructionRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    paddingVertical: 12,
  },
  divider: { borderTopWidth: 1, borderTopColor: gray[100] },
  browser: { fontSize: 13, lineHeight: 18, color: gray[650] },
  direction: { fontSize: 12, lineHeight: 18, color: gray[600] },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: gray[350],
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  notice: { fontSize: 12, lineHeight: 18, color: blue[550], marginBottom: 12 },
  later: { marginTop: 8 },
});
