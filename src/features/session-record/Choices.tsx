import { Pressable, Text, View } from 'react-native';
import { s } from './styles';
type Props<T extends string> = {
  label: string;
  options: readonly T[];
  value: T | null;
  disabled?: boolean;
  onChange: (value: T) => void;
};
/** 세 칸/두 칸 균등 폭 선택. 고정 최소 너비인 공통 SelectButton과 달리 좁은 화면에서도 줄 안에 맞춥니다. */
export function Choices<T extends string>({ label, options, value, disabled, onChange }: Props<T>) {
  return (
    <View role="radiogroup" accessibilityLabel={label} style={s.row}>
      {options.map((option) => (
        <Pressable
          key={option}
          role="radio"
          aria-checked={value === option}
          accessibilityLabel={option}
          disabled={disabled}
          accessibilityState={{ disabled, checked: value === option }}
          onPress={() => onChange(option)}
          style={[s.choice, value === option && s.selectedChoice]}
        >
          <Text style={[s.choiceText, value === option && s.selectedText]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}
