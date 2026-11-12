# T-10 회차 기록 · 휴강 시트 · 휴강 완료

## 구현 범위

제공된 회차 기록 6개, 휴강 시트 2개, 휴강 완료 2개 SVG를 기준으로 구현했습니다. 홈·과외 생성 등 다른 담당 화면은 수정하지 않았습니다.

- `SessionRecordScreen`: 교재별 진도, 직접 입력, 새 교재 등록·삭제, 이해도, 지난 숙제 수행, 다음 숙제, 관찰 한줄
- 교재 진도(또는 안 함), 이해도, 지난 숙제 수행이 필수입니다. 등록 중인 교재가 있으면 저장을 막습니다.
- 지난 진도가 없는 교재는 제안 칩 대신 직접 입력을 표시합니다. 교재가 하나도 없는 경우 등록 폼으로 시작합니다.
- 새 교재는 이름과 진도 단위를 입력해 등록하며 시작 진도는 선택 사항입니다. API 확정 전 화면 입력 규칙입니다.
- 저장 중 입력·선택·중복 제출 차단, 실패 시 전체 입력 유지 및 다시 저장
- `CancellationSheet`: 사유 단일 선택, 배경 터치·기기 뒤로 가기로 닫기, 저장 중 닫기 차단, 실패 후 재시도
- `CancellationComplete`: 저장 결과의 인정 회차·사유 표시, 학부모 수신 동의가 없으면 보강 조율 버튼 미노출
- `ActionButton`, `Chip`, `TextInput`, `Loading` 재사용. 균등 폭 선택 그룹과 유동 폭 진도 막대는 별도 구현했습니다. 공통 SelectButton·ProgressBar는 고정 너비라 이 화면 배치와 맞지 않습니다.

## API와 다른 화면 연결

실제 API·저장·알림 발송·보강 일정 생성은 연결하지 않았습니다. 서비스에서 사용할 때 `LessonContext`, `onSaveRecord`, `onSaveCancellation`, `onHome`, `onCoordinate`를 전달합니다. 저장 콜백은 필수이며 암묵적으로 성공을 반환하지 않습니다. `CancellationResult`의 회차 인정·누적 회차는 백엔드 응답을 연결하도록 구분했습니다.

화면 모델은 백엔드 계약이 아닙니다. `preview.tsx`만 확인용 학생·교재·날짜와 지연/실패를 생성합니다. 회차 인정 예시는 SVG 문구에 따라 학생 당일 취소 + 인정 정책인 경우만 증가합니다. 실제 정책은 백엔드 확인이 필요합니다. 시안의 숫자는 예시이므로 완료 화면의 숫자는 전달받은 결과를 표시합니다.

## 개발 전용 확인 경로

- `/dev/session-record`: 첫 수업, 시안의 선택 예시
- `/dev/session-record?variant=blank`: 필수 항목 미선택, 저장 비활성
- `/dev/session-record?variant=empty`: 교재·지난 진도 없음, 직접 등록/입력
- `/dev/session-record?variant=later`: 2회차
- `/dev/session-record?variant=direct`: 다음 숙제 직접 입력
- `/dev/session-record?scenario=loading`: 저장 시 3초 로딩
- `/dev/session-record?scenario=error`: 첫 저장 실패, 다시 저장 성공
- `/dev/session-cancellation`: 사유 미선택 시트
- `/dev/session-cancellation?scenario=loading`: 사유 선택 후 저장 중
- `/dev/session-cancellation?policy=count`: 학생 당일 취소 시 회차 인정 예시
- `/dev/session-cancellation?scenario=error`: 첫 저장 실패 후 재시도
- `/dev/session-complete`: 수신 동의 있는 완료 화면
- `/dev/session-complete?consent=no`: 학부모 수신 동의 전
- `/dev/session-complete?policy=count&reason=sameDay`: 회차 인정 예시

모든 개발 경로는 production에서 `/home`으로 이동합니다. 실제 저장 성공·메시지 전송을 검증하는 기능이 아닙니다. 새 기능은 로그인·홈 흐름에 연결하지 않았습니다.

## 기록 완료 화면 v4

- 수업 저장 성공 시 팝업 대신 RecordComplete로 이동합니다. 실패 시에는 입력 화면을 유지합니다.
- `/dev/session-record-complete`: 4회차 완료·인정 8/8·정산 준비 완료 예시를 바로 확인합니다.
- 완료 회차·학생명·숙제는 전달된 데이터로 표시하며 정산 준비 여부는 저장 결과의 reportReady를 따릅니다.
- 다음 숙제가 없으면 학생용 카카오 공유 버튼을 비활성화합니다. 정산이 준비되지 않으면 정산 리포트 버튼을 비활성화합니다.
- 카카오 SDK·공유 템플릿·홈 알림 저장·정산 리포트 생성은 미연결입니다. 미리보기 버튼은 미연동 안내만 표시하며 실제 공유·청구를 수행하지 않습니다.
- 실제 서비스 연결 시 onShare 및 onReport 콜백을 전달해야 합니다.
