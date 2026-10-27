# SUDAM - Frontend

> CEOS 24th

## 로컬 실행

Node.js 버전은 `.nvmrc`를 기준으로 맞춥니다.

```bash
npm ci
npm start
```

- 웹: `npm run web`
- iOS Simulator: `npm run ios` (macOS 및 Xcode 필요)
- Android: `npm run android` (에뮬레이터 또는 연결된 기기 필요)
- 실제 기기: 개발 서버가 안내하는 QR을 호환 버전의 Expo Go에서 스캔

## 커밋 전 검증

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Workflow

```text
Issue 생성
→ develop에서 작업 브랜치 생성
→ 작업 및 커밋
→ lint, format, build 검증
→ PR 생성
→ 리뷰 및 수정
→ develop 병합
→ 작업 브랜치 삭제

배포 또는 최종 제출 시
develop → main 대상 PR 생성
→ 검토 및 병합
```

- 일반 작업 PR의 대상 브랜치는 `develop`입니다.
- `main`에는 배포 또는 최종 제출 가능한 안정 버전만 병합합니다.

## 협업 규칙

### Issue 규칙

Issue 제목은 아래 형식을 따릅니다.

```text
[TYPE] 작업 내용
```

예: `[FEAT] 로그인 화면 구현`

`[FEAT]`, `[FIX]`, `[REFACTOR]`, `[DOCS]`, `[CHORE]`, `[TEST]` 중 작업 성격에 맞는 Type을 사용합니다.

- 기능 개발은 Feature 템플릿, 버그 수정은 Bug 템플릿을 사용합니다.
- 작업 범위와 완료 조건을 작성하고, 관련 Figma, 기획 문서, API 명세 링크를 첨부합니다.
- Issue 생성 후 담당자를 지정하고 작업을 시작합니다.

### Branch 규칙

브랜치는 아래 형식을 따릅니다.

```text
type/이슈번호-작업내용
```

| Type       | 의미                       | 예시                        |
| ---------- | -------------------------- | --------------------------- |
| `feat`     | 새로운 기능 개발           | `feat/1-signup`             |
| `fix`      | 버그 수정                  | `fix/2-login-error`         |
| `docs`     | 문서 수정                  | `docs/3-readme`             |
| `refactor` | 코드 리팩토링              | `refactor/4-member-service` |
| `chore`    | 설정, 빌드, 기타 작업      | `chore/5-github-template`   |
| `test`     | 테스트 코드 작성 또는 수정 | `test/6-member-service`     |

작업 내용은 소문자와 하이픈(`-`)을 사용해 작성합니다.

### Commit 규칙

커밋 메시지는 아래 형식을 따릅니다.

```text
type: 작업 내용
```

예: `feat: 로그인 화면 구현`

| Type       | 의미                               |
| ---------- | ---------------------------------- |
| `feat`     | 새로운 기능 추가                   |
| `fix`      | 버그 수정                          |
| `docs`     | 문서 수정                          |
| `style`    | 코드 포맷팅 등 기능 변화 없는 수정 |
| `refactor` | 코드 리팩토링                      |
| `test`     | 테스트 코드 추가 또는 수정         |
| `chore`    | 빌드, 패키지, 설정 등 기타 작업    |
| `rename`   | 파일 또는 폴더명 변경              |
| `remove`   | 파일 또는 폴더 삭제                |

커밋은 하나의 목적을 갖도록 작게 나눕니다.

```text
feat: 로그인 페이지 구현
fix: 검색 결과 빈 상태 처리
```

### PR 규칙

PR 제목은 Issue와 같은 형식을 사용합니다.

```text
[TYPE] 작업 내용
```

- 일반 작업 PR은 `develop` 브랜치를 대상으로 생성합니다.
- PR 본문에 `Closes #이슈번호`를 작성해 Issue를 연결합니다.
- 주요 변경 사항, 실제 검증 결과, 리뷰어가 확인할 내용을 작성합니다.
- UI 변경이 있다면 스크린샷 또는 화면 녹화를 첨부합니다.
- 하나의 PR은 하나의 작업 목표를 다룹니다.

## Expo 프로젝트 구성

Expo SDK 58 + React Native + Expo Router를 사용합니다.
웹 번들러는 Metro이며, 기존 Vite와 React Router 실행 설정은 제거했습니다.

```text
assets/images/               # 웹·모바일 공통 로고 및 아이콘
src/app/_layout.tsx          # 라우터, Safe Area, 공유 상태 Provider
src/app/index.tsx            # 시작
src/app/terms.tsx            # 약관 동의
src/app/profile.tsx          # 프로필 작성 및 수정
src/app/settings.tsx         # 설정
src/features/onboarding/    # 화면 UI 및 데모 공유 상태
app.json                    # Expo 앱 설정
```

### 현재 구현 범위

- 시작 → 약관 동의 → 프로필 → 설정 화면
- 필수 약관 선택, 이름 필수 입력, 과목 복수 선택, 프로필 수정
- Expo Image로 번들에 포함된 SVG를 표시하며 웹 전용 절대 경로를 사용하지 않습니다.
- Safe Area 및 iOS 키보드 회피 처리
- 프로필·동의 상태는 메모리에만 보관하며 새로고침 또는 앱 재시작 시 초기화됩니다.
- 소셜 로그인, 이메일 인증, 비밀번호 재설정, 실제 계정 삭제는 API 연동 전입니다.
- 이메일 가입 및 소셜 로그인 창의 데모 버튼은 인증 없이 화면 흐름을 확인하는 용도입니다.
- 약관 원문은 아직 연결하지 않았으며 실제 가입 동의로 사용하면 안 됩니다.
- API 주소는 `.env.example`의 `EXPO_PUBLIC_API_URL` 형식을 사용합니다.

### 웹 배포

```bash
npm run build
```

정적 호스팅의 빌드 명령은 `npm run build`, 배포 폴더는 `dist`입니다.
`web.output`은 `single`이며 모든 경로를 `index.html`로 연결하는 SPA fallback이 필요합니다.

### 네이티브 번들 검증 및 앱 빌드

```bash
npm run export:ios
npm run export:android
```

위 명령은 JavaScript·에셋 번들 검증이며 설치 가능한 앱 파일을 생성하지 않습니다.
실제 앱 배포에는 앱 식별자, 서명 및 EAS Build 등 별도 구성이 필요합니다.
`ios/`, `android/`, `.expo/`는 생성 파일이므로 저장소에서 관리하지 않습니다.

### 의존성 진단 참고

Expo Doctor 검사를 통과했습니다. npm audit는 Expo CLI의 Zod 3 전이 의존성에서
보안 권고(GHSA-mrhx-c7xc-m3w5)를 보고합니다. CLI가 Zod 3 API를 사용하므로
강제로 Zod 4로 올리지 않았으며, 호환되는 상위 패키지 패치가 필요합니다.
