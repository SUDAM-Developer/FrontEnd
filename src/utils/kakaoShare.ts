import type { ApiShareResponse } from '@/apis/models';
/** 네이티브 공유 방식은 별도 설정이 필요합니다. */
export async function prepareKakaoShare(): Promise<void> {
  throw new Error('카카오톡 공유는 웹에서 이용해 주세요.');
}
export function openKakaoShare(share: ApiShareResponse): void {
  void share;
  throw new Error('카카오톡 공유는 웹에서 이용해 주세요.');
}
