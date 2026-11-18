import { request } from './client';
import type {
  ApiInvoiceListResponse,
  ApiPaymentConfirmResponse,
  ApiReportInvoiceResponse,
} from './models';
const invoicePath = (id: string) => `/api/v1/invoices/${encodeURIComponent(id)}`;
export const getInvoices = (signal?: AbortSignal) =>
  request<ApiInvoiceListResponse>('/api/v1/invoices', { signal });
/** amount는 누적 총액이 아니라 이번에 확인한 추가 입금액입니다. */
export const confirmPayment = (id: string, amount?: number, signal?: AbortSignal) =>
  request<ApiPaymentConfirmResponse>(`${invoicePath(id)}/payments`, {
    method: 'POST',
    body: amount === undefined ? undefined : { amount },
    signal,
  });
export const adjustInvoice = (id: string, amount: number, reason: string, signal?: AbortSignal) =>
  request<ApiReportInvoiceResponse>(`${invoicePath(id)}/adjustments`, {
    method: 'POST',
    body: { amount, reason },
    signal,
  });
