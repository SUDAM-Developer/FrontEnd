import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { empty } from './styles';
import emptyGraphic from '../../../assets/images/report-empty.svg';

/** 정산 리포트가 하나도 없을 때 표시합니다. */
export function ReportEmpty({ firstSettlementSession }: { firstSettlementSession: number }) {
  return (
    <View style={empty.wrap}>
      <Image source={emptyGraphic} style={empty.graphic} aria-hidden />
      <View style={empty.texts}>
        <Text role="heading" style={empty.title}>
          아직 정산 리포트가 없어요
        </Text>
        <Text style={empty.description}>
          첫 정산은 {firstSettlementSession}회차 수업 후에 만들어져요.
        </Text>
      </View>
    </View>
  );
}
