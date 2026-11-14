import { StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { TextInput } from '@/components/TextInput';
import type { TextInputProps } from '@/components/TextInput';
import { semantic } from '@/styles/colors';
import { gap, padding, unit } from '@/styles/measurement';
import { typography } from '@/styles/typography';

export const TOO_LONG_MESSAGE = '글자 수가 초과되었어요';

/** 앞뒤 공백을 뺀 글자 수가 max를 넘는지 봅니다. 넘어도 입력은 막지 않고 오류 문구만 보여 줍니다. */
export const isTooLong = (value: string, max: number) => value.trim().length > max;

type FieldLabelProps = {
  label: string;
  /** 별표(*) 뒤에 붙는 설명. 예: (복수 선택 가능) */
  hint?: string;
  required?: boolean;
};

function FieldLabel({ label, hint, required = true }: FieldLabelProps) {
  return (
    <Text style={s.label}>
      {label}
      {required ? <Text style={s.required}>*</Text> : null}
      {hint ? ` ${hint}` : null}
    </Text>
  );
}

export type TextFieldProps = Omit<TextInputProps, 'accessibilityLabel'> & FieldLabelProps;

/** 위에 라벨이 붙은 입력칸 */
export function TextField({ label, hint, required, ...inputProps }: TextFieldProps) {
  return (
    <View style={s.textField}>
      <View style={s.textLabel}>
        <FieldLabel label={label} hint={hint} required={required} />
      </View>
      <TextInput accessibilityLabel={label} returnKeyType="done" {...inputProps} />
    </View>
  );
}

type ChipSelectFieldProps<T extends string> = FieldLabelProps & {
  options: readonly T[];
  isSelected: (option: T) => boolean;
  onPress: (option: T) => void;
  /** true면 하나만 고르는 라디오, false면 여러 개 고르는 체크박스로 읽힙니다. */
  single?: boolean;
  /** '기타'를 골랐을 때 칩 아래에 보여 줄 입력칸 */
  other?: { visible: boolean; value: string; onChangeText: (text: string) => void };
};

/** 라벨 + 칩 묶음. '기타'를 고르면 아래에 직접 입력칸이 나타납니다. */
export function ChipSelectField<T extends string>({
  label,
  hint,
  required,
  options,
  isSelected,
  onPress,
  single = false,
  other,
}: ChipSelectFieldProps<T>) {
  return (
    <View style={s.selectField}>
      <View style={s.selectLabel}>
        <FieldLabel label={label} hint={hint} required={required} />
      </View>
      <View role={single ? 'radiogroup' : 'group'} accessibilityLabel={label} style={s.chips}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            muted
            role={single ? 'radio' : 'checkbox'}
            selected={isSelected(option)}
            onPress={() => onPress(option)}
          />
        ))}
      </View>
      {other?.visible ? (
        <View style={s.otherInput}>
          <TextInput
            value={other.value}
            onChangeText={other.onChangeText}
            placeholder="텍스트를 입력해주세요"
            accessibilityLabel={`기타 ${label}`}
            returnKeyType="done"
          />
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  label: {
    ...typography.body[5].semiBold,
    color: semantic.text.default.neutral,
  },
  required: { color: semantic.text.brand.assistive },
  textField: { gap: gap[8] },
  textLabel: { paddingHorizontal: padding[8] },
  selectField: { paddingVertical: padding[8], gap: gap[8] },
  selectLabel: { paddingHorizontal: gap[4] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: gap[8] },
  // 디자인에서 칩 묶음과 입력칸 사이가 10px입니다 (gap 8 + 2).
  otherInput: { marginTop: unit[2] },
});
