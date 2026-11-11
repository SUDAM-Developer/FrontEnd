import searchIcon from '../../assets/images/search.svg';
import clearIcon from '../../assets/images/clear.svg';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { Image } from 'expo-image';
import { semantic } from '@/styles/colors';
import { lineWeight, unit } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

const colors = {
  border: semantic.border.default,
  focusedBorder: semantic.border.focused,
  text: semantic.text.default.normal,
  placeholder: semantic.text.default.weak,
};

// TODO: 피그마에서 아직 확인하지 않은 값입니다. 확인 후 토큰으로 교체해야 합니다.
const unconfirmed = {
  /** 아이콘을 담는 칸 크기. 이미지에서 아이콘 양옆 여백을 보고 맞춘 값입니다. */
  iconBox: 24,
};

export type SearchBarProps = Omit<RNTextInputProps, 'style' | 'placeholderTextColor'>;

/**
 * 밑줄만 있는 검색 입력창.
 * 비어 있으면 왼쪽에 돋보기, 글자가 있으면 오른쪽에 지우기 버튼을 보여 줍니다.
 */
export function SearchBar({
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const text = value ?? innerValue;
  const hasText = text.length > 0;

  const changeText = (next: string) => {
    if (value === undefined) setInnerValue(next);
    onChangeText?.(next);
  };

  return (
    <View style={[s.root, { borderBottomColor: focused ? colors.focusedBorder : colors.border }]}>
      {hasText ? null : (
        <View style={s.iconBox}>
          <Image source={searchIcon} style={s.searchIcon} loading="eager" />
        </View>
      )}
      <RNTextInput
        {...props}
        value={text}
        onChangeText={changeText}
        role="searchbox"
        placeholderTextColor={colors.placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={s.input}
      />
      {hasText ? (
        <Pressable
          role="button"
          accessibilityLabel="검색어 지우기"
          onPress={() => changeText('')}
          style={s.iconBox}
        >
          <Image source={clearIcon} style={s.clearIcon} loading="eager" />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    width: '100%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: unit[0],
    borderBottomWidth: lineWeight.regular,
  },
  iconBox: {
    width: unconfirmed.iconBox,
    height: unconfirmed.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { width: 13, height: 13 },
  clearIcon: { width: 12, height: 12 },
  input: {
    flex: 1,
    fontSize: fontSize[14],
    lineHeight: lineHeight[13],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.none,
    color: colors.text,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
});
