export type MakeupCandidate = { id: string; date: string; time: string };
export type MakeupLesson = {
  id: string;
  studentName: string;
  dateLabel: string;
  date: string;
  time: string;
  parentConsented: boolean;
  alreadyCancelled?: boolean;
};
export type CandidateShareResult = 'opened' | 'cancelled' | 'unavailable';
/** 화면 내부 모델입니다. 실제 API 계약은 확정 후 변환합니다. */
export type MakeupActions = {
  registerCancellation: (lessonId: string, signal: AbortSignal) => Promise<void>;
  shareCandidates: (
    lessonId: string,
    candidates: MakeupCandidate[],
    signal: AbortSignal,
  ) => Promise<CandidateShareResult>;
  rescheduleTime: (lessonId: string, time: string, signal: AbortSignal) => Promise<void>;
};
