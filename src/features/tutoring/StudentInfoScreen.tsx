import arrowBackImage from '../../../assets/images/arrow_back.svg';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { Chip } from '@/components/Chip';
import { Loading } from '@/components/Loading';
import { ProgressBar } from '@/components/ProgressBar';
import { TextInput } from '@/components/TextInput';
import { semantic } from '@/styles/colors';
import { gap, padding, radius, unit } from '@/styles/measurement';
import { typography } from '@/styles/typography';

const GRADES = ['초6', '중1', '중2', '중3', '고1', '고2', '고3', '기타'] as const;
const SUBJECTS = ['국어', '영어', '수학', '과학', '사회', '기타'] as const;

type Grade = (typeof GRADES)[number];
type Subject = (typeof SUBJECTS)[number];

// TODO: 저장 API가 생기면 실제 요청으로 바꿉니다. 지금은 로딩 화면만 보여 줍니다.
const SUBMIT_PREVIEW_MS = 1500;

/** 앞 단계에서 미리 채워 둔 정보의 출처. 출처에 따라 안내 문구가 달라집니다. */
export type PrefillSource = 'lastTutoring' | 'curriculum';

const PREFILL_NOTICE: Record<PrefillSource, string> = {
  lastTutoring: '지난 과외 계좌를 불러왔어요.',
  curriculum: '커리큘럼에서 학생 정보, 교재, 요일을 채워두었어요',
};

// 프로필 이름과 같은 기준입니다. 넘치면 입력은 막지 않고 오류 문구를 보여 줍니다.
const NAME_MAX_LENGTH = 10;

const STEP = 2;
const TOTAL_STEPS = 5;

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <Text style={s.fieldLabel}>
      {label}
      <Text style={s.required}>*</Text>
      {hint ? ` ${hint}` : null}
    </Text>
  );
}

/** T-05 과외 만들기 · 학생 정보 (2/5 단계) */
export type StudentInfoScreenProps = {
  /** 없으면 안내 메시지를 보여 주지 않습니다. */
  prefillSource?: PrefillSource;
};

export function StudentInfoScreen({ prefillSource }: StudentInfoScreenProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [otherGrade, setOtherGrade] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [otherSubject, setOtherSubject] = useState('');

  const toggleSubject = (subject: Subject) =>
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((v) => v !== subject) : [...prev, subject],
    );

  const otherSelected = subjects.includes('기타');
  const nameTooLong = name.trim().length > NAME_MAX_LENGTH;
  const canProceed =
    name.trim().length > 0 &&
    !nameTooLong &&
    grade !== null &&
    (grade !== '기타' || otherGrade.trim().length > 0) &&
    subjects.length > 0 &&
    (!otherSelected || otherSubject.trim().length > 0);

  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!canProceed || submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_PREVIEW_MS));
      // TODO: 3단계 화면이 생기면 이동합니다.
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
      <View style={s.phone}>
        <View style={s.navBar}>
          <Pressable role="button" accessibilityLabel="뒤로 가기" onPress={back} hitSlop={8}>
            <Image source={arrowBackImage} style={s.icon} />
          </Pressable>
          <Text role="heading" style={s.title}>
            과외 만들기
          </Text>
          <View style={s.icon} />
        </View>

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <ProgressBar step={STEP} total={TOTAL_STEPS} stretch />

          {prefillSource ? (
            <View style={s.inlineMessage}>
              <Text style={s.inlineMessageText}>{PREFILL_NOTICE[prefillSource]}</Text>
            </View>
          ) : null}

          <View style={s.form}>
            <View style={s.nameField}>
              <View style={s.nameLabel}>
                <FieldLabel label="학생 이름" />
              </View>
              <TextInput
                value={name}
                onChangeText={setName}
                errorMessage={nameTooLong ? '글자 수가 초과되었어요' : undefined}
                placeholder="학생 이름을 입력해 주세요"
                accessibilityLabel="학생 이름"
                returnKeyType="done"
              />
            </View>

            <View style={s.selectField}>
              <View style={s.selectLabel}>
                <FieldLabel label="학생 학년" />
              </View>
              <View role="radiogroup" accessibilityLabel="학생 학년" style={s.chips}>
                {GRADES.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    muted
                    role="radio"
                    selected={grade === g}
                    onPress={() => setGrade(g)}
                  />
                ))}
              </View>
              {grade === '기타' ? (
                <View style={s.otherInput}>
                  <TextInput
                    value={otherGrade}
                    onChangeText={setOtherGrade}
                    placeholder="텍스트를 입력해주세요"
                    accessibilityLabel="기타 학년"
                    returnKeyType="done"
                  />
                </View>
              ) : null}
            </View>

            <View style={s.selectField}>
              <View style={s.selectLabel}>
                <FieldLabel label="과목" hint="(복수 선택 가능)" />
              </View>
              <View role="group" accessibilityLabel="과목" style={s.chips}>
                {SUBJECTS.map((subject) => (
                  <Chip
                    key={subject}
                    label={subject}
                    muted
                    selected={subjects.includes(subject)}
                    onPress={() => toggleSubject(subject)}
                  />
                ))}
              </View>
              {otherSelected ? (
                <View style={s.otherInput}>
                  <TextInput
                    value={otherSubject}
                    onChangeText={setOtherSubject}
                    placeholder="텍스트를 입력해주세요"
                    accessibilityLabel="기타 과목"
                    returnKeyType="done"
                  />
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={s.cta}>
          <ActionButton label="다음" disabled={!canProceed} loading={submitting} onPress={submit} />
        </View>
      </View>
      <Loading visible={submitting} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', backgroundColor: semantic.surface.input },
  // 웹에서는 휴대폰 너비(390)로 가운데 정렬하고, 상태바 높이만큼 위를 띄웁니다.
  phone: { flex: 1, width: '100%', maxWidth: 390, paddingTop: Platform.OS === 'web' ? 44 : 0 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding[24],
    paddingVertical: padding[12],
  },
  icon: { width: 24, height: 24 },
  title: {
    ...typography.body[1].bold,
    textAlign: 'center',
    color: semantic.text.default.strong,
  },
  content: {
    paddingHorizontal: padding[24],
    gap: gap[8],
  },
  inlineMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap[4],
    paddingHorizontal: padding[12],
    paddingVertical: padding[8],
    borderRadius: radius.small,
    backgroundColor: semantic.surface.focused,
  },
  inlineMessageText: {
    ...typography.caption[1].medium,
    color: semantic.text.brand.assistive,
  },
  form: { paddingVertical: padding[12], gap: gap[20] },
  nameField: { gap: gap[8] },
  nameLabel: { paddingHorizontal: padding[8] },
  selectField: { paddingVertical: padding[8], gap: gap[8] },
  selectLabel: { paddingHorizontal: gap[4] },
  fieldLabel: {
    ...typography.body[5].semiBold,
    color: semantic.text.default.neutral,
  },
  required: { color: semantic.text.brand.assistive },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: gap[8] },
  // 디자인에서 칩 묶음과 입력칸 사이가 10px입니다 (gap 8 + 2).
  otherInput: { marginTop: unit[2] },
  cta: {
    paddingHorizontal: padding[24],
    paddingTop: padding[20],
    paddingBottom: padding[20],
    backgroundColor: semantic.surface.input,
  },
});
