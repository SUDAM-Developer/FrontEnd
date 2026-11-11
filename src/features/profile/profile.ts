export const profileSubjects = ['국어', '영어', '수학', '과학', '사회', '기타'] as const;
export type ProfileValue = { name: string; subjects: string[] };
/** 화면 모델입니다. API 확정 후 요청 형식으로 변환합니다. */
export type SaveProfile = (profile: ProfileValue, signal: AbortSignal) => Promise<void>;
export function isValidProfileName(value: string) {
  const length = value.trim().length;
  return length >= 2 && length <= 10;
}
