import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
import { s } from './styles';
import type { CancellationResult } from './types';
import logo from '../../../assets/images/session-logo.svg';
import success from '../../../assets/images/session-success.svg';
type Props = {
  result: CancellationResult;
  teacherLabel: string;
  onHome: () => void;
  onCoordinate: () => void;
};
export function CancellationComplete({ result, teacherLabel, onHome, onCoordinate }: Props) {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.phone}>
        <ScrollView contentContainerStyle={v.content}>
          <View style={v.brandRow}>
            <Image source={logo} style={v.logo} accessibilityLabel="SUDAM" />
            <View style={v.teacher}>
              <Text style={v.teacherText}>{teacherLabel}</Text>
            </View>
          </View>
          <View style={v.hero}>
            <Image source={success} style={v.success} accessibilityLabel="휴강 기록 완료" />
            <Text role="heading" style={v.title}>
              휴강을 기록했어요
            </Text>
            <Text style={v.reason}>{result.reason}</Text>
            <Text style={v.subtitle}>
              {result.counted ? '회차로 인정돼요' : '회차로 인정되지 않아요'}
            </Text>
          </View>
          <View style={v.summary}>
            <View style={v.summaryRow}>
              <Text style={v.tick}>✓</Text>
              <Text style={v.summaryText}>
                인정 회차는 {result.counted ? '반영되어' : '그대로'} {result.completedCount}/
                {result.totalCount}
              </Text>
            </View>
            <View style={v.rule} />
            <View style={v.summaryRow}>
              <Text style={v.tick}>✓</Text>
              <Text style={v.summaryText}>
                {result.parentConsented
                  ? '보강 날짜를 학부모님께 물어볼 수 있어요'
                  : '보강 날짜 조율은 수신 동의 후 가능해요'}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={[s.footer, { paddingBottom: 40 }]}>
          {!result.parentConsented && (
            <Text style={v.consentHint}>학부모 연락처 동의 후 보강 날짜를 물어볼 수 있어요.</Text>
          )}
          <ActionButton label="홈으로" onPress={onHome} />
          {result.parentConsented && (
            <ActionButton label="보강 조율하기" variant="secondary" onPress={onCoordinate} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const v = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  brandRow: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  logo: { width: 136, height: 40 },
  teacher: {
    backgroundColor: c.surface.brand,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexShrink: 1,
  },
  teacherText: { ...t.caption[1].medium, color: c.text.brand.assistive },
  hero: { alignItems: 'center', paddingTop: 26 },
  success: { width: 80, height: 80, marginBottom: 12 },
  title: { ...t.body[1].semiBold, color: c.text.default.neutral, marginBottom: 24 },
  reason: { ...t.body[3].semiBold, color: c.text.brand.assistive, marginBottom: 4 },
  subtitle: { ...t.body[4].regular, color: c.text.default.weak },
  summary: {
    marginTop: 72,
    paddingHorizontal: 12,
    backgroundColor: c.surface.subtle,
    borderRadius: 8,
  },
  summaryRow: { minHeight: 56, flexDirection: 'row', gap: 16, alignItems: 'center' },
  summaryText: { ...t.body[3].semiBold, color: c.text.brand.assistive, flex: 1 },
  tick: { color: c.action.default, fontSize: 18 },
  rule: { height: 1, backgroundColor: c.border.default },
  consentHint: {
    ...t.body[4].regular,
    color: c.text.default.weak,
    textAlign: 'center',
    marginBottom: 8,
  },
});
