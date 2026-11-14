/** 숫자만 남기고 010-1234-5678 꼴(3-4-4)로 하이픈을 넣습니다. 11자리를 넘는 숫자는 버립니다. */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 01X 뒤에 8자리가 붙은 11자리 휴대폰 번호인지 봅니다. */
export function isValidPhone(input: string): boolean {
  return /^01\d{9}$/.test(input.replace(/\D/g, ''));
}

export const INVALID_PHONE_MESSAGE = '휴대폰 번호는 8자리로 입력해주세요';
