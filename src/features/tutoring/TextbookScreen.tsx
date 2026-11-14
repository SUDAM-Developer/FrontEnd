import { useState } from 'react';
import { router } from 'expo-router';
import { ChipSelectField, TOO_LONG_MESSAGE, TextField, isTooLong } from './FormFields';
import { TutoringFormLayout } from './TutoringFormLayout';
import type { PrefillSource } from './TutoringFormLayout';

const PROGRESS_UNITS = ['Unit', '단원', 'Chapter', 'Page', '회', '기타'] as const;

type ProgressUnit = (typeof PROGRESS_UNITS)[number];

// 학생 이름과 같은 기준입니다.
const TITLE_MAX_LENGTH = 10;

export type TextbookScreenProps = {
  /** 없으면 안내 메시지를 보여 주지 않습니다. */
  prefillSource?: PrefillSource;
};

/** T-05 과외 만들기 · 교재 (3/5 단계) */
export function TextbookScreen({ prefillSource }: TextbookScreenProps) {
  // TODO: 디자인 라벨은 "학생당 1~5권"이지만, 여러 권을 추가하는 화면이 아직 없어 한 권만 받습니다.
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState<ProgressUnit | null>(null);
  const [otherUnit, setOtherUnit] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');

  const titleTooLong = isTooLong(title, TITLE_MAX_LENGTH);
  const canProceed =
    title.trim().length > 0 &&
    !titleTooLong &&
    unit !== null &&
    (unit !== '기타' || otherUnit.trim().length > 0) &&
    currentProgress.trim().length > 0;

  // TODO: 입력한 교재 정보를 다음 단계로 넘기거나 저장합니다.
  const handleNext = () => {
    router.push({
      pathname: '/tutoring/settlement',
      params: prefillSource ? { source: prefillSource } : {},
    });
  };

  return (
    <TutoringFormLayout
      step={3}
      prefillSource={prefillSource}
      canProceed={canProceed}
      submitting={false}
      onNext={handleNext}
    >
      <TextField
        label="교재 (학생당 1~5권)"
        value={title}
        onChangeText={setTitle}
        errorMessage={titleTooLong ? TOO_LONG_MESSAGE : undefined}
        placeholder="교재 이름을 입력해 주세요"
      />
      <ChipSelectField
        label="진도 단위"
        single
        options={PROGRESS_UNITS}
        isSelected={(u) => unit === u}
        onPress={setUnit}
        other={{ visible: unit === '기타', value: otherUnit, onChangeText: setOtherUnit }}
      />
      <TextField
        label="지금 진도"
        required={false}
        value={currentProgress}
        onChangeText={setCurrentProgress}
        keyboardType="default"
        placeholder="지금 진도"
        helperText="교재 내용은 저장하지 않고, 이름과 진도 단위만 써요."
      />
    </TutoringFormLayout>
  );
}
