import arrowDownImage from '../../../assets/images/arrow_down.svg';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Chip } from '@/components/Chip';
import { semantic } from '@/styles/colors';
import { gap, lineWeight, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { FieldLabel, TextField } from './FormFields';
import { PrefillNotice, TutoringFormLayout, useSubmit } from './TutoringFormLayout';
import type { PrefillSource } from './TutoringFormLayout';

const CYCLES = ['4회차', '8회차', '직접'] as const;
const TIMINGS = ['선불', '후불'] as const;
// TODO: 은행 선택 바텀시트 디자인이 나오면 바꿉니다. 지금은 입력칸 아래에 목록을 펼칩니다.
const BANKS = [
  'KB국민',
  '신한',
  '우리',
  '하나',
  'NH농협',
  'IBK기업',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
] as const;

type Cycle = (typeof CYCLES)[number];
type Timing = (typeof TIMINGS)[number];
type Bank = (typeof BANKS)[number];

const FEE_SUFFIX = '원';

const onlyDigits = (text: string) => text.replace(/[^0-9]/g, '');

/** "360000" → "360,000원" */
const formatFee = (digits: string) =>
  digits ? `${Number(digits).toLocaleString('ko-KR')}${FEE_SUFFIX}` : '';

export type SettlementScreenProps = {
  /** 'lastTutoring'이면 입금 계좌 위에 "지난 과외 계좌를 불러왔어요." 안내를 보여 줍니다. */
  prefillSource?: PrefillSource;
};

/** T-07 과외 만들기 · 정산 조건 · 입금 계좌 (4/5 단계) */
export function SettlementScreen({ prefillSource }: SettlementScreenProps) {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [fee, setFee] = useState('');
  const [bank, setBank] = useState<Bank | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');

  const changeFee = (text: string) => {
    const digits = onlyDigits(text);
    // "원"만 지운 경우에는 숫자가 그대로라 다시 "원"이 붙으므로, 마지막 숫자를 지웁니다.
    if (fee && !text.endsWith(FEE_SUFFIX) && digits === fee) {
      setFee(fee.slice(0, -1));
      return;
    }
    setFee(digits.replace(/^0+/, ''));
  };

  const canProceed =
    cycle !== null &&
    timing !== null &&
    fee.length > 0 &&
    bank !== null &&
    accountNumber.length > 0 &&
    holder.trim().length > 0;

  // TODO: 입력한 정산 조건과 계좌를 다음 단계로 넘기거나 저장합니다.
  const { submitting, submit } = useSubmit(() => router.push('/tutoring/invite'));

  return (
    <TutoringFormLayout
      step={4}
      heading="정산방식"
      canProceed={canProceed}
      submitting={submitting}
      onNext={submit}
      helpText="수업료는 선생님 계좌로 바로 입금돼요. 수담은 돈을 대신 받지 않아요."
    >
      <View style={s.sections}>
        <View style={s.section}>
          <View style={s.sectionLabel}>
            <FieldLabel label="정산" required={false} />
          </View>
          <View style={s.chips}>
            <View role="radiogroup" accessibilityLabel="정산 주기" style={s.chipGroup}>
              {CYCLES.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  muted
                  role="radio"
                  selected={cycle === option}
                  onPress={() => setCycle(option)}
                />
              ))}
            </View>
            <View role="radiogroup" accessibilityLabel="정산 시점" style={s.chipGroup}>
              {TIMINGS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  muted
                  role="radio"
                  selected={timing === option}
                  onPress={() => setTiming(option)}
                />
              ))}
            </View>
          </View>
        </View>

        <TextField
          label="수업료 (정산 1회당)"
          value={formatFee(fee)}
          onChangeText={changeFee}
          keyboardType="number-pad"
          placeholder="수업료를 입력해 주세요"
        />

        <View style={s.section}>
          <View style={s.sectionLabel}>
            <FieldLabel label="입금 계좌 · 교육비 안내에 보여요" required={false} />
          </View>
          <View style={s.accountFields}>
            {prefillSource === 'lastTutoring' ? <PrefillNotice source="lastTutoring" /> : null}

            <View style={s.field}>
              <View style={s.fieldLabel}>
                <FieldLabel label="은행" />
              </View>
              <Pressable
                role="combobox"
                accessibilityLabel="은행"
                aria-expanded={bankOpen}
                onPress={() => setBankOpen((open) => !open)}
                style={[s.select, bankOpen && s.selectOpen]}
              >
                <Text style={[s.selectText, bank && s.selectTextFilled]}>
                  {bank ?? '은행을 선택해주세요'}
                </Text>
                <Image source={arrowDownImage} style={s.arrow} />
              </Pressable>
              {bankOpen ? (
                <View role="list" accessibilityLabel="은행 목록" style={s.options}>
                  {BANKS.map((option) => (
                    <Pressable
                      key={option}
                      role="option"
                      aria-selected={bank === option}
                      onPress={() => {
                        setBank(option);
                        setBankOpen(false);
                      }}
                      style={({ pressed }) => [s.option, pressed && s.optionPressed]}
                    >
                      <Text style={[s.optionText, bank === option && s.optionTextSelected]}>
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <TextField
              label="계좌번호"
              value={accountNumber}
              onChangeText={(text) => setAccountNumber(onlyDigits(text))}
              keyboardType="number-pad"
              placeholder="계좌 번호를 입력해 주세요"
            />
            <TextField
              label="예금주"
              value={holder}
              onChangeText={setHolder}
              placeholder="예금주를 입력해 주세요"
            />
          </View>
        </View>
      </View>
    </TutoringFormLayout>
  );
}

const s = StyleSheet.create({
  sections: { gap: gap[24] },
  section: { gap: gap[12] },
  sectionLabel: { paddingHorizontal: padding[8] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: gap[8] },
  chipGroup: { flexDirection: 'row', gap: gap[8] },
  accountFields: { gap: gap[12] },
  field: { gap: gap[8] },
  fieldLabel: { paddingHorizontal: padding[8] },
  // TextInput 상자와 같은 모양입니다.
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: padding[16],
    paddingHorizontal: padding[12],
    borderRadius: radius.small,
    borderWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    backgroundColor: semantic.surface.input,
  },
  selectOpen: { borderColor: semantic.border.focused },
  selectText: {
    flex: 1,
    ...typography.body[4].medium,
    color: semantic.text.default.weak,
  },
  selectTextFilled: { color: semantic.text.default.normal },
  // 디자인에서 16px 아이콘을 26px 칸에 맞춰 키워 씁니다.
  arrow: { width: 26, height: 26 },
  options: {
    borderRadius: radius.small,
    borderWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    backgroundColor: semantic.surface.input,
    overflow: 'hidden',
  },
  option: { paddingVertical: padding[12], paddingHorizontal: padding[12] },
  optionPressed: { backgroundColor: semantic.surface.default },
  optionText: { ...typography.body[4].medium, color: semantic.text.default.normal },
  optionTextSelected: { color: semantic.text.brand.assistive },
});
