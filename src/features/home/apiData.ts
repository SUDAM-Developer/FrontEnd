import { getInvoices } from '@/apis/billing';
import { getReportDeliveries } from '@/apis/reports';
import type { HomeTask } from './types';

export type HomeSummary = {
  tasks: HomeTask[];
  /**
   * 과외 보유 여부를 알려주는 API가 없어, 리포트·입금 조회가 모두 성공하고 둘 다 0건이면
   * 첫 과외 준비 홈으로 봅니다. 과외를 막 만들어 정산이 아직 없는 경우도 포함됩니다.
   */
  firstTutoring: boolean;
};

/**
 * 홈 할 일 건수와 첫 과외 여부를 실제 API로 조회합니다.
 * 미기록 수업·안 보낸 카톡은 조회 API가 없어 null(표시 `-`)로 둡니다.
 * 조회에 실패한 항목도 0건으로 바꾸지 않고 null로 둡니다.
 */
export async function loadHomeSummary(signal: AbortSignal): Promise<HomeSummary> {
  const [reports, invoices] = await Promise.allSettled([
    getReportDeliveries(signal),
    getInvoices(signal),
  ]);
  // 발송 대기: 아직 보내지 않았거나 발송에 실패해 선생님이 보내야 하는 리포트입니다.
  const pendingReports =
    reports.status === 'fulfilled' && Array.isArray(reports.value.items)
      ? reports.value.items.filter(
          (item) => item.status === 'GENERATED' || item.status === 'FAILED',
        ).length
      : null;
  const unpaid =
    invoices.status === 'fulfilled' && typeof invoices.value.unpaidCount === 'number'
      ? invoices.value.unpaidCount
      : null;
  const firstTutoring =
    reports.status === 'fulfilled' &&
    Array.isArray(reports.value.items) &&
    reports.value.items.length === 0 &&
    invoices.status === 'fulfilled' &&
    Array.isArray(invoices.value.items) &&
    invoices.value.items.length === 0;
  return {
    tasks: [
      { id: 'records', label: '미기록 수업', count: null },
      { id: 'messages', label: '안 보낸 카톡', count: null },
      { id: 'reports', label: '발송 대기 정산 리포트', count: pendingReports },
      { id: 'income', label: '미입금', count: unpaid },
    ],
    firstTutoring,
  };
}

/** 할 일 제목 옆 합계입니다. 확인한 건수만 더합니다. */
export const knownTaskTotal = (tasks: HomeTask[]) =>
  tasks.reduce((sum, task) => sum + (task.count ?? 0), 0);
