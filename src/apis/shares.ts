import { request } from './client';
import type { ApiShareResponse, ApiInvoiceItemResponse } from './models';
export const createShare = (
  kind: 'SETTLEMENT_REPORT' | 'PAYMENT_RESEND',
  sourceId: number,
  participantId: number,
) =>
  request<ApiShareResponse>('/api/v1/shares', {
    method: 'POST',
    body: { kind, sourceId, participantId },
  });
export const confirmRenotification = (id: string) =>
  request<ApiInvoiceItemResponse>(`/api/v1/invoices/${encodeURIComponent(id)}/renotifications`, {
    method: 'POST',
  });
