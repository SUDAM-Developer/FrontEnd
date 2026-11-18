import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { ReportCard } from './ReportCard';
import { ReportEmpty } from './ReportEmpty';
import { ReportSkeleton } from './ReportSkeleton';
import { s } from './styles';
import type { ReportState } from './types';

export function ReportScreen({ state, onRetry }: { state: ReportState; onRetry?: () => void }) {
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <View style={s.phone}>
        <View style={s.header}>
          <Text role="heading" style={s.title}>
            리포트
          </Text>
        </View>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          {state.status === 'loading' ? (
            <ReportSkeleton />
          ) : state.status === 'ready' && state.data.reports.length === 0 ? (
            <ReportEmpty firstSettlementSession={state.data.firstSettlementSession} />
          ) : state.status === 'ready' ? (
            <View style={s.list}>
              {state.data.reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onPress={() =>
                    router.push({ pathname: '/report/[id]', params: { id: report.id } })
                  }
                />
              ))}
            </View>
          ) : (
            <View style={s.error}>
              <Text role="alert" style={s.errorText}>
                {state.status === 'error'
                  ? state.message
                  : '리포트를 준비 중이에요. 연동 후 정산 리포트를 확인할 수 있어요.'}
              </Text>
              {state.status === 'error' && onRetry && (
                <ActionButton label="다시 시도" onPress={onRetry} />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
