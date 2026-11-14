import { useState } from 'react';
import { router } from 'expo-router';
import { ChipSelectField, TOO_LONG_MESSAGE, TextField, isTooLong } from './FormFields';
import { TutoringFormLayout, useSubmit } from './TutoringFormLayout';
import type { PrefillSource } from './TutoringFormLayout';

const GRADES = ['초6', '중1', '중2', '중3', '고1', '고2', '고3', '기타'] as const;
const SUBJECTS = ['국어', '영어', '수학', '과학', '사회', '기타'] as const;

type Grade = (typeof GRADES)[number];
type Subject = (typeof SUBJECTS)[number];

// 프로필 이름과 같은 기준입니다.
const NAME_MAX_LENGTH = 10;

export type StudentInfoScreenProps = {
  /** 없으면 안내 메시지를 보여 주지 않습니다. */
  prefillSource?: PrefillSource;
};

/** T-05 과외 만들기 · 학생 정보 (2/5 단계) */
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

  const otherSubjectSelected = subjects.includes('기타');
  const nameTooLong = isTooLong(name, NAME_MAX_LENGTH);
  const canProceed =
    name.trim().length > 0 &&
    !nameTooLong &&
    grade !== null &&
    (grade !== '기타' || otherGrade.trim().length > 0) &&
    subjects.length > 0 &&
    (!otherSubjectSelected || otherSubject.trim().length > 0);

  // TODO: 입력한 학생 정보를 다음 단계로 넘기거나 저장합니다.
  const { submitting, submit } = useSubmit(() =>
    router.push({
      pathname: '/tutoring/textbook',
      params: prefillSource ? { source: prefillSource } : {},
    }),
  );

  return (
    <TutoringFormLayout
      step={2}
      prefillSource={prefillSource}
      canProceed={canProceed}
      submitting={submitting}
      onNext={submit}
    >
      <TextField
        label="학생 이름"
        value={name}
        onChangeText={setName}
        errorMessage={nameTooLong ? TOO_LONG_MESSAGE : undefined}
        placeholder="학생 이름을 입력해 주세요"
      />
      <ChipSelectField
        label="학생 학년"
        single
        options={GRADES}
        isSelected={(g) => grade === g}
        onPress={setGrade}
        other={{ visible: grade === '기타', value: otherGrade, onChangeText: setOtherGrade }}
      />
      <ChipSelectField
        label="과목"
        hint="(복수 선택 가능)"
        options={SUBJECTS}
        isSelected={(subject) => subjects.includes(subject)}
        onPress={toggleSubject}
        other={{
          visible: otherSubjectSelected,
          value: otherSubject,
          onChangeText: setOtherSubject,
        }}
      />
    </TutoringFormLayout>
  );
}
