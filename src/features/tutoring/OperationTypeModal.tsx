import { Image } from 'expo-image';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { primitive } from '@/styles/colors';
import simple from '../../../assets/images/tutoring-type-simple.svg';
import detailed from '../../../assets/images/tutoring-type-detailed.svg';
import minimal from '../../../assets/images/tutoring-type-minimal.svg';
import { operationTypes, reportLabels, settlementLabel } from './operation';
import type { OperationPreferences } from './operation';
const graphics = { simple, detailed, minimal };
export function OperationTypeModal({
  value,
  teacherName,
  onClose,
  onConfirm,
}: {
  value: OperationPreferences;
  teacherName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const type = operationTypes[value.reportFrequency];
  const description =
    value.reportFrequency === 'EVERY_LESSON' && !value.homeworkReminder
      ? '매 수업 근황을 꼼꼼하게 보내요'
      : value.reportFrequency === 'NONE' && value.homeworkReminder
        ? '정산 리포트와 교육비 안내, 숙제 알림을 보내요'
        : type.description;
  const summary = [
    ['학부모 근황', reportLabels[value.reportFrequency]],
    ['정산', settlementLabel(value)],
    ['학생 숙제 알림', value.homeworkReminder ? '보내기' : '안 보내기'],
  ];
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable
          role="button"
          accessibilityLabel="유형 모달 닫기"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          role="dialog"
          accessibilityLabel="운영 유형 확인"
          accessibilityViewIsModal
          style={s.dialog}
        >
          <ScrollView contentContainerStyle={s.content}>
            <Image
              source={graphics[type.key]}
              style={s.graphic}
              contentFit="contain"
              accessible={false}
            />
            <Text style={s.complete}>진단 완료!</Text>
            <Text role="heading" style={s.title}>
              {teacherName ? `${teacherName} ` : ''}선생님은 {type.name}
            </Text>
            <Text style={s.description}>{description}</Text>
            <View style={s.summary}>
              {summary.map(([label, text], index) => (
                <View key={label} style={[s.row, index > 0 && s.divider]}>
                  <Text style={s.label}>{label}</Text>
                  <Text style={s.value}>{text}</Text>
                </View>
              ))}
            </View>
            <Text style={s.hint}>과외마다 언제든 바꿀 수 있어요</Text>
          </ScrollView>
          <View style={s.footer}>
            <ActionButton label="이대로 시작하기" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const { gray, blue } = primitive;
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#2d303d80',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 342,
    maxHeight: '90%',
    backgroundColor: gray[0],
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: { paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' },
  graphic: { width: 100, height: 100, marginBottom: 28 },
  complete: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: gray[600], marginBottom: 4 },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: blue[500], textAlign: 'center' },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: gray[350],
    textAlign: 'center',
    marginTop: 4,
  },
  summary: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: gray[100],
    borderRadius: 8,
    marginTop: 28,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  divider: { borderTopWidth: 0.5, borderTopColor: gray[100] },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: gray[550] },
  value: { fontSize: 13, lineHeight: 18, color: gray[350], flexShrink: 1, textAlign: 'right' },
  hint: { fontSize: 12, lineHeight: 18, color: gray[350], marginTop: 28, marginBottom: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 0 },
});
