import type { ApiParentResponse } from '@/apis/models';
export type IncomeInvoice = {
  id: string;
  studentName: string;
  sessionCount?: number;
  invoiceName?: string;
  parents?: ApiParentResponse[];
  canceled?: boolean;
  statusLine?: string;
  billedAmount: number;
  receivedAmount: number;
  parentReportedAt?: string;
  reminderText?: string;
  /** 선생님이 카톡으로 입금 안내를 다시 보냈는지 */
  noticeResent?: boolean;
};
/** 서버가 계산한 월 합계를 그대로 표시합니다. 목록에서 다시 합산하지 않습니다. */
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
  if (invoice.receivedAmount >= invoice.billedAmount) return '입금 완료';
  if (invoice.receivedAmount > 0) return '일부 입금';
  return '입금 대기';
}
export function won(value: number) {
  return `${new Intl.NumberFormat('ko-KR').format(value)}원`;
}
