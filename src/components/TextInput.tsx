import { useState } from 'react';
import type { ReactNode } from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { semantic } from '@/styles/colors';
import { gap, lineWeight, padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

export type TextInputProps = Omit<RNTextInputProps, 'style' | 'placeholderTextColor'> & {
  /** 입력 아래에 표시하는 보조 문구 */
  helperText?: string;
  /** 값이 있으면 오류 상태로 표시하고 helperText 대신 보여 줍니다. */
  errorMessage?: string;
  /** 입력 오른쪽에 붙는 요소 (타이머, 지우기 버튼 등) */
  trailing?: ReactNode;
};

export function TextInput({
  helperText,
  errorMessage,
  trailing,
  value,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const error = Boolean(errorMessage);
  const filled = Boolean(value);
  const message = errorMessage ?? helperText;

  return (
    <View style={s.root}>
      <View
        style={[
          s.box,
          filled && !focused && s.boxFilled,
          focused && s.boxFocused,
          error && s.boxError,
        ]}
      >
        <RNTextInput
          {...props}
          value={value}
          aria-invalid={error}
          placeholderTextColor={semantic.text.default.weak}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[s.input, error && s.inputError]}
        />
        {trailing}
      </View>
      {message ? <Text style={[s.message, error && s.messageError]}>{message}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { width: '100%', gap: gap[4] },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: padding[16],
    paddingHorizontal: padding[12],
    borderRadius: radius.small,
    borderWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    backgroundColor: semantic.surface.input,
  },
  boxFilled: { backgroundColor: semantic.surface.subtle },
  boxFocused: { borderColor: semantic.border.focused },
  boxError: { borderColor: semantic.border.warning, backgroundColor: semantic.surface.input },
  input: {
    flex: 1,
    padding: 0,
    fontSize: fontSize[13],
    lineHeight: lineHeight[13],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.none,
    color: semantic.text.default.normal,
    // 웹 기본 포커스 테두리를 숨기고 상자 테두리로 포커스를 표시합니다.
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  inputError: { color: semantic.text.feedback.warning },
  message: {
    fontSize: fontSize[12],
    lineHeight: lineHeight[12],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.none,
    color: semantic.text.default.weak,
  },
  messageError: { color: semantic.text.feedback.warning },
});
