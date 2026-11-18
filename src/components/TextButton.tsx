import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  size?: 'small' | 'medium';
};

/** SVG의 예시 문구 대신 실제 동작에 맞는 문구를 표시합니다. */
export function TextButton({ label, size = 'medium', style, disabled, ...props }: Props) {
  return (
    <Pressable
      {...props}
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={(state) => [
        s.button,
        { minWidth: size === 'small' ? 46 : 48 },
        (disabled || state.pressed) && s.dimmed,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text style={[s.label, { fontSize: size === 'small' ? 14 : 15 }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: { minHeight: 44, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  label: { lineHeight: 24, fontWeight: '600', color: '#219BFF' },
  dimmed: { opacity: 0.4 },
});
