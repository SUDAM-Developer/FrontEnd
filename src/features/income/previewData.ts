import type { IncomeData, IncomeState } from './types';
export const previewIncome: IncomeData = {
  summary: { expectedAmount: 1200000, receivedAmount: 400000, outstandingAmount: 800000 },
  invoices: [
    {
      id: 'income-1',
      studentName: '박지후',
      sessionCount: 8,
      billedAmount: 360000,
      receivedAmount: 0,
      parentReportedAt: '9/15',
    },
    {
      id: 'income-2',
      studentName: '윤서아',
      sessionCount: 8,
      billedAmount: 360000,
      receivedAmount: 0,
      reminderText: '안 들어오면 다음 수업 전날 오전 9시에 선생님께 알려 드려요',
    },
    {
      id: 'income-3',
      studentName: '이도윤',
      sessionCount: 4,
      billedAmount: 200000,
      receivedAmount: 120000,
    },
    {
      id: 'income-4',
      studentName: '김하린',
      sessionCount: 8,
      billedAmount: 280000,
      receivedAmount: 280000,
    },
  ],
};
export function incomePreviewState(value?: string): IncomeState {
  if (value === 'loading') return { status: 'loading' };
  if (value === 'error')
    return { status: 'error', message: '수입 정보를 불러오지 못했어요. 다시 시도해 주세요.' };
  // 빈 화면 SVG에도 월 요약 금액이 남아 있어 시각 확인용으로 동일하게 유지합니다.
  if (value === 'empty')
    return { status: 'ready', data: { summary: { ...previewIncome.summary }, invoices: [] } };
  return { status: 'ready', data: previewIncome };
}
