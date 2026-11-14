import arrowBackImage from '../../../assets/images/arrow_back.svg';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { Chip } from '@/components/Chip';
import { ProgressBar } from '@/components/ProgressBar';
import { TextInput } from '@/components/TextInput';
import { semantic } from '@/styles/colors';
import { gap, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';

const GRADES = ['초6', '중1', '중2', '중3', '고1', '고2', '고3', '기타'] as const;
const SUBJECTS = ['국어', '영어', '수학', '과학', '사회', '기타'] as const;

type Grade = (typeof GRADES)[number];
type Subject = (typeof SUBJECTS)[number];

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
export function StudentInfoScreen() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const toggleSubject = (subject: Subject) =>
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((v) => v !== subject) : [...prev, subject],
    );

  const canProceed = name.trim().length > 0 && grade !== null && subjects.length > 0;

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
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

        <View style={s.inlineMessage}>
          <Text style={s.inlineMessageText}>지난 과외 계좌를 불러왔어요.</Text>
        </View>

        <View style={s.form}>
          <View style={s.nameField}>
            <View style={s.nameLabel}>
              <FieldLabel label="학생 이름" />
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
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
          </View>
        </View>
      </ScrollView>

      <View style={s.cta}>
        <ActionButton label="다음" disabled={!canProceed} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: semantic.surface.input },
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
  cta: {
    paddingHorizontal: padding[24],
    paddingTop: padding[20],
    paddingBottom: padding[20],
    backgroundColor: semantic.surface.input,
  },
});
