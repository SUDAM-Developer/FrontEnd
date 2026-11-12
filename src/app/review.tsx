import { Redirect } from 'expo-router';

// 이전 공유 주소도 앱의 기본 진입 화면으로 연결합니다.
export default function ReviewRedirect() {
  return <Redirect href="/terms" />;
}
