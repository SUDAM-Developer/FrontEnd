import { request } from './client';
import type {
  ApiReportDeliveryItem,
  ApiReportResponse,
  ApiReportCommentResponse,
  ApiReportInvoiceResponse,
  ApiReportSendResponse,
} from './models';
const reportPath = (id: string) => `/api/v1/reports/${encodeURIComponent(id)}`;
export const getReport = (id: string, signal?: AbortSignal) =>
  request<ApiReportResponse>(reportPath(id), { signal });
export const getReportComment = (id: string, signal?: AbortSignal) =>
  request<ApiReportCommentResponse>(`${reportPath(id)}/comment`, { signal });
export const saveReportComment = (id: string, text: string, signal?: AbortSignal) =>
  request<ApiReportCommentResponse>(`${reportPath(id)}/comment`, {
    method: 'PUT',
    body: { text },
    signal,
  });
export const getReportInvoice = (id: string, signal?: AbortSignal) =>
  request<ApiReportInvoiceResponse>(`${reportPath(id)}/invoice`, { signal });
export const confirmReportSend = (id: string) =>
  request<ApiReportSendResponse>(`${reportPath(id)}/send`, { method: 'POST' });
/** Swagger의 Item 이름 충돌은 백엔드 실제 DTO로 확인했습니다. */
export const getReportDeliveries = (signal?: AbortSignal) =>
  request<{ items: ApiReportDeliveryItem[] }>('/api/v1/reports/deliveries', { signal });
