# 화면 API 연동

기준: 2026-11-18, https://api.sudam.app/v3/api-docs

목록 DTO 확인: https://github.com/SUDAM-Developer/BackEnd/blob/dev/src/main/java/com/sudam/domain/report/dto/response/ReportDeliveryListResponse.java

## 연결한 화면

| 화면                  | API                                               |
| --------------------- | ------------------------------------------------- |
| 정산 리포트 목록      | GET /api/v1/reports/deliveries                    |
| 정산 리포트 상세      | GET /api/v1/reports/{reportId}                    |
| 선생님 이름           | GET /api/v1/users/me                              |
| 코멘트 조회·확인 저장 | GET / PUT /api/v1/reports/{reportId}/comment      |
| 교육비 안내           | GET /api/v1/reports/{reportId}/invoice            |
| 교육비 수정           | POST /api/v1/invoices/{invoiceId}/adjustments     |
| 수입·입금 현황        | GET /api/v1/invoices                              |
| 전액·일부 입금 확인   | POST /api/v1/invoices/{invoiceId}/payments        |
| 약관 동의             | POST /api/v1/users/me/terms-agreements            |
| 프로필 등록·수정      | POST / PUT /api/v1/users/me/profile               |
| 설정의 프로필 조회    | GET /api/v1/users/me/settings                     |
| 로그아웃·회원 탈퇴    | POST /api/v1/auth/logout, DELETE /api/v1/users/me |

앱의 기본 리포트·수입 경로는 검토 빌드에서도 실제 API만 사용합니다. 조회 실패를 예시 데이터나 빈 목록으로 바꾸지 않습니다. 설정 조회 응답의 부가 구독·이용권 필드는 기존 화면에 없는 항목이라 새 화면을 만들지 않았습니다.

## 인증

기존 클라이언트의 메모리 Access Token과 HttpOnly Refresh Token 쿠키를 사용합니다. 401이면 토큰 재발급을 한 번 시도하며 동시 요청은 재발급 요청을 공유합니다. 탭 진입·새로고침 시 내 정보로 로그인 상태를 복원합니다. 인증 실패 시 다시 시도·로그인 화면 이동을 제공합니다.

실제 서버의 인증 없는 리포트 조회는 401을 반환합니다. `Origin: https://sudam.app`에 대한 CORS와 credentials 허용을 읽기 전용으로 확인했습니다. 반면 `Origin: https://sudam-team-review.vercel.app`은 서버가 403으로 거절합니다. 검토용 도메인에서도 API를 사용하려면 서버 CORS 허용 목록에 추가해야 합니다. 실제 계정 로그인부터 저장까지의 서버 검증은 수행하지 않았습니다.

## 서버 값 표시

- settlementMonth는 백엔드 YearMonth(예: 2026-09)를 9월 정산으로 표시합니다. 현재 날짜로 재계산하지 않습니다. 목록에는 기간이 없어 각 리포트 상세의 period를 병렬 조회합니다.
- viewedAt이 null이면 열람 시각을 표시하지 않습니다.
- understandingLevel이 null이면 평균 이해도를 `-`로 표시합니다.
- 진도 startLabel/endLabel에 단위 문자열을 덧붙이지 않습니다.
- 인정 회차는 recognizedCount를 사용하고 null일 때만 settlementSessionCnt를 사용합니다.
- 계좌는 bankName + **** + accountLast4 + accountHolder로 표시합니다.
- 월 합계는 서버 summary를 사용하며 입금 확인 성공 후 다시 조회합니다.
- 코멘트 확인 체크는 PUT 저장 성공 뒤 서버 reviewed 값으로 표시합니다. 수정하면 확인을 해제합니다.
- 교육비도 수정 응답의 금액·인정 회차·계좌를 반영합니다.

## 입금 처리

`payments.amount`는 이미 받은 누적 금액이 아닌 **이번에 확인하는 추가 입금액**입니다. 전액 확인은 amount를 생략해 잔액 전부를 확인합니다. 일부 입금은 추가 금액을 입력하고 별도 버튼으로 저장합니다. 금액을 입력하는 동안 전액 확인·재전송 버튼을 비활성화합니다.

입금 안내 재전송과 금융 상태 변경은 별개입니다. 공유만으로 입금을 기록하지 않습니다. 처리 중 버튼과 닫기를 막고 중복 클릭을 차단합니다. 네트워크 단절로 성공 여부를 알 수 없는 상황의 서버 측 멱등성까지 보장하는 것은 아닙니다.

## 카카오톡 공유

`EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY`에 공개 JavaScript 키를 설정하고 카카오 개발자 콘솔에 사용 도메인을 등록해야 합니다. REST API 키·Admin 키를 사용하면 안 됩니다.

현재 공유 URL이 가리키는 학부모 `/l/{token}/reports/{reportId}`, `/l/{token}/invoices/{invoiceId}` 화면은 이 저장소에 없습니다. 특히 학부모 청구 조회 API는 아직 Swagger에 없습니다. 수신자가 열 수 없는 링크를 보내지 않도록 기본적으로 발송을 차단합니다. 학부모 화면을 연결한 뒤 `EXPO_PUBLIC_PARENT_LINKS_READY=true`를 설정해야 합니다.

설정과 학부모 링크 화면이 준비되면 `/shares`로 받은 제목·설명·URL·버튼 문구를 Kakao JavaScript SDK 기본 텍스트 템플릿에 전달합니다. 보호자가 여러 명이면 수신 링크 대상을 선택합니다.

- 리포트: 공유 창 호출 이후 POST /reports/{reportId}/send
- 입금 안내: 공유 창 호출 이후 POST /invoices/{invoiceId}/renotifications

공유 설정이 없거나 SDK 호출이 실패하면 발송 확인 API를 호출하지 않습니다. 현재 키 미설정 상태를 검증했으며 실제 카카오 메시지 전송은 검증하지 않았습니다. SDK의 공유 창 호출은 사용자의 실제 전송 완료를 보증하지 않으므로 서버는 이를 실제 수신 확인으로 취급하면 안 됩니다. 전송 성공을 엄밀하게 구분하려면 카카오 공유 웹훅 정책이 필요합니다.

참고: https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link

## 미확정 사항

1. Swagger에서 ReportDeliveryListResponse.items가 약관 Item(code/agreedAt)을 참조하는 문제는 공개 백엔드 dev 브랜치의 실제 DTO로 확인했습니다. 목록은 reportId, tutoringId, studentName, settlementMonth(YearMonth), status, sentAt, viewedAt, createdAt입니다. 기간은 상세 API로 조회합니다. 목록 건수만큼 상세 요청이 추가되므로 목록 API에 기간을 포함하면 요청을 줄일 수 있습니다.
2. 리포트 상세의 발송·열람 시각도 목록 응답을 함께 조회해 표시합니다. 시각이 null이면 미발송·미열람 상태로 표시합니다.
3. 약관 원문 문서·URL은 Swagger에 없습니다. 동의 저장 API는 연결했으나 확정 문서는 별도로 연결해야 합니다.
4. 홈·일정·학생·과외 생성·휴강·보강 조회/저장 API는 현재 명세에 없습니다. 기존 미연동 화면까지 실제 저장된 화면으로 취급하지 않습니다.
5. 수업 기록 저장 API는 있으나 화면에 주입할 실제 tutoringId, scheduleId, originalDate, textbookId 및 수업 조회 경로가 없습니다. 임시 ID나 화면 문자열을 변환해 저장하지 않습니다.

## 검증

- 타입 검사, ESLint, Prettier 검사
- 웹 내보내기
- 브라우저 응답 통제 검증: 인증 재발급, 서버 지정 정산 라벨, 상세·코멘트 저장 실패와 재시도, 교육비 수정 응답 반영, 공유 미설정 발송 차단, 일부·전액 입금, 중복 요청 방지, 목록 스키마 오류 표시, 약관·프로필 저장
- 실제 서버 테스트는 인증 없는 GET과 CORS 확인만 수행했습니다. 테스트를 위해 실제 입금·코멘트·회원 탈퇴를 실행하지 않았습니다.
