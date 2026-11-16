import type { ReportData, ReportState } from './types';

export const previewReports: ReportData = {
  firstSettlementSession: 4,
  reports: [
    {
      id: 'report-1',
      studentName: '박지후',
      settlementMonth: 9,
      periodStart: '2026-09-15',
      periodEnd: '2026-10-13',
      status: 'created',
    },
    {
      id: 'report-2',
      studentName: '이도윤',
      settlementMonth: 9,
      periodStart: '2026-09-02',
      periodEnd: '2026-09-25',
      status: 'sent',
      parentReadAt: '2026-10-01T21:04',
    },
    {
      id: 'report-3',
      studentName: '윤서아',
      settlementMonth: 9,
      periodStart: '2026-09-14',
      periodEnd: '2026-09-30',
      status: 'sent',
      parentReadAt: '2026-10-01T21:04',
    },
  ],
};

/** ?preview=loading | empty | error 로 상태별 화면을 확인합니다. */
export function reportPreviewState(value?: string): ReportState {
  if (value === 'loading') return { status: 'loading' };
  if (value === 'error')
    return { status: 'error', message: '리포트를 불러오지 못했어요. 다시 시도해 주세요.' };
  if (value === 'empty') return { status: 'ready', data: { ...previewReports, reports: [] } };
  return { status: 'ready', data: previewReports };
}
