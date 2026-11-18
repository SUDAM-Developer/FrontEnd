import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ReportDetailScreen } from '@/features/report/ReportDetailScreen';
import { invoiceFee, loadReportDetail } from '@/features/report/apiData';
import { useApiResource } from '@/hooks/useApiResource';
import { ApiState } from '@/components/ApiState';
import { saveReportComment, confirmReportSend } from '@/apis/reports';
import { adjustInvoice } from '@/apis/billing';
import { createShare } from '@/apis/shares';
import { prepareKakaoShare, openKakaoShare } from '@/utils/kakaoShare';
import type { ReportDetail } from '@/features/report/types';
const back = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/reports');
};
export default function ReportDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback((signal: AbortSignal) => loadReportDetail(id, signal), [id]);
  const { state, retry } = useApiResource(load);
  const [fee, setFee] = useState<{ reportId: string; value: ReportDetail['fee'] } | null>(null);
  if (state.status !== 'ready')
    return (
      <ApiState
        message={state.status === 'error' ? state.message : undefined}
        onRetry={state.status === 'error' ? retry : undefined}
      />
    );
  return (
    <ReportDetailScreen
      key={id}
      report={{ ...state.data.data, fee: fee?.reportId === id ? fee.value : state.data.data.fee }}
      onBack={back}
      parents={state.data.parents}
      onSaveComment={(text) => saveReportComment(id, text)}
      onSaveFee={async (edit, signal) => {
        const invoice = await adjustInvoice(state.data.invoiceId, edit.total, edit.reason, signal);
        setFee({ reportId: id, value: invoiceFee(invoice) });
      }}
      onSend={async (_comment, participantId) => {
        if (!participantId) throw new Error('공유할 학부모가 연결되어 있지 않아요.');
        await prepareKakaoShare();
        const share = await createShare('SETTLEMENT_REPORT', Number(id), participantId);
        openKakaoShare(share);
        await confirmReportSend(id);
        back();
      }}
    />
  );
}
