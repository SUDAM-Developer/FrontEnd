import { CAN_PREVIEW } from '@/config/review';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ReportDetailScreen } from '@/features/report/ReportDetailScreen';
import { previewReportDetail } from '@/features/report/previewData';

// TODO: 초안 생성 API가 생기면 실제 요청으로 바꿉니다. 지금은 스켈레톤만 잠깐 보여 줍니다.
const REGENERATE_PREVIEW_MS = 1500;
const previewRegenerate = () =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(previewReportDetail.comment.draft), REGENERATE_PREVIEW_MS),
  );

// TODO: 교육비 수정 API가 생기면 실제 요청으로 바꿉니다. 지금은 저장 중 상태만 잠깐 보여 줍니다.
const SAVE_FEE_PREVIEW_MS = 1500;
const previewSaveFee = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SAVE_FEE_PREVIEW_MS));

const back = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/reports');
};

// TODO: 리포트 상세 API가 생기면 id로 불러옵니다. 지금은 미리보기 데이터만 보여 줍니다.
export default function ReportDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!CAN_PREVIEW) return <Redirect href="/reports" />;
  return (
    <ReportDetailScreen
      report={{ ...previewReportDetail, id: id ?? previewReportDetail.id }}
      onBack={back}
      // TODO: 카카오톡 공유 연동 전까지는 목록으로 돌아갑니다.
      onSend={back}
      onRegenerate={previewRegenerate}
      onSaveFee={previewSaveFee}
    />
  );
}
