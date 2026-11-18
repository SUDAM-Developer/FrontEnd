import gradientImage from '../../../assets/images/login-gradient.svg';
import kakaoSymbol from '../../../assets/images/kakao-symbol.svg';
import logoSymbol from '../../../assets/images/login-logo-symbol.svg';
import sudamWordmark from '../../../assets/images/login-sudam.svg';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { KAKAO_LOGIN_URL } from '@/apis/auth';
import { Loading } from '@/components/Loading';
import { semantic } from '@/styles/colors';
import { gap, grid, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { clearLoginFailure, peekLoginFailure } from './loginNotice';

/** 카카오 로그인 디자인 가이드의 브랜드 색입니다. 서비스 토큰이 아니라 고정값으로 둡니다. */
const KAKAO_YELLOW = '#FEE500';

/**
 * 시안(390×844, 상태 표시줄 56 제외)의 세로 여백 비율입니다.
 * 로고 위 126 · 로고와 카피 사이 126 · 카피와 버튼 영역 사이 163을 화면 높이에 맞춰 나눠 가집니다.
 */
const SPACE = { top: 126, middle: 126, bottom: 163 } as const;

/**
 * 카카오 로그인을 시작합니다. 웹은 서버 로그인 주소로 페이지를 옮기므로 돌아오지 않고,
 * 결과는 `/login/success`·`/login/failure`에서 처리합니다.
 * 미리보기처럼 화면 안에서 끝나는 경우 resolve 되면 약관 동의로 이동하고, 'cancelled'면 그대로 머뭅니다.
 */
export type KakaoLogin = (signal: AbortSignal) => Promise<void | 'cancelled'>;

const startKakaoLogin: KakaoLogin = () => {
  if (Platform.OS !== 'web') {
    // TODO: 앱(iOS·Android)은 서버가 앱 스킴으로 돌려보내는 방식이 정해진 뒤 연결합니다.
    return Promise.reject(new Error('Kakao login is only available on web'));
  }
  window.location.assign(KAKAO_LOGIN_URL);
  return new Promise<never>(() => {});
};

type Props = {
  /** 미리보기에서 로그인 결과를 흉내 낼 때만 넘깁니다. */
  onLogin?: KakaoLogin;
};

export default function LoginScreen({ onLogin = startKakaoLogin }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(peekLoginFailure);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    mounted.current = true;
    clearLoginFailure();
    // 카카오 화면에서 뒤로 가기로 돌아오면 브라우저가 이전 상태(로딩 중)를 그대로 복원하므로 풀어 줍니다.
    const restore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      inFlight.current = false;
      setLoading(false);
    };
    if (Platform.OS === 'web') window.addEventListener('pageshow', restore);
    return () => {
      mounted.current = false;
      controller.current?.abort();
      if (Platform.OS === 'web') window.removeEventListener('pageshow', restore);
    };
  }, []);

  async function login() {
    if (inFlight.current) return;
    inFlight.current = true;
    setFailed(false);
    const request = new AbortController();
    controller.current = request;
    try {
      setLoading(true);
      const result = await onLogin(request.signal);
      if (result === 'cancelled') return;
      if (!mounted.current || request.signal.aborted) return;
      router.replace('/terms');
    } catch {
      if (mounted.current && !request.signal.aborted) setFailed(true);
    } finally {
      inFlight.current = false;
      if (mounted.current) setLoading(false);
    }
  }

  return (
    <View style={s.root}>
      <Image
        source={gradientImage}
        style={StyleSheet.absoluteFill}
        contentFit="fill"
        accessible={false}
      />
      <SafeAreaView style={s.safeArea}>
        <View style={s.phone}>
          <ScrollView style={s.scroll} contentContainerStyle={s.body} bounces={false}>
            <View style={[s.spacer, { flexGrow: SPACE.top }]} />
            <View accessible accessibilityLabel="SUDAM" style={s.brand}>
              <Image source={logoSymbol} style={s.symbol} contentFit="contain" />
              <Image source={sudamWordmark} style={s.wordmark} contentFit="contain" />
            </View>
            <View style={[s.spacer, { flexGrow: SPACE.middle }]} />
            <View style={s.copy}>
              <Text role="heading" style={s.headline}>
                {'선생님은 수업만,\n나머지는 수담이'}
              </Text>
              <Text style={s.subline}>첫 수업부터 마지막 정산까지</Text>
            </View>
            <View style={[s.spacer, { flexGrow: SPACE.bottom }]} />
          </ScrollView>
          <View style={s.footer}>
            <Pressable
              role="button"
              accessibilityLabel="카카오로 시작하기"
              disabled={loading}
              aria-busy={loading || undefined}
              onPress={() => void login()}
              style={({ pressed }) => [s.kakao, pressed && s.kakaoPressed]}
            >
              <Image source={kakaoSymbol} style={s.kakaoSymbol} accessible={false} />
              <Text style={s.kakaoLabel}>카카오로 시작하기</Text>
            </Pressable>
            <View style={s.feedbackSlot}>
              {failed && (
                <View role="alert" accessibilityLiveRegion="assertive" style={s.toast}>
                  <Text style={s.toastText}>로그인하지 못했어요</Text>
                  <Pressable
                    role="button"
                    accessibilityLabel="카카오 로그인 다시 시도"
                    onPress={() => void login()}
                    style={s.retry}
                  >
                    <Text style={s.retryText}>다시 시도</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Loading visible={loading} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface.input },
  safeArea: { flex: 1, alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  scroll: { flex: 1 },
  // 화면이 아주 낮으면 여백이 최소값까지 줄어든 뒤 스크롤됩니다.
  body: { flexGrow: 1, alignItems: 'center' },
  spacer: { flexShrink: 1, flexBasis: 0, minHeight: 24 },
  brand: { alignItems: 'center' },
  // 시안에서 심볼은 -0.84° 기울어져 있고 워드마크와 9px 떨어져 있습니다.
  symbol: { width: 116.667, height: 119.362, transform: [{ rotate: '-0.84deg' }] },
  wordmark: { width: 116.667, height: 24.707, marginTop: 9, marginLeft: 2.5 },
  copy: { alignItems: 'center', gap: gap[20] },
  headline: {
    ...typography.body[1].bold,
    color: semantic.text.default.neutral,
    textAlign: 'center',
  },
  subline: {
    ...typography.body[4].medium,
    color: semantic.text.default.weak,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: grid.margin,
    paddingTop: padding[20],
    paddingBottom: padding[20],
    gap: gap[12],
  },
  kakao: {
    width: '100%',
    maxWidth: 334,
    alignSelf: 'center',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap[28],
    // 시안은 좌우 80 고정이지만 좁은 화면에서도 한 줄로 들어가도록 가운데 정렬합니다.
    justifyContent: 'center',
    paddingHorizontal: padding[16],
    borderRadius: radius.small,
    backgroundColor: KAKAO_YELLOW,
  },
  kakaoPressed: { opacity: 0.8 },
  kakaoSymbol: { width: 24, height: 24 },
  kakaoLabel: { ...typography.body[1].semiBold, color: semantic.text.default.neutral },
  feedbackSlot: { height: 24, alignItems: 'center', justifyContent: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.surface.inverse,
    borderRadius: radius.full,
    paddingLeft: padding[12],
    gap: gap[8],
  },
  toastText: { ...typography.caption[1].regular, color: semantic.text.default.inverse },
  retry: { minHeight: 32, justifyContent: 'center', paddingRight: padding[12] },
  retryText: {
    ...typography.caption[1].semiBold,
    color: semantic.text.default.inverse,
    textDecorationLine: 'underline',
  },
});
