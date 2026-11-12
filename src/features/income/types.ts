export type IncomeInvoice = {
  id: string;
  studentName: string;
  sessionCount: number;
  billedAmount: number;
  receivedAmount: number;
  parentReportedAt?: string;
  reminderText?: string;
};
/** API 미확정: 화면 데이터 모델입니다. summary는 목록과 독립적인 집계 응답을 받을 수 있게 구분합니다. */
export type IncomeData = {
  summary: { expectedAmount: number; receivedAmount: number; outstandingAmount: number };
  invoices: IncomeInvoice[];
};
export type IncomeState =
  | { status: 'loading' }
  | { status: 'ready'; data: IncomeData }
  | { status: 'error'; message: string }
  | { status: 'unavailable' };
export function paymentStatus(invoice: IncomeInvoice) {
  if (invoice.receivedAmount >= invoice.billedAmount) return '입금완료';
  if (invoice.receivedAmount > 0) return '일부 입금';
  return '입금 대기';
}
export function won(value: number) {
  return `${new Intl.NumberFormat('ko-KR').format(value)}원`;
}
