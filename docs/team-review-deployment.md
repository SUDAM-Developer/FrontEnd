# 팀 검토용 Vercel 임시 배포

검토 전용 Vercel 프로젝트 `sudam-team-review`를 사용합니다. GitHub 저장소 `SUDAM-Developer/FrontEnd`의 `develop` 브랜치에 머지·푸시하면 자동 배포되며, 빌드 성공 후 https://sudam-team-review.vercel.app 에 반영됩니다.

배포 설정 PR은 현재 검토 사이트에 포함된 PR #10(보강 조율), #11(수입·알림·하단 탭) 변경사항에 의존합니다. 해당 PR을 먼저 리뷰·머지한 후 배포 설정 PR을 머지합니다. PR 생성만으로 develop이나 현재 운영 주소가 변경되지는 않습니다.

- `npm run build`: 일반 웹 빌드. 검토 플래그가 없으면 기존 production 제한 유지
- `npm run build:review -- --clear`: 검토 빌드. 공개 가능한 예시 데이터와 미리보기 경로 허용
- `EXPO_PUBLIC_TEAM_REVIEW=true`: 검토 전용 빌드에서만 설정. 공개되는 값이며 보안/인증 수단이 아님
- `/` 및 이전 `/review` → `/terms`: 앱의 원래 진입 흐름인 약관 → 프로필 → 홈·하단 탭 사용. 별도 화면 목록 페이지는 제공하지 않음
- 보강 조율, 약관·프로필, 회차 기록·완료, 수입 상태, 배너 모두 확인 가능
- 배너는 기본 검토 링크에서는 시안만 표시하고, `controls=1`일 때 동작 확인 도구 표시
- 브라우저 새로고침/직접 경로 접근을 위한 Vercel SPA rewrite 구성
- 검색 제외 요청을 위한 X-Robots-Tag: noindex, nofollow. 접근 제어를 제공하는 기능은 아님
- 실제 API·메시지 발송·결제·입금 확인은 연결하지 않음
- `.env`와 Git 메타데이터 등은 업로드에서 제외. 정식 도메인은 연결하지 않음

Vercel에서는 Build Command `npm run build`, Output Directory `dist`, 검토 프로젝트에만 Build 환경 변수 `EXPO_PUBLIC_TEAM_REVIEW=true`를 사용합니다. 로컬에선 `build:review` 스크립트로 같은 빌드를 생성합니다. 검토용 URL의 접근 보호 설정은 Vercel 프로젝트에서 별도로 관리합니다.

검토 모드에서는 메모리에 검토용 프로필을 초기 설정해 수입 탭 직접 접속·새로고침에도 가입 화면으로 돌아가지 않습니다. 일반 빌드에서는 초기 프로필이 비어 있는 기존 동작을 유지합니다.

화면 목록 방식은 사용자 요청에 따라 제거했습니다. 이미 구현된 앱 화면을 직접 배포하며, 현재 미구현인 홈·일정·정산 리포트 등의 준비 중 표시는 유지합니다. 화면별 확인용 직접 경로는 남아 있지만 기본 서비스 진입에는 노출하지 않습니다.
