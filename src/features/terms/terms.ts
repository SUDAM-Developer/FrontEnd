export const termsItems = [
  { id: 'service', label: '이용약관' },
  { id: 'privacy', label: '개인정보 수집·이용' },
  { id: 'contacts', label: '학부모·학생 연락처 처리' },
] as const;

export type TermId = (typeof termsItems)[number]['id'];
/** 화면 내부 모델입니다. 백엔드 요청 형식은 API 확정 후 변환합니다. */
export type TermsConsent = Record<TermId, boolean>;
export type SaveTerms = (consent: TermsConsent, signal: AbortSignal) => Promise<void>;
export type TermsDocuments = Partial<Record<TermId, string>>;
