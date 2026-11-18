import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import classIcon from '../../assets/images/schedule-class.svg';
import scheduleIcon from '../../assets/images/schedule-schedule.svg';

type Props = {
  type: 'class' | 'schedule' | 'reschedule';
  title: string;
  timeLabel: string;
  detail?: string;
  dateLabel?: string;
  markerColor?: string;
  finished?: boolean;
  onAction?: () => void;
};

/** 일정 목록 카드. 날짜·학생·회차는 사용하는 화면에서 전달합니다. */
export function ScheduleListCard({
  type,
  title,
  timeLabel,
  detail,
  dateLabel,
  markerColor = '#00D5BE',
  finished = false,
  onAction,
}: Props) {
  const actionable = type !== 'schedule';
  return (
    <View style={[s.card, type === 'reschedule' && s.reschedule, finished && s.finished]}>
      <View style={s.meta}>
        {type === 'reschedule' ? (
          <Text style={s.date}>{dateLabel}</Text>
        ) : (
          <View style={s.badge}>
            <Image
              source={type === 'class' ? classIcon : scheduleIcon}
              style={s.icon}
              accessible={false}
            />
            <Text style={s.badgeText}>{type === 'class' ? '수업' : '일정'}</Text>
          </View>
        )}
        <Text style={[s.time, finished && s.muted]}>{timeLabel}</Text>
      </View>
      <View style={s.content}>
        <View style={s.titleRow}>
          <View style={[s.marker, { backgroundColor: markerColor }]} />
          <Text style={[s.title, finished && s.muted]}>{title}</Text>
        </View>
        {detail ? <Text style={[s.detail, finished && s.muted]}>{detail}</Text> : null}
      </View>
      {actionable ? (
        <Pressable
          role="button"
          accessibilityLabel={`${title} ${finished ? '기록완료' : type === 'reschedule' ? '조율하기' : '기록하기'}`}
          disabled={finished || !onAction}
          onPress={onAction}
          style={[s.action, (finished || !onAction) && s.disabled]}
        >
          <Text style={[s.actionText, finished && s.muted]}>
            {finished ? '기록완료' : type === 'reschedule' ? '조율하기' : '기록하기'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    backgroundColor: '#FBFBFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reschedule: { minHeight: 62 },
  finished: { backgroundColor: '#F7F8FB' },
  meta: { minWidth: 47, gap: 4 },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 4,
    backgroundColor: '#D6EDFF',
    paddingHorizontal: 6,
    height: 24,
  },
  icon: { width: 12, height: 12 },
  badgeText: { color: '#0083EF', fontSize: 12 },
  date: { color: '#848A91', fontSize: 12 },
  time: { color: '#383D48', fontSize: 12, fontWeight: '600', paddingLeft: 4 },
  content: { flex: 1, gap: 4, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  marker: { width: 4, height: 4, borderRadius: 2 },
  title: { color: '#383D48', fontSize: 14, fontWeight: '600', flexShrink: 1 },
  detail: { color: '#383D48', fontSize: 12, paddingLeft: 10 },
  action: {
    minHeight: 34,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#219BFF',
  },
  actionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  disabled: { backgroundColor: '#D6D8DC' },
  muted: { color: '#848A91' },
});
