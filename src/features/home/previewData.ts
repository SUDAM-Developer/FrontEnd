import type { HomeData } from './types';
/** SVG 검토용 데이터이며 실제 오늘 일정·입금 정보가 아닙니다. */
export const homePreviewData: HomeData = {
  teacherLabel: '한서윤 선생님 · 영어',
  dateLabel: '10월 1일 목요일',
  lessons: [
    {
      id: 'preview-home-1',
      studentName: '윤서아',
      description: '고1 · 영어',
      schedule: '월·수·금 18:00 ~ 19:30',
      sessionNumber: 5,
      completedCount: 4,
      totalCount: 5,
    },
    {
      id: 'preview-home-2',
      studentName: '박도윤',
      description: '고2 · 영어',
      schedule: '월·수·금 19:30 ~ 21:00',
      sessionNumber: 2,
      completedCount: 1,
      totalCount: 5,
    },
    {
      id: 'preview-home-3',
      studentName: '김나연',
      description: '중3 · 영어',
      schedule: '월·수·금 21:00 ~ 22:00',
      sessionNumber: 3,
      completedCount: 2,
      totalCount: 5,
    },
  ],
  tasks: [
    { id: 'records', label: '미기록 수업', count: 1 },
    { id: 'messages', label: '안 보낸 카톡', count: 0 },
    { id: 'reports', label: '발송 대기 정산 리포트', count: 0 },
    { id: 'income', label: '미입금', count: 1 },
  ],
};
