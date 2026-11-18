import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { s } from './styles';
import { paymentStatus, won } from './types';
import type { IncomeInvoice, IncomeState } from './types';
import gradient from '../../../assets/images/income-gradient.svg';
import { IncomeGraphic } from '@/components/IncomeGraphic';
import { PaymentSheet } from './PaymentSheet';

const TOAST_MS = 3000;
const PAID_TOAST = '입금 완료 · 학부모 링크에도 입금 확인으로 표시돼요';

function InvoiceCard({ invoice, onPress }: { invoice: IncomeInvoice; onPress: () => void }) {
  const status = paymentStatus(invoice);
  const paid = status === '입금 완료';
  const note =
    invoice.receivedAmount > 0 && !paid
      ? `받은 금액 ${won(invoice.receivedAmount)}`
      : !paid && invoice.parentReportedAt
        ? `학부모님이 [입금했어요]를 눌렀어요 · ${invoice.parentReportedAt}`
        : !paid
          ? invoice.reminderText
          : undefined;
  return (
    <Pressable
      role="button"
      disabled={paid}
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && s.cardPressed]}
      accessibilityLabel={`${invoice.studentName}, ${status}, ${won(invoice.billedAmount)}`}
      accessibilityHint={paid ? undefined : '입금 확인 열기'}
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
    </Pressable>
  );
}
export function IncomeScreen({ state, onRetry }: { state: IncomeState; onRetry?: () => void }) {
  // API 연동 전: 시트에서 확인한 받은 금액을 화면에만 반영합니다.
  const [received, setReceived] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const invoices =
    state.status === 'ready'
      ? state.data.invoices.map((invoice) =>
          invoice.id in received ? { ...invoice, receivedAmount: received[invoice.id] } : invoice,
        )
      : [];
  const summary =
    state.status === 'ready'
      ? (() => {
          const delta = state.data.invoices.reduce(
            (sum, invoice) =>
              invoice.id in received ? sum + received[invoice.id] - invoice.receivedAmount : sum,
            0,
          );
          const { expectedAmount, receivedAmount, outstandingAmount } = state.data.summary;
          return {
            expectedAmount,
            receivedAmount: receivedAmount + delta,
            outstandingAmount: Math.max(0, outstandingAmount - delta),
          };
        })()
      : null;
  const selected = invoices.find((invoice) => invoice.id === selectedId);

  const record = (id: string, amount: number) => {
    setReceived((prev) => ({ ...prev, [id]: amount }));
    setSelectedId(null);
  };

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
          ) : state.status === 'ready' && summary ? (
            <>
              <View
                style={s.summary}
                accessibilityLabel={`이번달 교육비 ${won(summary.expectedAmount)}, 입금 ${won(summary.receivedAmount)}, 미수금 ${won(summary.outstandingAmount)}`}
              >
                <Image
                  source={gradient}
                  style={s.gradient}
                  contentFit="fill"
                  accessibilityIgnoresInvertColors
                />
                <View>
                  <Text style={s.summaryLabel}>이번달 교육비</Text>
                  <Text style={s.amount}>{won(summary.expectedAmount)}</Text>
                </View>
                <IncomeGraphic size={88} style={s.illustration} />
                <View style={s.totals}>
                  <Text style={s.totalText}>입금 {won(summary.receivedAmount)}</Text>
                  <View style={s.separator} />
                  <Text style={s.totalText}>미수금 {won(summary.outstandingAmount)}</Text>
                </View>
              </View>
              {invoices.length > 0 && (
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
                {invoices.length === 0 ? (
                  <View style={s.empty}>
                    <Text style={s.emptyText}>이번달 청구가 아직 없어요</Text>
                  </View>
                ) : (
                  <View style={s.list}>
                    {invoices.map((invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        onPress={() => setSelectedId(invoice.id)}
                      />
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
        {toast && (
          <View style={s.toastSlot}>
            <View role="status" accessibilityLiveRegion="polite" style={s.toast}>
              <Text style={s.toastText}>{toast}</Text>
            </View>
          </View>
        )}
      </View>
      {selected && (
        <PaymentSheet
          invoice={selected}
          onClose={() => setSelectedId(null)}
          onPaidInFull={() => {
            record(selected.id, selected.billedAmount);
            setToast(PAID_TOAST);
          }}
          onResend={(amount) => {
            // TODO: 카톡 공유 연동 전이라 받은 금액만 반영하고 전송 완료 토스트를 보여 줍니다.
            // TODO: 보호자 호칭은 API 데이터 확정 후 교체합니다. (Figma: 'OOO 어머님')
            record(selected.id, Math.min(amount, selected.billedAmount));
            setToast(`${selected.studentName} 어머님께 카톡을 보냈어요`);
          }}
        />
      )}
    </SafeAreaView>
  );
}
