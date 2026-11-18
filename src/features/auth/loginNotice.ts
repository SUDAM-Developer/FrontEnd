/**
 * 로그인 실패를 로그인 화면에 한 번만 알리기 위한 메모리 값입니다.
 * 주소(?error=)에 싣지 않으므로 새로고침하면 안내가 다시 뜨지 않습니다.
 */
let pendingFailure = false;

export function flagLoginFailure() {
  pendingFailure = true;
}

export function peekLoginFailure() {
  return pendingFailure;
}

export function clearLoginFailure() {
  pendingFailure = false;
}
