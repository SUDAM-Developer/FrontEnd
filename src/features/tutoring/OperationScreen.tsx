import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ListFooter } from '@/components/ListFooter';
import { Chip } from '@/components/Chip';
import { TextInput } from '@/components/TextInput';
import { primitive } from '@/styles/colors';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { TutoringFormLayout } from './TutoringFormLayout';
import { OperationTypeModal } from './OperationTypeModal';
import { useTutoringDraft } from './TutoringDraftProvider';
import {
  initialOperation,
  reportLabels,
  validSettlementCount,
  SETTLEMENT_MIN,
  SETTLEMENT_MAX,
} from './operation';
import type { OperationPreferences, ReportFrequency } from './operation';
const presets = [
  { label: '4회차 선불', count: 4, timing: 'PREPAID' },
  { label: '8회차 선불', count: 8, timing: 'PREPAID' },
  { label: '8회차 후불', count: 8, timing: 'POSTPAID' },
] as const;
export function OperationScreen() {
  const { operation, setOperation } = useTutoringDraft();
  const { profile } = useOnboarding();
  const [draft, setDraft] = useState<OperationPreferences>(operation ?? initialOperation);
  const [custom, setCustom] = useState(
    operation
      ? !presets.some(
          (p) =>
            p.count === operation.settlementSessionCount && p.timing === operation.paymentTiming,
        )
      : false,
  );
  const [count, setCount] = useState(String(draft.settlementSessionCount));
  const [modal, setModal] = useState(false);
  const valid = !custom || validSettlementCount(count);
  const value = {
    ...draft,
    settlementSessionCount: custom ? Number(count) : draft.settlementSessionCount,
  };
  function skip() {
    setOperation(null);
    router.push('/tutoring/student');
  }
  function confirm() {
    if (!valid) return;
    setOperation(value);
    setModal(false);
    router.push('/tutoring/student');
  }
  return (
    <>
      <TutoringFormLayout
        step={1}
        canProceed={valid}
        submitting={false}
        onNext={() => setModal(true)}
        beforeAction={<ListFooter accessibilityLabel="운영 방식 건너뛰기" onPress={skip} />}
      >
        <View style={s.intro}>
          <Text role="heading" style={s.title}>
            운영 방식을 알려 주세요
          </Text>
          <Text style={s.description}>
            답에 맞춰 기본 설정을 채워 둘게요. 나중에 바꿀 수 있어요
          </Text>
        </View>
        <View>
          <Text style={s.label}>학부모님께 근황을 얼마나 자주 보낼까요?</Text>
          <View role="radiogroup" accessibilityLabel="학부모 근황 주기" style={s.choices}>
            {(Object.keys(reportLabels) as ReportFrequency[]).map((frequency) => (
              <Choice
                key={frequency}
                label={frequency === 'SETTLEMENT_ONLY' ? '정산 때만' : reportLabels[frequency]}
                selected={draft.reportFrequency === frequency}
                onPress={() => setDraft({ ...draft, reportFrequency: frequency })}
              />
            ))}
          </View>
        </View>
        <View>
          <Text style={s.label}>정산은 몇 회차마다, 언제 받나요?</Text>
          <View role="radiogroup" accessibilityLabel="정산 조건" style={s.chips}>
            {presets.map((preset) => (
              <Chip
                key={preset.label}
                label={preset.label}
                muted
                role="radio"
                selected={
                  !custom &&
                  draft.settlementSessionCount === preset.count &&
                  draft.paymentTiming === preset.timing
                }
                onPress={() => {
                  setCustom(false);
                  setDraft({
                    ...draft,
                    settlementSessionCount: preset.count,
                    paymentTiming: preset.timing,
                  });
                  setCount(String(preset.count));
                }}
              />
            ))}
            <Chip
              label="직접 정하기"
              muted
              role="radio"
              selected={custom}
              onPress={() => setCustom(true)}
            />
          </View>
          {custom && (
            <View style={s.custom}>
              <TextInput
                accessibilityLabel="직접 정산 회차"
                value={count}
                keyboardType="number-pad"
                placeholder={`${SETTLEMENT_MIN}~${SETTLEMENT_MAX}회`}
                onChangeText={setCount}
                errorMessage={
                  !valid
                    ? `${SETTLEMENT_MIN}~${SETTLEMENT_MAX}회 사이의 정수를 입력해 주세요.`
                    : undefined
                }
              />
              <View role="radiogroup" accessibilityLabel="직접 정산 시점" style={s.chips}>
                {(['PREPAID', 'POSTPAID'] as const).map((timing) => (
                  <Chip
                    key={timing}
                    label={timing === 'PREPAID' ? '선불' : '후불'}
                    muted
                    role="radio"
                    selected={draft.paymentTiming === timing}
                    onPress={() => setDraft({ ...draft, paymentTiming: timing })}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
        <View>
          <Text style={s.label}>학생에게 숙제 알림을 보낼까요?</Text>
          <View role="radiogroup" accessibilityLabel="학생 숙제 알림" style={s.choices}>
            <Choice
              label="보내기"
              selected={draft.homeworkReminder}
              onPress={() => setDraft({ ...draft, homeworkReminder: true })}
            />
            <Choice
              label="안 보내기"
              selected={!draft.homeworkReminder}
              onPress={() => setDraft({ ...draft, homeworkReminder: false })}
            />
          </View>
        </View>
      </TutoringFormLayout>
      {modal && (
        <OperationTypeModal
          value={value}
          teacherName={profile.name}
          onClose={() => setModal(false)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[s.choice, selected && s.choiceSelected]}
    >
      <Text style={[s.choiceText, selected && s.choiceTextSelected]}>{label}</Text>
    </Pressable>
  );
}
const { gray, blue } = primitive;
const s = StyleSheet.create({
  intro: { marginTop: 4, marginBottom: 12 },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: gray[550] },
  description: { fontSize: 12, lineHeight: 18, color: gray[350], marginTop: 4 },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: gray[550],
    marginLeft: 4,
    marginBottom: 8,
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  choice: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: gray[100],
    borderRadius: 8,
    backgroundColor: gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: { borderColor: blue[450], backgroundColor: blue[50] },
  choiceText: { fontSize: 13, lineHeight: 18, color: gray[350] },
  choiceTextSelected: { color: blue[500] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  custom: { marginTop: 12, gap: 8 },
});
