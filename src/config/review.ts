/** 빌드 시에만 켜는 검토 전용 모드. 일반 배포에서는 예시 데이터·개발 경로를 열지 않습니다. */
export const IS_TEAM_REVIEW = process.env.EXPO_PUBLIC_TEAM_REVIEW === 'true';
export const CAN_PREVIEW = __DEV__ || IS_TEAM_REVIEW;
