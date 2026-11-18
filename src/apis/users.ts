import { request, setAccessToken } from './client';
import type { ApiSettingsResponse } from './models';
import type { ProfileValue } from '@/features/profile/profile';
import type { TermsConsent } from '@/features/terms/terms';
const subjectCodes: Record<string, string> = {
  국어: 'KOREAN',
  영어: 'ENGLISH',
  수학: 'MATH',
  과학: 'SCIENCE',
  사회: 'SOCIAL',
};
export const getSettings = (signal?: AbortSignal) =>
  request<ApiSettingsResponse>('/api/v1/users/me/settings', { signal });
export async function saveTerms(consent: TermsConsent, signal: AbortSignal) {
  const termsCodes = [
    consent.service && 'SERVICE',
    consent.privacy && 'PRIVACY',
    consent.contacts && 'CONTACT',
  ].filter(Boolean);
  await request('/api/v1/users/me/terms-agreements', {
    method: 'POST',
    body: { termsCodes },
    signal,
  });
}
export async function saveProfile(profile: ProfileValue, editing: boolean, signal: AbortSignal) {
  const other = profile.subjects.filter((subject) => !subjectCodes[subject]);
  const subjectOther = other.join(', ');
  if (subjectOther.length > 20) throw new Error('기타 과목은 20자 이내로 입력해 주세요.');
  await request('/api/v1/users/me/profile', {
    method: editing ? 'PUT' : 'POST',
    body: {
      name: profile.name,
      subjects: [...new Set(profile.subjects.map((subject) => subjectCodes[subject] ?? 'OTHER'))],
      ...(other.length ? { subjectOther } : {}),
    },
    signal,
  });
}
export async function deleteAccount() {
  await request('/api/v1/users/me', { method: 'DELETE' });
  setAccessToken(null);
}
