import type { ReportData, ReportDetail, ReportState } from './types';

export const previewReports: ReportData = {
  firstSettlementSession: 4,
  reports: [
    {
      id: 'report-1',
      studentName: '박지후',
      settlementMonth: 9,
      periodStart: '2026-09-15',
      periodEnd: '2026-10-13',
      status: 'created',
    },
    {
      id: 'report-2',
      studentName: '이도윤',
      settlementMonth: 9,
      periodStart: '2026-09-02',
      periodEnd: '2026-09-25',
      status: 'sent',
      parentReadAt: '2026-10-01T21:04',
    },
    {
      id: 'report-3',
      studentName: '윤서아',
      settlementMonth: 9,
      periodStart: '2026-09-14',
      periodEnd: '2026-09-30',
      status: 'sent',
      parentReadAt: '2026-10-01T21:04',
    },
  ],
};

/** ?preview=loading | empty | error 로 상태별 화면을 확인합니다. */
export function reportPreviewState(value?: string): ReportState {
  if (value === 'loading') return { status: 'loading' };
  if (value === 'error')
    return { status: 'error', message: '리포트를 불러오지 못했어요. 다시 시도해 주세요.' };
  if (value === 'empty') return { status: 'ready', data: { ...previewReports, reports: [] } };
  return { status: 'ready', data: previewReports };
}

export const previewReportDetail: ReportDetail = {
  id: 'report-1',
  studentName: '박지후',
  teacherName: '김수담',
  status: 'created',
  sessionCount: 8,
  periodStart: '2026-09-15',
  periodEnd: '2026-10-13',
  stats: {
    completedSessions: 8,
    totalSessions: 8,
    cancelledSessions: 1,
    homeworkRate: 88,
    understanding: '상',
  },
  progress: [
    { textbook: 'Reading Expert 1', startLesson: 2, currentLesson: 5 },
    { textbook: 'Grammar Zone 입문', startLesson: 3, currentLesson: 9 },
  ],
  comment: {
    draft:
      '9월에는 장문 독해에서 큰 변화가 있었습니다. 수능특강을 진행하며 한 지문을 읽는 시간이 처음보다 눈에 띄게 줄었고, 주제를 먼저 찾고 세부 내용을 확인하는 순서가 자리를 잡았습니다.\n' +
      "문법은 관계사 단원에서 실수가 잦았지만, 마지막 두 회차에는 이해도 '상'으로 올라왔습니다. 숙제 수행률은 88%로, 첫 2주보다 마지막 2주에 더 꾸준해졌습니다. 10월에는 관계사 복습과 함께 빈칸 추론 유형을 집중적으로 다룰 예정입니다.",
    teacherMemo: '관계사 실수 많음. 숙제를 대충 해 옴.',
    softened:
      "문법은 관계사 단원에서 실수가 잦았지만, 마지막 두 회차에는 이해도 '상'으로 올라왔습니다. 숙제도 처음보다 꾸준해졌습니다.",
  },
  fee: {
    total: 360000,
    setting: '8회차 · 선불 · 9월 14일 사이클',
    countedSessions: 8,
    unitPrice: 45000,
    cancellation: '없음 · 차감 없음',
    account: '국민 ****1492 한서윤',
  },
};

/** 목록의 리포트 id로 상세 미리보기를 만듭니다. 발송 완료 리포트는 읽기 전용 화면이 됩니다. */
export function previewReportDetailFor(id?: string): ReportDetail {
  const item = previewReports.reports.find((report) => report.id === id);
  if (!item) return previewReportDetail;
  return {
    ...previewReportDetail,
    id: item.id,
    studentName: item.studentName,
    periodStart: item.periodStart,
    periodEnd: item.periodEnd,
    status: item.status,
    sentAt: item.status === 'sent' ? '2026-10-01T09:00' : undefined,
    parentReadAt: item.parentReadAt,
  };
}
