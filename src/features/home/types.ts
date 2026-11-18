export type HomeLesson = {
  id: string;
  studentName: string;
  description: string;
  schedule: string;
  sessionNumber: number;
  completedCount: number;
  totalCount: number;
};
export type HomeTask = {
  id: 'records' | 'messages' | 'reports' | 'income';
  label: string;
  count: number;
};
export type HomeData = {
  teacherLabel: string;
  dateLabel: string;
  lessons: HomeLesson[];
  tasks: HomeTask[];
  /** false는 조회 미연결 상태이며, 실제 수업·할 일이 0건이라는 의미가 아닙니다. */
  scheduleAvailable?: boolean;
  tasksAvailable?: boolean;
};
