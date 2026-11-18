/** created: 리포트 생성됨, sent: 학부모에게 발송 완료 */
export type ReportStatus = 'created' | 'sent';

/** API 미확정: 화면 데이터 모델입니다. 날짜는 ISO 문자열(YYYY-MM-DD, 열람 일시는 ISO datetime)로 받습니다. */
export type ReportItem = {
  id: string;
  studentName: string;
  /** 정산 월 (1~12) */
  settlementMonth: number;
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  /** 학부모가 열람한 일시. 발송 완료 후 열람했을 때만 있습니다. */
  parentReadAt?: string;
};

export type ReportData = {
  reports: ReportItem[];
  /** 첫 정산이 만들어지는 수업 회차 (빈 상태 안내 문구의 N) */
  firstSettlementSession: number;
};

export type ReportState =
  | { status: 'loading' }
  | { status: 'ready'; data: ReportData }
  | { status: 'error'; message: string }
  | { status: 'unavailable' };

export const reportStatusLabel: Record<ReportStatus, string> = {
  created: '생성됨',
  sent: '발송 완료',
};

function parseDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return { year, month, day };
}

/** 2026-09-15, 2026-10-13 → "9월 15일 – 10월 13일" (separator로 가운데 기호를 바꿉니다) */
export function formatPeriod(start: string, end: string, separator = '–') {
  const a = parseDate(start);
  const b = parseDate(end);
  return `${a.month}월 ${a.day}일 ${separator} ${b.month}월 ${b.day}일`;
}

/** 2026-10-01T21:04 → "10/1 21:04" */
export function formatReadAt(value: string) {
  const { month, day } = parseDate(value);
  const time = value.slice(11, 16);
  return `${month}/${day} ${time}`;
}

/** 이해도 평균 */
export type Understanding = '상' | '중' | '하';

/** API 미확정: 정산 리포트 상세 화면 데이터 모델입니다. 금액은 원 단위 정수입니다. */
export type ReportDetail = {
  id: string;
  studentName: string;
  teacherName: string;
  /** sent면 발송 완료 리포트로, 읽기 전용으로 보여 줍니다. */
  status: ReportStatus;
  /** 학부모에게 보낸 일시 (ISO datetime). 발송 완료일 때만 있습니다. */
  sentAt?: string;
  /** 학부모가 열람한 일시 (ISO datetime). 열람 전이면 없습니다. */
  parentReadAt?: string;
  /** 이번 정산에서 마친 수업 회차 수 (제목 "N회차 수업을 마쳤어요") */
  sessionCount: number;
  periodStart: string;
  periodEnd: string;
  stats: {
    completedSessions: number;
    totalSessions: number;
    cancelledSessions: number;
    /** 숙제 수행률 (0~100) */
    homeworkRate: number;
    understanding: Understanding;
  };
  progress: { textbook: string; startLesson: number; currentLesson: number }[];
  comment: {
    /** AI가 만든 선생님 코멘트 초안 */
    draft: string;
    /** 선생님이 적은 원래 기록 메모. 학부모에게는 보이지 않습니다. */
    teacherMemo: string;
    /** 기록 메모를 AI가 부드럽게 다듬은 초안 문장 */
    softened: string;
  };
  fee: {
    total: number;
    /** 예: "8회차 · 선불 · 9월 14일 사이클" */
    setting: string;
    countedSessions: number;
    unitPrice: number;
    /** 예: "없음 · 차감 없음" */
    cancellation: string;
    /** 예: "국민 ****1492 한서윤" */
    account: string;
  };
};

/** 교육비 수정 내용. 수정 전·후 금액과 사유를 함께 저장합니다. */
export type FeeEdit = { previousTotal: number; total: number; reason: string };

/** 2026-10-01T09:00 → "10월 1일 오전 9:00" */
export function formatDateTime(value: string) {
  const { month, day } = parseDate(value);
  const [hour, minute] = value.slice(11, 16).split(':').map(Number);
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${month}월 ${day}일 ${period} ${hour12}:${String(minute).padStart(2, '0')}`;
}

/** 300000 → "300,000원" */
export const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`;
