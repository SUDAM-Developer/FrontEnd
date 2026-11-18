import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { getMe } from '@/apis/auth';
import type { Me } from '@/apis/auth';
import { reissueAccessToken, setAccessToken } from '@/apis/client';
import { Loading } from '@/components/Loading';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { semantic } from '@/styles/colors';
import { flagLoginFailure } from './loginNotice';

/** 주소 # 뒤의 값을 읽습니다. 웹에서만 의미가 있습니다. */
function readHashParams() {
  if (Platform.OS !== 'web') return new URLSearchParams();
  return new URLSearchParams(window.location.hash.slice(1));
}

/** 온보딩 단계에 맞는 첫 화면 */
function destination(me: Me): Href {
  if (me.status === 'TERMS_REQUIRED') return '/terms';
  if (me.status === 'PROFILE_REQUIRED') return '/profile';
  return '/home';
}

/** 서버가 카카오 로그인을 마치고 돌려보내는 `/login/success` 화면 */
export function LoginSuccess() {
  const router = useRouter();
  const { setProfile } = useOnboarding();

  useEffect(() => {
    const controller = new AbortController();
    const token = readHashParams().get('accessToken');

    (async () => {
      // 서버가 주소에 액세스 토큰을 실어 보내면 쓰고, 아니면 리프레시 토큰 쿠키로 받습니다.
      if (token) setAccessToken(token);
      else await reissueAccessToken();
      const me = await getMe(controller.signal);
      if (controller.signal.aborted) return;
      if (me.status === 'ACTIVE' && me.name) {
        setProfile((current) => ({ ...current, name: me.name ?? current.name }));
      }
      // router.replace가 방문 기록의 현재 항목(토큰이 실린 주소)을 덮어씁니다.
      router.replace(destination(me));
    })().catch(() => {
      if (controller.signal.aborted) return;
      flagLoginFailure();
      router.replace('/login');
    });

    return () => controller.abort();
  }, [router, setProfile]);

  return (
    <View style={s.page}>
      <Loading visible />
    </View>
  );
}

/** 서버가 로그인 실패 시 돌려보내는 `/login/failure#code=...` 화면 */
export function LoginFailure() {
  const router = useRouter();

  useEffect(() => {
    // 서버가 #code=AUTH401_2 처럼 실패 사유를 보내지만, 화면 안내는 하나로 같습니다.
    flagLoginFailure();
    router.replace('/login');
  }, [router]);

  return <View style={s.page} />;
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: semantic.surface.input },
});
