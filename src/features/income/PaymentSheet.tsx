import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { TextField } from '@/features/tutoring/FormFields';
import { formatWonInput, nextWonDigits } from '@/utils/won';
import { sheet as s } from './styles';
import { won } from './types';
import type { IncomeInvoice } from './types';

type Props = {
  invoice: IncomeInvoice;
  onClose: () => void;
  /** 전액 입금 완료 */
  onPaidInFull: () => void;
  /** 받은 금액을 저장하고 입금 안내를 다시 보냅니다. (카톡 연동 전) */
  onResend: (receivedAmount: number) => void;
};

/** T-15 입금 확인 시트 */
export function PaymentSheet({ invoice, onClose, onPaidInFull, onResend }: Props) {
  const [amount, setAmount] = useState('');
  const insets = useSafeAreaInsets();
  const title = `${invoice.studentName} ∙ 다음 ${invoice.sessionCount}회차 입금 확인`;

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={s.backdrop}>
        <Pressable
          role="button"
          accessibilityLabel="입금 확인 닫기"
          onPress={onClose}
          style={s.dismiss}
        />
        <View
          role="dialog"
          accessibilityViewIsModal
          accessibilityLabel={title}
          style={[s.sheet, { paddingBottom: insets.bottom }]}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
            <View style={s.handleArea}>
              <View style={s.handle} />
            </View>
            <View style={s.body}>
              <View style={s.texts}>
                <Text role="heading" style={s.title}>
                  {title}
                </Text>
                <Text style={s.description}>청구 {won(invoice.billedAmount)}</Text>
              </View>
              <TextField
                label="미입금액 입력"
                required={false}
                value={formatWonInput(amount)}
                onChangeText={(text) => {
                  const next = nextWonDigits(amount, text);
                  // 청구 금액보다 큰 받은 금액은 입력되지 않게 막습니다.
                  if (Number(next) <= invoice.billedAmount) setAmount(next);
                }}
                placeholder="금액을 알려주세요"
                keyboardType="number-pad"
                inputMode="numeric"
              />
            </View>
            <View style={s.cta}>
              <ActionButton label="전액 입금 완료" onPress={onPaidInFull} />
              <ActionButton
                label="카톡으로 입금 안내 재전송"
                variant="secondary"
                // Figma는 빈 입력에서도 같은 모양이라, 모양은 유지하고 금액이 있을 때만 보냅니다.
                onPress={() => {
                  if (Number(amount) > 0) onResend(Number(amount));
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
