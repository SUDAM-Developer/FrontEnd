import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { Loading } from '@/components/Loading';
import { Choices } from './Choices';
import { s } from './styles';
import { useSubmission } from './useSubmission';
import type {
  CancellationReason,
  CancellationResult,
  LessonContext,
  SaveCancellation,
} from './types';
type Props = {
  lesson: LessonContext;
  onClose: () => void;
  onSave: SaveCancellation;
  onComplete: (result: CancellationResult) => void;
};
export function CancellationSheet({ lesson, onClose, onSave, onComplete }: Props) {
  const [reason, setReason] = useState<CancellationReason | null>(null);
  const submit = useSubmission();
  const insets = useSafeAreaInsets();
  function save() {
    if (!reason || submit.pending) return;
    const input = { lessonId: lesson.lessonId, reason };
    void submit.run((signal) => onSave(input, signal), onComplete);
  }
  return (
    <>
      <Modal
        transparent
        animationType="slide"
        visible
        onRequestClose={() => {
          if (!submit.pending) onClose();
        }}
      >
        <View style={s.backdrop}>
          <Pressable
            role="button"
            accessibilityLabel="휴강 시트 닫기"
            disabled={submit.pending}
            onPress={onClose}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          />
          <View
            role="dialog"
            accessibilityViewIsModal
            accessibilityLabel="휴강으로 기록할까요?"
            style={[s.sheet, { paddingBottom: Math.max(insets.bottom + 24, 56) }]}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={s.handle} />
              <Text role="heading" style={s.sheetTitle}>
                휴강으로 기록할까요?
              </Text>
              <Text style={s.description}>
                회차로 인정되는 경우는 '학생 당일 취소'이면서 휴강 정책이 '인정'일 때뿐이에요.{' '}
                {lesson.studentName} 학생의 정책은{' '}
                {lesson.sameDayCancellationCounts ? '인정' : '미인정'}입니다.
              </Text>
              <View style={s.reasonGrid}>
                <Choices
                  label="학생 취소 사유"
                  options={['학생 당일 취소', '학생 사전 취소'] as const}
                  value={reason === '학생 당일 취소' || reason === '학생 사전 취소' ? reason : null}
                  disabled={submit.pending}
                  onChange={setReason}
                />
                <Choices
                  label="기타 휴강 사유"
                  options={['선생님 사정', '공휴일'] as const}
                  value={reason === '선생님 사정' || reason === '공휴일' ? reason : null}
                  disabled={submit.pending}
                  onChange={setReason}
                />
              </View>
              {submit.error && (
                <View role="alert" style={{ marginBottom: 12 }}>
                  <Text style={s.warning}>
                    저장하지 못했어요. 사유를 유지했으니 다시 시도해 주세요.
                  </Text>
                </View>
              )}
              <ActionButton
                label={submit.error ? '다시 저장' : '완료'}
                disabled={!reason}
                loading={submit.pending}
                onPress={save}
              />
            </ScrollView>
          </View>
          <Loading visible={submit.pending} />
        </View>
      </Modal>
    </>
  );
}
