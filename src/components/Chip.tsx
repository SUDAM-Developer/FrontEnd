import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { semantic } from '@/styles/colors';
import { lineWeight, padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

const colors = {
  background: semantic.surface.default,
  border: semantic.border.default,
  text: semantic.text.default.normal,
  selectedBackground: semantic.action.default,
  selectedBorder: semantic.border.focused,
  selectedText: semantic.text.default.inverse,
};

export type ChipProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  selected?: boolean;
};

/** 둥근 선택 칩. 너비는 글자 길이에 맞춰집니다. */
export function Chip({ label, selected = false, ...props }: ChipProps) {
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
    alignSelf: 'flex-start',
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding[8],
    paddingHorizontal: padding[12],
    borderRadius: radius.full,
    borderWidth: lineWeight.regular,
  },
  label: {
    fontSize: fontSize[14],
    lineHeight: lineHeight[13],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.none,
    textAlign: 'center',
  },
});
