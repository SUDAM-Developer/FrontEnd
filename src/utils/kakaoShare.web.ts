import type { ApiShareResponse } from '@/apis/models';
type KakaoSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: { sendDefault: (settings: unknown) => void };
};
declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}
let loading: Promise<void> | null = null;
export function prepareKakaoShare(): Promise<void> {
  const key = process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!key)
    return Promise.reject(
      new Error('카카오톡 공유 설정을 준비 중이에요. 아직 발송 처리하지 않았습니다.'),
    );
  if (process.env.EXPO_PUBLIC_PARENT_LINKS_READY !== 'true') {
    return Promise.reject(
      new Error('학부모가 열어볼 링크 화면을 준비 중이에요. 아직 발송 처리하지 않았습니다.'),
    );
  }
  loading ??= new Promise<void>((resolve, reject) => {
    const initialize = () => {
      try {
        if (!window.Kakao) throw new Error('카카오톡 공유를 불러오지 못했어요.');
        if (!window.Kakao.isInitialized()) window.Kakao.init(key);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    if (window.Kakao) {
      initialize();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js';
    script.integrity = 'sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj';
    script.crossOrigin = 'anonymous';
    script.onload = initialize;
    script.onerror = () => {
      script.remove();
      reject(new Error('카카오톡 공유를 불러오지 못했어요. 다시 시도해 주세요.'));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
/** 공유 창 호출 성공은 사용자의 실제 메시지 전송 완료를 보증하지 않습니다. */
export function openKakaoShare(share: ApiShareResponse) {
  if (!window.Kakao?.isInitialized()) throw new Error('카카오톡 공유를 준비하지 못했어요.');
  const url = new URL(share.url);
  if (url.protocol !== 'https:') throw new Error('공유 링크를 확인할 수 없어요.');
  window.Kakao.Share.sendDefault({
    objectType: 'text',
    text: `${share.title}\n${share.description}`,
    link: { mobileWebUrl: share.url, webUrl: share.url },
    buttonTitle: share.buttonTitle,
  });
}
