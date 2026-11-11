import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { semantic } from '@/styles/colors';
import { lineWeight, padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

const colors = {
  background: semantic.surface.input,
  border: semantic.border.default,
  text: semantic.text.default.weak,
  selectedBackground: semantic.surface.focused,
  selectedBorder: semantic.border.focused,
  selectedText: semantic.text.brand.assistive,
};

export type SelectButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  selected?: boolean;
};

/** 눌러서 선택/해제하는 버튼 (예: 학생 당일 취소) */
export function SelectButton({ label, selected = false, ...props }: SelectButtonProps) {
  return (
    <Pressable
      {...props}
      role="checkbox"
      aria-checked={selected}
      accessibilityLabel={label}
      style={[
        s.base,
        {
          backgroundColor: selected ? colors.selectedBackground : colors.background,
          borderColor: selected ? colors.selectedBorder : colors.border,
        },
      ]}
    >
      <Text style={[s.label, { color: selected ? colors.selectedText : colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    // 피그마 너비 135. 글자가 길면 줄바꿈 대신 버튼이 넓어집니다.
    minWidth: 135,
    alignSelf: 'flex-start',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding[12],
    paddingHorizontal: padding[24],
    borderRadius: radius.medium,
    borderWidth: lineWeight.regular,
  },
  label: {
    fontSize: fontSize[15],
    lineHeight: lineHeight[14],
    fontWeight: fontWeight.semiBold,
    letterSpacing: letterSpacing.none,
    textAlign: 'center',
  },
});
