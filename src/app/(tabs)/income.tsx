import { createShare, confirmRenotification } from '@/apis/shares';
import { prepareKakaoShare, openKakaoShare } from '@/utils/kakaoShare';
import { Tabs } from 'expo-router';
import { IncomeScreen } from '@/features/income/IncomeScreen';
import { loadIncome } from '@/features/income/apiData';
import { useApiResource } from '@/hooks/useApiResource';
import { confirmPayment } from '@/apis/billing';
export default function Screen() {
  const { state, retry } = useApiResource(loadIncome);
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <IncomeScreen
        state={state}
        onRetry={retry}
        onResend={async (id, participantId) => {
          await prepareKakaoShare();
          const share = await createShare('PAYMENT_RESEND', Number(id), participantId);
          openKakaoShare(share);
          await confirmRenotification(id);
          retry();
        }}
        onConfirmPayment={async (id, amount) => {
          await confirmPayment(id, amount);
          retry();
        }}
      />
    </>
  );
}
