import arrowDownImage from '../../../assets/images/arrow_down.svg';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Chip } from '@/components/Chip';
import { semantic } from '@/styles/colors';
import { gap, lineWeight, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { TextInput } from '@/components/TextInput';
import { formatWonInput, nextWonDigits, onlyDigits } from '@/utils/won';
import { BankSheet, OTHER_BANK } from './BankSheet';
import type { Bank } from './BankSheet';
import { FieldLabel, TOO_LONG_MESSAGE, TextField, isTooLong } from './FormFields';
import { PrefillNotice, TutoringFormLayout } from './TutoringFormLayout';
import type { PrefillSource } from './TutoringFormLayout';

const CYCLES = ['4회차', '8회차', '12회차', '직접'] as const;
const TIMINGS = ['선불', '후불'] as const;

type Cycle = (typeof CYCLES)[number];
type Timing = (typeof TIMINGS)[number];

// 입력값 규칙
const CUSTOM_CYCLE_MIN = 1;
const CUSTOM_CYCLE_MAX = 20;
const FEE_MIN = 10_000;
const FEE_MAX = 10_000_000;
const BANK_NAME_MAX = 20;
const ACCOUNT_DIGITS_MIN = 10;
const ACCOUNT_DIGITS_MAX = 14;
const HOLDER_MAX = 20;

const inRange = (value: number, min: number, max: number) => value >= min && value <= max;

export type SettlementScreenProps = {
  /** 'lastTutoring'이면 입금 계좌 위에 "지난 과외 계좌를 불러왔어요." 안내를 보여 줍니다. */
  prefillSource?: PrefillSource;
};

/** T-07 과외 만들기 · 정산 조건 · 입금 계좌 (4/5 단계) */
export function SettlementScreen({ prefillSource }: SettlementScreenProps) {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [customCycle, setCustomCycle] = useState('');
  const [timing, setTiming] = useState<Timing | null>(null);
  const [fee, setFee] = useState('');
  const [bank, setBank] = useState<Bank | null>(null);
  const [otherBankName, setOtherBankName] = useState('');
  const [bankOpen, setBankOpen] = useState(false);
  /** 하이픈 입력을 허용합니다. 저장할 때는 숫자만 씁니다(accountDigits). */
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');
  /** 범위 오류는 입력을 마친 뒤(포커스가 빠진 뒤)에 보여 줍니다. */
  const [touched, setTouched] = useState({ cycle: false, fee: false, account: false });
  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  const changeFee = (text: string) => setFee(nextWonDigits(fee, text));

  const cycleValid =
    cycle !== null &&
    (cycle !== '직접' ||
      (customCycle.length > 0 && inRange(Number(customCycle), CUSTOM_CYCLE_MIN, CUSTOM_CYCLE_MAX)));
  const feeValid = fee.length > 0 && inRange(Number(fee), FEE_MIN, FEE_MAX);
  // '기타'를 골랐는데 은행 이름이 비어 있으면 고르지 않은 것으로 봅니다.
  const otherBankNameTooLong = isTooLong(otherBankName, BANK_NAME_MAX);
  const bankValid =
    bank !== null &&
    (bank !== OTHER_BANK || (otherBankName.trim().length > 0 && !otherBankNameTooLong));
  const accountDigits = onlyDigits(accountNumber);
  const accountValid = inRange(accountDigits.length, ACCOUNT_DIGITS_MIN, ACCOUNT_DIGITS_MAX);
  const holderTooLong = isTooLong(holder, HOLDER_MAX);
  const holderValid = holder.trim().length > 0 && !holderTooLong;

  const cycleError =
    touched.cycle && cycle === '직접' && customCycle.length > 0 && !cycleValid
      ? `${CUSTOM_CYCLE_MIN}~${CUSTOM_CYCLE_MAX}회 사이로 입력해 주세요`
      : undefined;
  const feeError =
    touched.fee && fee.length > 0 && !feeValid
      ? `${FEE_MIN.toLocaleString('ko-KR')}원 ~ ${FEE_MAX.toLocaleString('ko-KR')}원 사이로 입력해 주세요`
      : undefined;
  const accountError =
    (touched.account && accountDigits.length > 0 && !accountValid) ||
    accountDigits.length > ACCOUNT_DIGITS_MAX
      ? `계좌번호는 숫자 ${ACCOUNT_DIGITS_MIN}~${ACCOUNT_DIGITS_MAX}자리예요`
      : undefined;

  const canProceed =
    cycleValid && timing !== null && feeValid && bankValid && accountValid && holderValid;

  // TODO: 입력한 정산 조건과 계좌를 다음 단계로 넘기거나 저장합니다.
  // 계좌번호는 숫자만(accountDigits), 은행이 '기타'면 otherBankName.trim()을 저장합니다.
  const handleNext = () => router.push('/tutoring/invite');

  return (
    <TutoringFormLayout
      step={4}
      heading="정산방식"
      canProceed={canProceed}
      submitting={false}
      onNext={handleNext}
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
          {cycle === '직접' ? (
            <TextInput
              value={customCycle}
              onChangeText={(text) => setCustomCycle(onlyDigits(text).replace(/^0+/, ''))}
              onBlur={() => touch('cycle')}
              keyboardType="number-pad"
              maxLength={2}
              placeholder={`정산 회차를 입력해 주세요 (${CUSTOM_CYCLE_MIN}~${CUSTOM_CYCLE_MAX}회)`}
              accessibilityLabel="정산 회차 직접 입력"
              returnKeyType="done"
              errorMessage={cycleError}
            />
          ) : null}
        </View>

        <TextField
          label="수업료 (정산 1회당)"
          value={formatWonInput(fee)}
          onChangeText={changeFee}
          onBlur={() => touch('fee')}
          keyboardType="number-pad"
          placeholder="수업료를 입력해 주세요"
          errorMessage={feeError}
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
                onPress={() => setBankOpen(true)}
                style={[s.select, bankOpen && s.selectOpen]}
              >
                <Text style={[s.selectText, bank && s.selectTextFilled]}>
                  {bank ?? '은행을 선택해주세요'}
                </Text>
                <Image source={arrowDownImage} style={s.arrow} />
              </Pressable>
              {bank === OTHER_BANK ? (
                <TextInput
                  value={otherBankName}
                  onChangeText={setOtherBankName}
                  placeholder="은행 이름을 입력해 주세요"
                  accessibilityLabel="은행 이름"
                  returnKeyType="done"
                  errorMessage={otherBankNameTooLong ? TOO_LONG_MESSAGE : undefined}
                />
              ) : null}
            </View>

            <TextField
              label="계좌번호"
              value={accountNumber}
              onChangeText={(text) => setAccountNumber(text.replace(/[^0-9-]/g, ''))}
              onBlur={() => touch('account')}
              keyboardType="number-pad"
              placeholder="계좌 번호를 입력해 주세요"
              errorMessage={accountError}
            />
            <TextField
              label="예금주"
              value={holder}
              onChangeText={setHolder}
              placeholder="예금주를 입력해 주세요"
              errorMessage={holderTooLong ? TOO_LONG_MESSAGE : undefined}
            />
          </View>
        </View>
      </View>
      <BankSheet
        visible={bankOpen}
        selected={bank}
        onSelect={(next) => {
          setBank(next);
          setBankOpen(false);
        }}
        onClose={() => setBankOpen(false)}
      />
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
});
