import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { s } from './styles';
import { formatPeriod, formatReadAt, reportStatusLabel } from './types';
import type { ReportItem, ReportStatus } from './types';
import createdIcon from '../../../assets/images/report-created.svg';
import sentIcon from '../../../assets/images/report-sent.svg';

export function ReportStatusTag({ status }: { status: ReportStatus }) {
  const created = status === 'created';
  return (
    <View style={[s.statusTag, created ? s.statusCreated : s.statusSent]}>
      <Image source={created ? createdIcon : sentIcon} style={s.statusIcon} aria-hidden />
      <Text style={[s.statusText, created ? s.statusTextCreated : s.statusTextSent]}>
        {reportStatusLabel[status]}
      </Text>
    </View>
  );
}

export function ReportCard({ report, onPress }: { report: ReportItem; onPress?: () => void }) {
  const period = formatPeriod(report.periodStart, report.periodEnd);
  const readAt =
    report.status === 'sent' && report.parentReadAt
      ? `학부모 열람 · ${formatReadAt(report.parentReadAt)}`
      : undefined;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      role={onPress ? 'button' : undefined}
      accessibilityLabel={[
        report.studentName,
        `${report.settlementMonth}월 정산`,
        period,
        reportStatusLabel[report.status],
        readAt,
      ]
        .filter(Boolean)
        .join(', ')}
      style={s.card}
    >
      <View style={s.cardHeader}>
        <View style={s.cardInfo}>
          <Text style={s.student}>{report.studentName}</Text>
          <View style={s.period}>
            <Text style={s.periodText}>{report.settlementMonth}월 정산</Text>
            <Text style={s.periodText}>{period}</Text>
          </View>
        </View>
        <ReportStatusTag status={report.status} />
      </View>
      {readAt && (
        <View style={s.readInfo}>
          <Text style={s.readText}>{readAt}</Text>
        </View>
      )}
    </Pressable>
  );
}
