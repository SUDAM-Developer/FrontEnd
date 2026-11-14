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
};
