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

/** 2026-09-15, 2026-10-13 → "9월 15일 – 10월 13일" */
export function formatPeriod(start: string, end: string) {
  const a = parseDate(start);
  const b = parseDate(end);
  return `${a.month}월 ${a.day}일 – ${b.month}월 ${b.day}일`;
}

/** 2026-10-01T21:04 → "10/1 21:04" */
export function formatReadAt(value: string) {
  const { month, day } = parseDate(value);
  const time = value.slice(11, 16);
  return `${month}/${day} ${time}`;
}
