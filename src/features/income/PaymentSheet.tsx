import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from '@/components/TextInput';
import { ActionButton } from '@/components/ActionButton';
import { sheet as s } from './styles';
import { apiMessage } from '@/hooks/useApiResource';
import { won } from './types';
import type { IncomeInvoice } from './types';
type Props = {
  invoice: IncomeInvoice;
  onClose: () => void;
  onPaidInFull: () => Promise<void>;
  onPartialPayment: (amount: number) => Promise<void>;
  onResend: (participantId: number) => Promise<void>;
};
/** 부분 입금·재전송은 서로 다른 작업이므로 전액 확인과 구분합니다. */
export function PaymentSheet({
  invoice,
  onClose,
  onPaidInFull,
  onPartialPayment,
  onResend,
}: Props) {
  const [amount, setAmount] = useState('');
  const parents = invoice.parents ?? [];
  const [recipient, setRecipient] = useState<number | undefined>(
    parents.length === 1 ? parents[0].participantId : undefined,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);
  const insets = useSafeAreaInsets();
  async function confirm(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  const close = () => {
    if (!locked.current) onClose();
  };
  return (
    <Modal transparent animationType="slide" visible onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable
          role="button"
          accessibilityLabel="입금 확인 닫기"
          onPress={close}
          disabled={pending}
          style={s.dismiss}
        />
        <View
          role="dialog"
          accessibilityViewIsModal
          accessibilityLabel="입금 확인"
          style={[s.sheet, { paddingBottom: insets.bottom }]}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
            <View style={s.handleArea}>
              <View style={s.handle} />
            </View>
            <View style={s.body}>
              <Text role="heading" style={s.title}>
                {invoice.studentName} · 입금 확인
              </Text>
              <Text style={s.description}>
                청구 {won(invoice.billedAmount)} · 받은 금액 {won(invoice.receivedAmount)}
              </Text>
              <Text>
                남은 금액 {won(Math.max(0, invoice.billedAmount - invoice.receivedAmount))}
              </Text>
              <Text>이번에 확인한 추가 입금액</Text>
              <TextInput
                accessibilityLabel="추가 입금액"
                value={amount}
                onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, ''))}
                editable={!pending}
                inputMode="numeric"
                keyboardType="number-pad"
                placeholder="일부 입금일 때만 입력해 주세요"
              />
              {parents.length > 1 && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {parents.map((parent) => (
                    <Pressable
                      key={parent.participantId}
                      role="radio"
                      accessibilityLabel={parent.label}
                      accessibilityState={{ selected: recipient === parent.participantId }}
                      disabled={pending}
                      onPress={() => setRecipient(parent.participantId)}
                    >
                      <Text>
                        {parent.label === 'MOTHER'
                          ? '어머니'
                          : parent.label === 'FATHER'
                            ? '아버지'
                            : '보호자'}
                        {recipient === parent.participantId ? ' ✓' : ''}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {error && <Text role="alert">{error}</Text>}
            </View>
            <View style={s.cta}>
              <ActionButton
                label="전액 입금 완료"
                loading={pending}
                disabled={amount.length > 0}
                onPress={() => void confirm(onPaidInFull)}
              />
              <ActionButton
                label="일부 입금 확인"
                variant="secondary"
                loading={pending}
                disabled={
                  !(
                    Number(amount) > 0 &&
                    Number(amount) < invoice.billedAmount - invoice.receivedAmount
                  )
                }
                onPress={() => void confirm(() => onPartialPayment(Number(amount)))}
              />
              <ActionButton
                label="카톡으로 입금 안내 재전송"
                variant="secondary"
                loading={pending}
                disabled={!recipient || amount.length > 0}
                onPress={() => {
                  if (recipient) void confirm(() => onResend(recipient));
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
