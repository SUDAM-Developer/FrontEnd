const WON_SUFFIX = '원';

export const onlyDigits = (text: string) => text.replace(/[^0-9]/g, '');

/** 금액 입력칸 표시값. "360000" → "360,000원", 빈 값은 "" */
export const formatWonInput = (digits: string) =>
  digits ? `${Number(digits).toLocaleString('ko-KR')}${WON_SUFFIX}` : '';

/**
 * "원"이 붙은 금액 입력칸에서 바뀐 글자를 숫자 문자열로 돌려줍니다.
 * "원"만 지운 경우에는 숫자가 그대로라 다시 "원"이 붙으므로, 마지막 숫자를 지웁니다.
 */
export function nextWonDigits(prev: string, text: string) {
  const digits = onlyDigits(text);
  if (prev && !text.endsWith(WON_SUFFIX) && digits === prev) return prev.slice(0, -1);
  return digits.replace(/^0+/, '');
}
