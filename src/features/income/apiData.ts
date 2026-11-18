import { getInvoices } from '@/apis/billing';
import type { ApiInvoiceItemResponse } from '@/apis/models';
import type { IncomeData, IncomeInvoice } from './types';
export function incomeInvoice(item: ApiInvoiceItemResponse): IncomeInvoice {
  const note = item.statusLine;
  return {
    id: String(item.invoiceId),
    studentName: item.studentName,
    invoiceName: item.invoiceName,
    parents: item.parents ?? [],
    billedAmount: item.amount,
    receivedAmount: item.paidAmount,
    canceled: item.status === 'CANCELED',
    statusLine:
      note?.type === 'PARENT_CONFIRMED'
        ? `학부모님이 입금 확인을 요청했어요${note.at ? ` · ${note.at.replace('T', ' ')}` : ''}`
        : note?.type === 'RESENT'
          ? '입금 안내를 다시 보냈어요'
          : undefined,
  };
}
export async function loadIncome(signal: AbortSignal): Promise<IncomeData> {
  const value = await getInvoices(signal);
  return {
    summary: {
      expectedAmount: value.summary.totalAmount,
      receivedAmount: value.summary.paidAmount,
      outstandingAmount: value.summary.unpaidAmount,
    },
    invoices: value.items.map(incomeInvoice),
  };
}
