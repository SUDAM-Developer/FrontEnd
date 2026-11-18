/** API 서버 주소. 설정하지 않으면 운영 서버를 사용합니다. */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://api.sudam.app').replace(
  /\/$/,
  '',
);
