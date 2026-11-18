export type ReportFrequency = 'EVERY_LESSON' | 'SETTLEMENT_ONLY' | 'NONE';
export type OperationPreferences = {
  reportFrequency: ReportFrequency;
  settlementSessionCount: number;
  paymentTiming: 'PREPAID' | 'POSTPAID';
  homeworkReminder: boolean;
};
/** 질문 화면 시안의 초기 선택값. 건너뛰기에서는 저장하지 않습니다. */
export const initialOperation: OperationPreferences = {
  reportFrequency: 'EVERY_LESSON',
  settlementSessionCount: 8,
  paymentTiming: 'PREPAID',
  homeworkReminder: true,
};
export const reportLabels: Record<ReportFrequency, string> = {
  EVERY_LESSON: '매 수업 후',
  SETTLEMENT_ONLY: '정산 때만',
  NONE: '보내지 않음',
};
/** 유형은 근황 주기로만 분류하고 숙제 알림·정산 설정은 별도로 유지합니다. */
export const operationTypes = {
  EVERY_LESSON: {
    key: 'detailed',
    name: '꼼꼼형',
    description: '매 수업 근황과 숙제를 꼼꼼하게 보내요',
  },
  SETTLEMENT_ONLY: {
    key: 'simple',
    name: '간단형',
    description: '정산 때 리포트, 꼭 필요한 알림만 보내요',
  },
  NONE: { key: 'minimal', name: '최소형', description: '정산 리포트와 교육비 안내만 보내요' },
} as const;
// 기존 정산 화면과 같은 입력 범위입니다.
export const SETTLEMENT_MIN = 1;
export const SETTLEMENT_MAX = 20;
export function validSettlementCount(text: string) {
  return /^\d+$/.test(text) && Number(text) >= SETTLEMENT_MIN && Number(text) <= SETTLEMENT_MAX;
}
export function settlementLabel(value: OperationPreferences) {
  return `${value.settlementSessionCount}회차 ${value.paymentTiming === 'PREPAID' ? '선불' : '후불'}`;
}
