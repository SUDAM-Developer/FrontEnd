import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { semantic } from '@/styles/colors';
import { typography } from '@/styles/typography';

type Props = { title: string; previousProgress?: string; children: ReactNode };

/** 진도 선택과 직접 입력 상태에서 함께 사용하는 교재 카드입니다. */
export function TextbookProgressCard({ title, previousProgress, children }: Props) {
  return (
    <View style={s.card}>
      <View style={s.heading}>
        <Text style={s.title}>{title}</Text>
        {previousProgress ? <Text style={s.previous}>지난 {previousProgress}</Text> : null}
      </View>
      {children}
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    backgroundColor: semantic.surface.subtle,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  heading: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  title: { ...typography.body[4].semiBold, color: semantic.text.default.neutral, flexShrink: 1 },
  previous: { ...typography.body[4].regular, color: semantic.text.default.weak },
});
