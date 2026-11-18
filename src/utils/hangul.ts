const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

const CHOSEONG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNGSEONG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONGSEONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];

/** 겹받침·겹모음은 타자 순서대로 낱자로 풉니다. (예: ㄶ → ㄴㅎ, ㅘ → ㅗㅏ) */
const SPLIT: Record<string, string> = {
  ㄳ: 'ㄱㅅ',
  ㄵ: 'ㄴㅈ',
  ㄶ: 'ㄴㅎ',
  ㄺ: 'ㄹㄱ',
  ㄻ: 'ㄹㅁ',
  ㄼ: 'ㄹㅂ',
  ㄽ: 'ㄹㅅ',
  ㄾ: 'ㄹㅌ',
  ㄿ: 'ㄹㅍ',
  ㅀ: 'ㄹㅎ',
  ㅄ: 'ㅂㅅ',
  ㅘ: 'ㅗㅏ',
  ㅙ: 'ㅗㅐ',
  ㅚ: 'ㅗㅣ',
  ㅝ: 'ㅜㅓ',
  ㅞ: 'ㅜㅔ',
  ㅟ: 'ㅜㅣ',
  ㅢ: 'ㅡㅣ',
};

const split = (jamo: string) => SPLIT[jamo] ?? jamo;

/**
 * 한글을 타자 순서의 낱자로 풉니다. 입력 중인 글자로도 검색되게 할 때 씁니다.
 * 예: '신한은행' → 'ㅅㅣㄴㅎㅏㄴㅇㅡㄴㅎㅐㅇ', 입력 중인 '신한읂' → 'ㅅㅣㄴㅎㅏㄴㅇㅡㄴㅎ'
 */
export function toJamo(text: string) {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code < HANGUL_START || code > HANGUL_END) {
      result += split(char);
      continue;
    }
    const offset = code - HANGUL_START;
    result +=
      CHOSEONG[Math.floor(offset / 588)] +
      split(JUNGSEONG[Math.floor((offset % 588) / 28)]) +
      split(JONGSEONG[offset % 28]);
  }
  return result;
}
