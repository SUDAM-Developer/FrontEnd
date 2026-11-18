import { getMe } from '@/apis/auth';
import { getReport, getReportComment, getReportDeliveries, getReportInvoice } from '@/apis/reports';
import type { ApiReportInvoiceResponse, ApiReportResponse } from '@/apis/models';
import type { ReportData, ReportDetail, ReportItem, ReportStatus } from './types';
export function reportStatus(value: string): ReportStatus {
  const statuses: Record<string, ReportStatus> = {
    GENERATED: 'created',
    SENT: 'sent',
    SCHEDULED: 'scheduled',
    FAILED: 'failed',
  };
  if (!(value in statuses)) throw new Error('리포트 발송 상태를 확인할 수 없어요.');
  return statuses[value];
}
export function invoiceFee(invoice: ApiReportInvoiceResponse): ReportDetail['fee'] {
  return {
    total: invoice.amount,
    setting: `${invoice.settlementSessionCnt}회차 · ${invoice.paymentTiming === 'PREPAID' ? '선불' : '후불'}${invoice.billedCycleStartDate ? ` · ${invoice.billedCycleStartDate} 사이클` : ''}`,
    countedSessions: invoice.recognizedCount ?? invoice.settlementSessionCnt,
    unitPrice: invoice.unitPrice,
    cancellation: `${invoice.canceledCount}회 · ${invoice.deductionAmount.toLocaleString('ko-KR')}원 차감`,
    account: `${invoice.bankName} ****${invoice.accountLast4} ${invoice.accountHolder}`,
  };
}
/** 정산 월은 서버의 YearMonth를 표시용으로만 바꿉니다. 현재 날짜로 계산하지 않습니다. */
export function settlementMonthLabel(value: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))
    throw new Error('리포트 정산 월 형식을 확인할 수 없어요.');
  return `${Number(value.slice(5))}월 정산`;
}
export async function loadReports(signal: AbortSignal): Promise<ReportData> {
  const result = await getReportDeliveries(signal);
  if (!Array.isArray(result.items)) throw new Error('리포트 목록 응답 형식을 확인할 수 없어요.');
  const reports: ReportItem[] = await Promise.all(
    result.items.map(async (item) => {
      if (!item || typeof item.reportId !== 'number')
        throw new Error('리포트 목록의 reportId를 확인할 수 없어요.');
      // 목록에는 기간이 없으므로 실제 상세 응답의 인정 회차 기간을 사용합니다.
      const detail = await getReport(String(item.reportId), signal);
      return {
        id: String(item.reportId),
        studentName: item.studentName,
        settlementMonth: settlementMonthLabel(item.settlementMonth),
        periodStart: detail.period.startDate,
        periodEnd: detail.period.endDate,
        status: reportStatus(item.status),
        parentReadAt: item.viewedAt ?? undefined,
      };
    }),
  );
  return { reports };
}
export async function loadReportDetail(id: string, signal: AbortSignal) {
  const [report, comment, invoice, me, deliveries] = await Promise.all([
    getReport(id, signal),
    getReportComment(id, signal),
    getReportInvoice(id, signal),
    getMe(signal),
    getReportDeliveries(signal),
  ]);
  const understanding: Record<
    NonNullable<ApiReportResponse['understandingLevel']>,
    '상' | '중' | '하'
  > = { HIGH: '상', MEDIUM: '중', LOW: '하' };
  const delivery = deliveries.items.find((item) => String(item.reportId) === id);
  const data: ReportDetail = {
    id: String(report.reportId),
    studentName: report.studentName,
    teacherName: me.name ?? '',
    status: reportStatus(report.status),
    sentAt: delivery?.sentAt ?? undefined,
    parentReadAt: delivery?.viewedAt ?? undefined,
    sessionCount: report.stats.completedCount,
    periodStart: report.period.startDate,
    periodEnd: report.period.endDate,
    stats: {
      completedSessions: report.stats.completedCount,
      totalSessions: report.stats.targetCount,
      cancelledSessions: report.stats.canceledCount,
      homeworkRate: report.stats.homeworkRate,
      understanding: report.understandingLevel ? understanding[report.understandingLevel] : null,
    },
    progress: report.progress.map((item) => ({
      textbook: item.textbookName,
      startLesson: item.startLabel,
      currentLesson: item.endLabel,
    })),
    comment: {
      draft: comment.comment ?? '',
      source: comment.commentSource,
      reviewed: comment.reviewed,
    },
    fee: invoiceFee(invoice),
  };
  return { data, invoiceId: String(invoice.invoiceId), parents: report.parents ?? [] };
}
