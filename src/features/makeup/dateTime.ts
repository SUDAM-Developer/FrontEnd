import type { MakeupCandidate } from './types';
export function normalizeDate(value: string): string | null {
  const match = /^(\d{4})[.-](\d{1,2})[.-](\d{1,2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]),
    month = Number(match[2]),
    day = Number(match[3]);
  if (
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > new Date(Date.UTC(year, month, 0)).getUTCDate()
  )
    return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
export function validTime(value: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
export function timeLabel(value: string) {
  if (!validTime(value)) return '시간 선택';
  const [hour, minute] = value.split(':').map(Number);
  return `${hour < 12 ? '오전' : '오후'} ${hour % 12 || 12}시${minute ? ` ${minute}분` : ''}`;
}
export function candidateError(candidates: MakeupCandidate[]) {
  if (candidates.length < 1 || candidates.length > 3)
    return '보강 후보는 1~3개까지 선택할 수 있어요.';
  if (candidates.some((c) => !normalizeDate(c.date) || !validTime(c.time)))
    return '날짜와 시간을 골라주세요.';
  const keys = candidates.map((c) => `${normalizeDate(c.date)} ${c.time}`);
  if (new Set(keys).size !== keys.length) return '같은 날짜와 시간이 중복되지 않게 골라주세요.';
  return '';
}
export const times = Array.from(
  { length: 48 },
  (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
);
