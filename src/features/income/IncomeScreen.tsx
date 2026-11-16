import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { s } from './styles';
import { paymentStatus, won } from './types';
import type { IncomeInvoice, IncomeState } from './types';
import gradient from '../../../assets/images/income-gradient.svg';
import { IncomeGraphic } from '@/components/IncomeGraphic';

function InvoiceCard({ invoice }: { invoice: IncomeInvoice }) {
  const status = paymentStatus(invoice);
  const paid = status === '입금완료';
  const note =
    invoice.receivedAmount > 0 && !paid
      ? `받은 금액 ${won(invoice.receivedAmount)}`
      : !paid && invoice.parentReportedAt
        ? `학부모님이 [입금했어요]를 눌렀어요 · ${invoice.parentReportedAt}`
        : !paid
          ? invoice.reminderText
          : undefined;
  return (
    <View
      style={s.card}
      accessibilityLabel={`${invoice.studentName}, ${status}, ${won(invoice.billedAmount)}`}
    >
      <View style={s.cardHeader}>
        <Text style={s.student}>{invoice.studentName}</Text>
        <View style={[s.badge, paid && s.paidBadge]}>
          <Text style={[s.badgeText, paid && s.paidText]}>{status}</Text>
        </View>
      </View>
      <View style={s.bill}>
        <Text style={s.sessions}>다음 {invoice.sessionCount}회차</Text>
        <Text style={s.billAmount}>{won(invoice.billedAmount)}</Text>
      </View>
      {note && (
        <View style={s.note}>
          <Text style={s.noteText}>{note}</Text>
        </View>
      )}
    </View>
  );
}
export function IncomeScreen({ state, onRetry }: { state: IncomeState; onRetry?: () => void }) {
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <View style={s.phone}>
        <View style={s.header}>
          <Text role="heading" style={s.title}>
            수입
          </Text>
        </View>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          {state.status === 'loading' ? (
            <View role="progressbar" accessibilityLabel="수입 정보 불러오는 중" aria-busy>
              <View aria-hidden>
                <View style={[s.skeleton, s.skeletonSummary]} />
                <View style={[s.skeleton, s.skeletonInfo]} />
                <View style={[s.skeleton, s.skeletonTitle]} />
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={[s.skeleton, s.skeletonCard]} />
                ))}
              </View>
            </View>
          ) : state.status === 'ready' ? (
            <>
              <View
                style={s.summary}
                accessibilityLabel={`이번달 교육비 ${won(state.data.summary.expectedAmount)}, 입금 ${won(state.data.summary.receivedAmount)}, 미수금 ${won(state.data.summary.outstandingAmount)}`}
              >
                <Image
                  source={gradient}
                  style={s.gradient}
                  contentFit="fill"
                  accessibilityIgnoresInvertColors
                />
                <View>
                  <Text style={s.summaryLabel}>이번달 교육비</Text>
                  <Text style={s.amount}>{won(state.data.summary.expectedAmount)}</Text>
                </View>
                <IncomeGraphic size={88} style={s.illustration} />
                <View style={s.totals}>
                  <Text style={s.totalText}>입금 {won(state.data.summary.receivedAmount)}</Text>
                  <View style={s.separator} />
                  <Text style={s.totalText}>
                    미수금 {won(state.data.summary.outstandingAmount)}
                  </Text>
                </View>
              </View>
              {state.data.invoices.length > 0 && (
                <View style={s.info}>
                  <Text style={s.infoIcon}>ⓘ</Text>
                  <Text style={s.infoText}>
                    학부모님이 [입금했어요]를 누르면 알려 드려요. 통장을 확인하고 체크해 주세요.
                  </Text>
                </View>
              )}
              <View style={s.students}>
                <Text role="heading" style={s.sectionTitle}>
                  학생별
                </Text>
                {state.data.invoices.length === 0 ? (
                  <View style={s.empty}>
                    <Text style={s.emptyText}>이번달 청구가 아직 없어요</Text>
                  </View>
                ) : (
                  <View style={s.list}>
                    {state.data.invoices.map((invoice) => (
                      <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={s.error}>
              <Text role="alert" style={s.errorText}>
                {state.status === 'error'
                  ? state.message
                  : '수입 정보를 준비 중이에요. 연동 후 입금 현황을 확인할 수 있어요.'}
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
