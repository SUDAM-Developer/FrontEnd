import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { TextField } from '@/features/tutoring/FormFields';
import { useSubmission } from '@/features/session-record/useSubmission';
import { formatWonInput, nextWonDigits } from '@/utils/won';
import { feeSheet as s } from './styles';
import type { FeeEdit } from './types';

type Props = {
  /** 지금 총 교육비 (원). 금액 입력칸에 미리 채웁니다. */
  currentTotal: number;
  onClose: () => void;
  onSave: (edit: FeeEdit, signal: AbortSignal) => Promise<void>;
  onSaved: (edit: FeeEdit) => void;
};

/** T-14 교육비 수정 시트 */
export function FeeEditSheet({ currentTotal, onClose, onSave, onSaved }: Props) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState(String(currentTotal));
  const submit = useSubmission();
  const insets = useSafeAreaInsets();
  const canSave =
    reason.trim().length > 0 &&
    reason.length <= 200 &&
    amount !== '' &&
    Number(amount) >= 0 &&
    Number(amount) <= 10000000;

  const save = () => {
    if (!canSave || submit.pending) return;
    const edit = { previousTotal: currentTotal, total: Number(amount), reason: reason.trim() };
    void submit.run(
      (signal) => onSave(edit, signal),
      () => onSaved(edit),
    );
  };

  return (
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
          accessibilityLabel="교육비 수정 닫기"
          disabled={submit.pending}
          onPress={onClose}
          style={s.dismiss}
        />
        <View
          role="dialog"
          accessibilityViewIsModal
          accessibilityLabel="교육비 수정"
          style={[s.sheet, { paddingBottom: insets.bottom }]}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
            <View style={s.handleArea}>
              <View style={s.handle} />
            </View>
            <View style={s.body}>
              <View style={s.texts}>
                <Text role="heading" style={s.title}>
                  교육비 수정
                </Text>
                <Text style={s.description}>수정 전 · 후 금액과 사유가 함께 저장돼요</Text>
              </View>
              <TextField
                label="사유"
                value={reason}
                maxLength={200}
                onChangeText={setReason}
                placeholder="예: 교재비 15,000원 추가"
                editable={!submit.pending}
              />
              <TextField
                label="금액"
                value={formatWonInput(amount)}
                onChangeText={(text) => setAmount(nextWonDigits(amount, text))}
                keyboardType="number-pad"
                inputMode="numeric"
                editable={!submit.pending}
              />
              {submit.error && (
                <Text role="alert" style={s.error}>
                  저장하지 못했어요. 입력한 내용을 유지했으니 다시 시도해 주세요.
                </Text>
              )}
            </View>
            <View style={s.cta}>
              <ActionButton
                label={submit.error ? '다시 저장' : '저장'}
                disabled={!canSave}
                loading={submit.pending}
                onPress={save}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
