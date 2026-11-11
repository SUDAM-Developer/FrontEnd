import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
import { s } from './styles';
import success from '../../../assets/images/record-success.svg';
import type { LessonContext, RecordShareTarget, SessionRecord, SessionRecordResult } from './types';
type Props = {
  lesson: LessonContext;
  record: SessionRecord;
  result: SessionRecordResult;
  onShare: (target: RecordShareTarget) => void;
  onReport: () => void;
  onHome: () => void;
};
export function RecordComplete({ lesson, record, result, onShare, onReport, onHome }: Props) {
  const hasHomework = Boolean(record.nextHomework.trim());
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.phone}>
        <ScrollView contentContainerStyle={v.content}>
          <View style={v.hero}>
            <Image source={success} style={v.success} accessibilityLabel="기록 완료" />
            <Text role="heading" style={v.title}>
              {lesson.sessionNumber}회차 기록 완료
            </Text>
          </View>
          <Text style={v.sectionLabel}>카톡으로 보내기</Text>
          <View style={v.shareCard}>
            <View style={v.shareDescription}>
              <Text style={v.cardTitle}>{lesson.studentName} 학생 오늘 근황</Text>
              <Text style={v.recipient}>{lesson.studentName} 어머님</Text>
            </View>
            <ActionButton
              label="카톡 보내기"
              size="M"
              accessibilityHint="학부모용 오늘 근황 카드 공유"
              onPress={() => onShare('parent-summary')}
            />
          </View>
          <View style={v.shareCard}>
            <View style={v.shareDescription}>
              <Text style={v.cardTitle}>다음 숙제</Text>
              <Text style={v.recipient}>
                {hasHomework ? `${lesson.studentName} 학생` : '등록된 다음 숙제가 없어요'}
              </Text>
            </View>
            <ActionButton
              label="카톡 보내기"
              size="M"
              disabled={!hasHomework}
              accessibilityHint="학생용 다음 숙제 카드 공유"
              onPress={() => onShare('student-homework')}
            />
          </View>
          <View style={v.info}>
            <Text style={v.infoIcon}>ⓘ</Text>
            <Text style={v.infoText}>
              카카오톡 공유 창에서 받는 사람을 고르면 보내져요.{'\n'}안 보내면 홈 알림에 남아요.
            </Text>
          </View>
          <Text style={v.detailsLabel}>완료 내역</Text>
          <View style={v.details}>
            <View style={v.detailRow}>
              <Text style={v.tick}>✓</Text>
              <Text style={v.detailText}>학부모님께 보낼 오늘 근황 카드를 만들었어요</Text>
            </View>
            <View style={v.detailRow}>
              <Text style={v.tick}>✓</Text>
              <Text style={v.detailText}>
                {hasHomework
                  ? `학생에게 보낼 숙제 알림 카드를 만들었어요\n· ${record.nextHomework}`
                  : '다음 숙제는 등록하지 않았어요'}
              </Text>
            </View>
            {result.reportReady ? (
              <View style={[v.detailRow, v.lastRow]}>
                <Text style={v.tick}>✓</Text>
                <Text style={v.detailText}>
                  정산 {result.totalCount}회차가 채워져 정산 리포트와 교육비 안내를 만들었어요
                </Text>
              </View>
            ) : (
              <View style={[v.detailRow, v.lastRow]}>
                <Text style={v.tick}>✓</Text>
                <Text style={v.detailText}>
                  인정 회차 {result.completedCount}/{result.totalCount}를 기록했어요
                </Text>
              </View>
            )}
          </View>
          <View style={v.spacer} />
          <View style={v.actions}>
            <ActionButton
              label="정산 리포트 확인하기"
              disabled={!result.reportReady}
              onPress={onReport}
            />
            <ActionButton label="홈으로" variant="secondary" onPress={onHome} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const v = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingBottom: 52, flexGrow: 1 },
  hero: { alignItems: 'center', paddingTop: 36, marginBottom: 28 },
  success: { width: 90, height: 90, marginBottom: 16 },
  title: { ...t.body[1].semiBold, color: c.text.brand.assistive },
  sectionLabel: {
    ...t.body[5].medium,
    color: c.text.default.normal,
    marginLeft: 8,
    marginBottom: 12,
  },
  shareCard: {
    minHeight: 82,
    backgroundColor: c.surface.subtle,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  shareDescription: { flex: 1, gap: 4 },
  cardTitle: { ...t.body[3].semiBold, color: c.text.default.normal },
  recipient: { ...t.body[5].regular, color: c.text.default.normal },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: c.surface.brand,
    borderWidth: 1,
    borderColor: c.border.focused,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 20,
  },
  infoIcon: { color: c.text.brand.assistive, fontSize: 14 },
  infoText: { ...t.caption[1].regular, color: c.text.brand.assistive, flex: 1 },
  detailsLabel: {
    ...t.body[5].medium,
    color: c.text.default.normal,
    marginLeft: 8,
    marginBottom: 12,
  },
  details: { backgroundColor: c.surface.subtle, paddingHorizontal: 12, borderRadius: 8 },
  detailRow: {
    minHeight: 56,
    paddingHorizontal: 4,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderColor: c.border.default,
  },
  lastRow: { borderBottomWidth: 0 },
  tick: { fontSize: 18, color: c.action.default },
  detailText: { ...t.body[4].semiBold, color: c.text.brand.assistive, flex: 1 },
  spacer: { flexGrow: 1, minHeight: 40 },
  actions: { gap: 8 },
});
