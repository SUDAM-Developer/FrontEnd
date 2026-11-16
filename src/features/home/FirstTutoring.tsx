import { Pressable, StyleSheet, Text, View } from 'react-native';
import { primitive } from '@/styles/colors';
export const preparationSteps = [
  { id: 'introduction', title: '소개서 만들기', description: '무료 진단과 미리보기부터' },
  { id: 'student', title: '학생 정보 넣기', description: '학생을 찾으며 상담에서 들은 내용으로' },
  { id: 'curriculum', title: '커리큘럼 받기', description: '교재, 수업 횟수, 기간별 진도' },
  { id: 'tutoring', title: '과외 만들기', description: '운영 방식·유형 확인, 학부모님 초대' },
] as const;
export type PreparationStep = (typeof preparationSteps)[number]['id'];
export function FirstTutoring({
  onStep,
  completed = [],
}: {
  onStep: (step: PreparationStep) => void;
  completed?: PreparationStep[];
}) {
  return (
    <View style={s.root}>
      <Text role="heading" style={s.title}>
        첫 과외 준비를 함께 시작해요
      </Text>
      <Text style={s.description}>네 단계를 마치고 과외를 만들면 기록 · 일정 · 정산이 열려요</Text>
      <Text style={s.progress}>
        첫 과외 준비 <Text style={s.count}>{completed.length}</Text>/4
      </Text>
      <View style={s.list}>
        {preparationSteps.map((step, index) => (
          <Pressable
            key={step.id}
            role="button"
            accessibilityLabel={`${index + 1}. ${step.title}`}
            onPress={() => onStep(step.id)}
            style={[s.row, index > 0 && s.border]}
          >
            <View style={s.number}>
              <Text style={s.numberText}>{completed.includes(step.id) ? '✓' : index + 1}</Text>
            </View>
            <View style={s.copy}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDescription}>{step.description}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        role="button"
        accessibilityLabel="이미 학생이 있어요 · 바로 과외 만들기"
        onPress={() => onStep('tutoring')}
        style={s.shortcut}
      >
        <Text style={s.link}>이미 학생이 있어요 · 바로 과외 만들기</Text>
      </Pressable>
    </View>
  );
}
const { gray, blue } = primitive;
const s = StyleSheet.create({
  root: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '700', color: gray[650] },
  description: { fontSize: 12, lineHeight: 18, color: gray[350], marginTop: 8 },
  progress: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: gray[650],
    marginTop: 30,
    marginBottom: 8,
  },
  count: { color: blue[500] },
  list: { backgroundColor: gray[0], borderRadius: 8, overflow: 'hidden' },
  row: {
    minHeight: 73,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  border: { borderTopWidth: 1, borderTopColor: gray[100] },
  number: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: blue[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontSize: 12, color: blue[500] },
  copy: { flex: 1 },
  stepTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700', color: gray[650] },
  stepDescription: { fontSize: 12, lineHeight: 18, color: gray[550], marginTop: 4 },
  chevron: { fontSize: 28, color: gray[500] },
  shortcut: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  link: { fontSize: 12, lineHeight: 18, color: gray[350], textDecorationLine: 'underline' },
});
