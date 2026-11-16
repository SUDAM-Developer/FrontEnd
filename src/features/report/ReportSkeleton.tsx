import { View } from 'react-native';
import { s, skeleton } from './styles';

/** 리포트 목록 로딩 중 표시하는 스켈레톤 카드 (Figma: 56 / 138 / 138) */
export function ReportSkeleton() {
  return (
    <View role="progressbar" accessibilityLabel="리포트 불러오는 중" aria-busy>
      <View aria-hidden style={s.list}>
        <View style={[skeleton.card, skeleton.short]} />
        <View style={[skeleton.card, skeleton.tall]} />
        <View style={[skeleton.card, skeleton.tall]} />
      </View>
    </View>
  );
}
