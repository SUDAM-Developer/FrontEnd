import loadingDotsImage from '../../assets/images/loadingbtn.svg';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { Image } from 'expo-image';
import { semantic } from '@/styles/colors';
import { padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

// TODO: 피그마에서 아직 확인하지 않은 값입니다. 확인 후 토큰으로 교체해야 합니다.
const unconfirmed = {
  loadingBackground: semantic.action.pressed,
};

export type ActionButtonSize = 'L' | 'M' | 'S';

export type ActionButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  /** L: 가로 꽉 참, M: 96, S: 72 */
  size?: ActionButtonSize;
  /** true면 글씨 대신 로딩 점을 보여 주고 누를 수 없게 합니다. */
  loading?: boolean;
};

export function ActionButton({
  label,
  size = 'L',
  disabled,
  loading = false,
  ...props
}: ActionButtonProps) {
  return (
    <Pressable
      {...props}
      role="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      style={({ pressed }) => [
        s.base,
        sizes[size],
        pressed && s.pressed,
        loading && s.loading,
        disabled && s.disabled,
      ]}
    >
      {loading ? (
        <Image source={loadingDotsImage} style={s.dots} loading="eager" />
      ) : (
        <Text style={[s.label, labels[size], disabled && s.labelDisabled]}>{label}</Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: semantic.action.default,
  },
  pressed: { backgroundColor: semantic.action.pressed },
  loading: { backgroundColor: unconfirmed.loadingBackground },
  disabled: { backgroundColor: semantic.action.disabled },
  label: {
    fontWeight: fontWeight.semiBold,
    textAlign: 'center',
    color: semantic.text.default.inverse,
  },
  labelDisabled: { color: semantic.text.default.weak },
  dots: { width: 23, height: 6 },
});

const sizes = StyleSheet.create({
  L: { width: '100%', height: 56, paddingVertical: padding[16] },
  M: { width: 96, height: 42, padding: padding[12] },
  S: { width: 72, height: 34, paddingVertical: padding[8], paddingHorizontal: padding[12] },
});

const labels = StyleSheet.create({
  L: {
    fontSize: fontSize[18],
    lineHeight: lineHeight[16],
    letterSpacing: letterSpacing.normal,
  },
  M: {
    fontSize: fontSize[14],
    lineHeight: lineHeight[13],
    letterSpacing: letterSpacing.none,
  },
  S: {
    fontSize: fontSize[13],
    lineHeight: lineHeight[13],
    letterSpacing: letterSpacing.none,
  },
});
