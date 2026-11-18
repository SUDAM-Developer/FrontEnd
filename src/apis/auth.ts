import { API_URL } from '@/config/api';
import { request, setAccessToken } from './client';

/**
 * 카카오 로그인 시작 주소. 서버(Spring OAuth2)가 카카오 인증 → 콜백 처리 후
 * 프론트의 `/login/success` 또는 `/login/failure#code=...`로 돌려보냅니다.
 */
export const KAKAO_LOGIN_URL = `${API_URL}/oauth2/authorization/kakao`;

export type UserRole = 'TEACHER' | 'PARENT' | 'STUDENT';
/** 약관 동의 전 → 프로필 등록 전 → 가입 완료 */
export type OnboardingStatus = 'TERMS_REQUIRED' | 'PROFILE_REQUIRED' | 'ACTIVE';

export type Me = {
  role: UserRole;
  /** 프로필이 없으면 null */
  name: string | null;
  status: OnboardingStatus;
};

export function getMe(signal?: AbortSignal) {
  return request<Me>('/api/v1/users/me', { signal });
}

export async function logout() {
  try {
    await request<null>('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}
