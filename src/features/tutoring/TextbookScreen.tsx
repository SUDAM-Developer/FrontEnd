import { useState } from 'react';
import { ChipSelectField, TextField } from './FormFields';
import { TutoringFormLayout, useSubmit } from './TutoringFormLayout';
import type { PrefillSource } from './TutoringFormLayout';

const PROGRESS_UNITS = ['Unit', '단원', 'Chapter', 'Page', '회', '기타'] as const;

type ProgressUnit = (typeof PROGRESS_UNITS)[number];

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

  const canProceed =
    title.trim().length > 0 && unit !== null && (unit !== '기타' || otherUnit.trim().length > 0);

  // TODO: 4단계 화면이 생기면 이동합니다.
  const { submitting, submit } = useSubmit(() => {});

  return (
    <TutoringFormLayout
      step={3}
      prefillSource={prefillSource}
      canProceed={canProceed}
      submitting={submitting}
      onNext={submit}
    >
      <TextField
        label="교재 (학생당 1~5권)"
        value={title}
        onChangeText={setTitle}
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
        onChangeText={(text) => setCurrentProgress(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholder="숫자로 입력해 주세요"
        helperText="교재 내용은 저장하지 않고, 이름과 진도 단위만 써요."
      />
    </TutoringFormLayout>
  );
}
