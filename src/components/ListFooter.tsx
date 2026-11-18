import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';

type Props = Omit<PressableProps, 'children'> & { label?: string };

/** 목록 또는 폼 아래에 표시하는 보조 동작. 시안의 텍스트 영역은 24px입니다. */
export function ListFooter({ label = '건너뛰기', style, disabled, ...props }: Props) {
  return (
    <Pressable
      {...props}
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={(state) => [
        s.button,
        (disabled || state.pressed) && s.dimmed,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: { alignSelf: 'stretch', minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, lineHeight: 24, color: '#848A91', textDecorationLine: 'underline' },
  dimmed: { opacity: 0.4 },
});
