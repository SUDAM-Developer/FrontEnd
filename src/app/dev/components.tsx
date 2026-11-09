import { useState } from 'react';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ProgressBar } from '@/components/ProgressBar';
import { TextInput } from '@/components/TextInput';
import { semantic } from '@/styles/colors';
import { gap, grid } from '@/styles/measurement';
import { typography } from '@/styles/typography';

// 개발 중에만 여는 공통 컴포넌트 확인 화면입니다.
export default function ComponentsPreview() {
  const [empty, setEmpty] = useState('');
  const [filled, setFilled] = useState('값');
  const [error, setError] = useState('값');

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Text style={s.title}>TextInput</Text>
      <TextInput
        value={empty}
        onChangeText={setEmpty}
        placeholder="텍스트를 입력해주세요"
        helperText="인풋을 보조하는 헬퍼텍스트"
      />
      <TextInput
        value={filled}
        onChangeText={setFilled}
        placeholder="텍스트를 입력해주세요"
        helperText="인풋을 보조하는 헬퍼텍스트"
      />
      <TextInput
        value={error}
        onChangeText={setError}
        placeholder="텍스트를 입력해주세요"
        errorMessage="에러메세지"
      />

      <Text style={s.title}>Progress Bar</Text>
      <ProgressBar step={1} total={2} showLabel={false} />
      {[1, 2, 3, 4, 5].map((step) => (
        <ProgressBar key={step} step={step} total={5} />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: semantic.surface.input },
  content: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    padding: grid.margin,
    gap: gap[16],
  },
  title: { ...typography.heading[1].bold, color: semantic.text.default.strong },
});
