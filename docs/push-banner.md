# 공통 PushBanner

`pushBanner.svg`, `pushBanner 표시 방식.svg`를 기준으로 앱 내부 상단 배너를 구현했습니다. OS 상태바는 그리지 않고 Safe Area 아래에 배너를 표시합니다. 기본 좌우 여백 10, 너비 최대 370, 최소 높이 82, 원본 아이콘·그림자를 적용했습니다.

## 구성

- `src/components/PushBanner.tsx`: 브랜드·시각·제목·본문과 탭/접근성 닫기 동작
- `src/features/notifications/PushBannerProvider.tsx`: 전역 표시, 자동 닫기, 순차 큐
- 루트 레이아웃에서 Provider 적용. 기존 화면 UI와 무관하게 `usePushBanner()` 호출 가능

```tsx
const { show, dismiss } = usePushBanner();
const id = show({
  id: 'lesson-ended-123',
  title: '윤서아 학생 수업이 끝났어요',
  message: '잊기 전에 8회차를 기록해 주세요',
  timeLabel: '지금',
  durationMs: 5000,
  onPress: () => {
    /* 확정된 화면 경로로 이동 */
  },
});
dismiss(id);
```

- 기본 표시 5초, `durationMs: 0`이면 유지. 시안에는 시간이 정해져 있지 않아 변경 가능하도록 구성
- 배너 탭 시 닫은 후 콜백 실행. 콜백이 없는 알림은 탭 시 닫기만 수행
- 여러 알림은 동시에 겹치지 않고 순서대로 표시. 동일 ID는 기존 항목 갱신. 최대 5개까지 보관하며 초과 신규 항목은 추가하지 않음
- 앱이 백그라운드이면 배너를 숨기고 타이머 정지, 복귀 시 현재 배너의 표시 시간을 다시 시작
- 자동 닫기와 AppState 구독은 Provider 종료 시 정리
- 원본처럼 닫기 X 버튼은 표시하지 않으며 접근성 닫기 동작을 제공

## 미리보기

`/dev/push-banner`에서 최초 시안 배너를 유지한 상태로 확인합니다. 배너 탭, 5초 자동 닫기, 순차 알림, 긴 문구 및 닫기를 확인할 수 있습니다. 개발 전용이며 production에서는 홈으로 이동합니다.

## API 연결 전 범위

푸시 API·FCM·APNs·Web Push·알림 권한·백그라운드/잠금화면 수신은 연결하지 않았습니다. 실제 수업 종료 시 자동으로 알림을 생성하지 않습니다. API/수신 이벤트 확정 후 안전하게 변환한 문자열과 화면 이동 콜백을 `show()`에 전달해야 합니다. API에서 받은 임의 URL을 직접 실행하지 않습니다.

이 배너는 일반 앱 화면 위의 인앱 오버레이입니다. OS 푸시 시스템을 흉내 내거나 네이티브 Modal 위 노출을 보장하는 구현이 아닙니다.
