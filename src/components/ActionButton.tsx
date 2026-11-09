import loadingDotsImage from '../../assets/images/loadingbtn.svg';
import loadingDotsBlueImage from '../../assets/images/loadingbtn_blue.svg';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { Image } from 'expo-image';
import { semantic } from '@/styles/colors';
import { padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

// TODO: 피그마에서 아직 확인하지 않은 값입니다. 확인 후 토큰으로 교체해야 합니다.
const unconfirmed = {
  primaryLoadingBackground: semantic.action.pressed,
  secondaryLoadingBackground: semantic.surface.default,
};

export type ActionButtonSize = 'L' | 'M' | 'S';
/** primary: 파란 채움, secondary: 연한 배경 */
export type ActionButtonVariant = 'primary' | 'secondary';

export type ActionButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  /** L: 가로 꽉 참, M: 96, S: 72 */
  size?: ActionButtonSize;
  variant?: ActionButtonVariant;
  /** true면 글씨 대신 로딩 점을 보여 주고 누를 수 없게 합니다. */
  loading?: boolean;
};

const variants = {
  primary: {
    background: semantic.action.default,
    pressedBackground: semantic.action.pressed,
    loadingBackground: unconfirmed.primaryLoadingBackground,
    disabledBackground: semantic.action.disabled,
    text: semantic.text.default.inverse,
    disabledText: semantic.text.default.weak,
    dots: loadingDotsImage,
  },
  secondary: {
    background: semantic.surface.default,
    pressedBackground: semantic.surface.default,
    loadingBackground: unconfirmed.secondaryLoadingBackground,
    disabledBackground: semantic.surface.disabled,
    text: semantic.text.brand.assistive,
    disabledText: semantic.text.default.weak,
    dots: loadingDotsBlueImage,
  },
};

export function ActionButton({
  label,
  size = 'L',
  variant = 'primary',
  disabled,
  loading = false,
  ...props
}: ActionButtonProps) {
  const v = variants[variant];
  const background = (pressed: boolean) => {
    if (disabled) return v.disabledBackground;
    if (loading) return v.loadingBackground;
    return pressed ? v.pressedBackground : v.background;
  };

  return (
    <Pressable
      {...props}
      role="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      style={({ pressed }) => [s.base, sizes[size], { backgroundColor: background(pressed) }]}
    >
      {loading ? (
        <Image source={v.dots} style={s.dots} loading="eager" />
      ) : (
        <Text style={[s.label, labels[size], { color: disabled ? v.disabledText : v.text }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
  },
  label: { fontWeight: fontWeight.semiBold, textAlign: 'center' },
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
