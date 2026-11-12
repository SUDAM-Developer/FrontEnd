export type Understanding = '상' | '중' | '하';
export type HomeworkStatus = '완료' | '일부' | '안함';
export type CancellationReason = '학생 당일 취소' | '학생 사전 취소' | '선생님 사정' | '공휴일';
export type Textbook = {
  id: string;
  name: string;
  unit: string;
  previousProgress?: string;
  suggestions: string[];
};
export type LessonContext = {
  lessonId: string;
  studentName: string;
  dateLabel: string;
  sessionNumber: number;
  completedCount: number;
  totalCount: number;
  sameDayCancellationCounts: boolean;
  parentConsented: boolean;
  teacherLabel: string;
  textbooks: Textbook[];
  homeworkSuggestions: string[];
};
/** 화면 내부 모델이며 확정된 API 요청·응답 형식이 아닙니다. */
export type BookProgress = { book: Textbook; value: string; skipped: boolean };
export type SessionRecord = {
  lessonId: string;
  progress: BookProgress[];
  understanding: Understanding;
  previousHomework: HomeworkStatus;
  nextHomework: string;
  observation: string;
};
export type CancellationInput = { lessonId: string; reason: CancellationReason };
export type CancellationResult = {
  reason: CancellationReason;
  counted: boolean;
  completedCount: number;
  totalCount: number;
  parentConsented: boolean;
};
export type SessionRecordResult = {
  completedCount: number;
  totalCount: number;
  reportReady: boolean;
};
export type RecordShareTarget = 'parent-summary' | 'student-homework';
export type SaveRecord = (
  record: SessionRecord,
  signal: AbortSignal,
) => Promise<SessionRecordResult>;
export type SaveCancellation = (
  input: CancellationInput,
  signal: AbortSignal,
) => Promise<CancellationResult>;
