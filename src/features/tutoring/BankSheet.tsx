import busanLogo from '../../../assets/images/banks/busan.png';
import citiLogo from '../../../assets/images/banks/citi.png';
import cuLogo from '../../../assets/images/banks/cu.png';
import gwangjuLogo from '../../../assets/images/banks/gwangju.png';
import hanaLogo from '../../../assets/images/banks/hana.png';
import ibkLogo from '../../../assets/images/banks/ibk.png';
import imbankLogo from '../../../assets/images/banks/imbank.png';
import jejuLogo from '../../../assets/images/banks/jeju.png';
import kakaobankLogo from '../../../assets/images/banks/kakaobank.jpg';
import kbankLogo from '../../../assets/images/banks/kbank.png';
import kdbLogo from '../../../assets/images/banks/kdb.png';
import kfccLogo from '../../../assets/images/banks/kfcc.png';
import kookminLogo from '../../../assets/images/banks/kookmin.png';
import kyongnamLogo from '../../../assets/images/banks/kyongnam.png';
import nfcfLogo from '../../../assets/images/banks/nfcf.png';
import nonghyupLogo from '../../../assets/images/banks/nonghyup.png';
import postLogo from '../../../assets/images/banks/post.png';
import savingsLogo from '../../../assets/images/banks/savings.png';
import scLogo from '../../../assets/images/banks/sc.png';
import shinhanLogo from '../../../assets/images/banks/shinhan.png';
import suhyupLogo from '../../../assets/images/banks/suhyup.png';
import tossbankLogo from '../../../assets/images/banks/tossbank.png';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { semantic } from '@/styles/colors';
import { gap, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';

type BankInfo = {
  name: string;
  /** 로고가 없으면 이름 첫 글자를 대신 보여 줍니다. */
  logo?: number;
  /** 디자인에서 로고를 칸에 맞추는 방식입니다. 대부분 cover, 일부 로고는 contain입니다. */
  fit?: 'cover' | 'contain';
};

/**
 * 입력값 규칙의 은행 목록 순서입니다. 전북은 디자인에서 광주 로고를 씁니다.
 * TODO: 기타는 디자인에 없어 로고 대신 이름 첫 글자를 보여 줍니다. 로고가 나오면 바꿉니다.
 */
export const BANKS = [
  { name: '국민', logo: kookminLogo, fit: 'contain' },
  { name: '신한', logo: shinhanLogo },
  { name: '하나', logo: hanaLogo },
  { name: '농협', logo: nonghyupLogo },
  { name: '기업', logo: ibkLogo },
  { name: 'SC제일', logo: scLogo, fit: 'contain' },
  { name: '씨티', logo: citiLogo },
  { name: '카카오뱅크', logo: kakaobankLogo },
  { name: '토스뱅크', logo: tossbankLogo },
  { name: '케이뱅크', logo: kbankLogo },
  { name: 'iM뱅크(대구)', logo: imbankLogo },
  { name: '부산', logo: busanLogo },
  { name: '경남', logo: kyongnamLogo },
  { name: '광주', logo: gwangjuLogo, fit: 'contain' },
  { name: '전북', logo: gwangjuLogo },
  { name: '제주', logo: jejuLogo },
  { name: '수협', logo: suhyupLogo, fit: 'contain' },
  { name: '산업', logo: kdbLogo },
  { name: '새마을금고', logo: kfccLogo, fit: 'contain' },
  { name: '신협', logo: cuLogo, fit: 'contain' },
  { name: '우체국', logo: postLogo },
  { name: '저축은행', logo: savingsLogo },
  { name: '산림조합', logo: nfcfLogo },
  { name: '기타' },
] as const satisfies readonly BankInfo[];

export type Bank = (typeof BANKS)[number]['name'];

/** '기타'를 고르면 은행 이름을 직접 입력합니다. */
export const OTHER_BANK = '기타' satisfies Bank;

/** "국민은행"처럼 "은행"을 붙여 검색해도 찾을 수 있게 공백과 "은행"을 빼고 비교합니다. */
const normalize = (text: string) => text.replace(/\s|은행/g, '').toLowerCase();

export type BankSheetProps = {
  visible: boolean;
  selected: Bank | null;
  onSelect: (bank: Bank) => void;
  onClose: () => void;
};

/** T-07 은행 선택 바텀시트 */
export function BankSheet({ visible, selected, onSelect, onClose }: BankSheetProps) {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  const keyword = normalize(query);
  const banks = keyword ? BANKS.filter((bank) => normalize(bank.name).includes(keyword)) : BANKS;
  // "국민은행"처럼 은행 이름을 그대로 입력하고 완료를 누르면 그 은행을 고릅니다.
  const exactMatch = keyword ? BANKS.find((bank) => normalize(bank.name) === keyword) : undefined;

  const close = () => {
    setQuery('');
    onClose();
  };

  const select = (name: Bank) => {
    setQuery('');
    onSelect(name);
  };

  const submitSearch = () => {
    if (exactMatch) select(exactMatch.name);
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable
          role="button"
          accessibilityLabel="은행 선택 닫기"
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <View role="dialog" accessibilityLabel="은행 선택" accessibilityViewIsModal style={s.sheet}>
          <View style={s.handleArea}>
            <View style={s.handle} />
          </View>
          <View style={s.header}>
            <Text role="heading" style={s.heading}>
              은행 선택
            </Text>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="은행을 검색하세요"
              accessibilityLabel="은행 이름"
              returnKeyType="done"
              onSubmitEditing={submitSearch}
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[s.list, { paddingBottom: padding[12] + insets.bottom }]}
          >
            <View role="list" accessibilityLabel="은행 목록" style={s.grid}>
              {toRows(banks).map((row) => (
                <View key={row[0].name} style={s.row}>
                  {row.map((bank) => (
                    <Pressable
                      key={bank.name}
                      role="option"
                      aria-selected={selected === bank.name}
                      accessibilityLabel={bank.name}
                      onPress={() => select(bank.name)}
                      style={({ pressed }) => [s.cell, s.bank, pressed && s.bankPressed]}
                    >
                      <View style={[s.logoBox, !('logo' in bank) && s.logoFallback]}>
                        {'logo' in bank ? (
                          <Image
                            source={bank.logo}
                            contentFit={'fit' in bank ? bank.fit : 'cover'}
                            style={s.logo}
                          />
                        ) : (
                          <Text style={s.logoFallbackText}>{bank.name.slice(0, 1)}</Text>
                        )}
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[s.bankName, selected === bank.name && s.bankNameSelected]}
                      >
                        {bank.name}
                      </Text>
                    </Pressable>
                  ))}
                  {/* 마지막 줄이 3칸보다 적으면 빈 칸으로 채워 칸 너비를 맞춥니다. */}
                  {Array.from({ length: COLUMNS - row.length }, (_, i) => (
                    <View key={`empty-${i}`} style={s.cell} />
                  ))}
                </View>
              ))}
            </View>
            {banks.length === 0 ? <Text style={s.empty}>검색 결과가 없어요</Text> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const COLUMNS = 3;
const LOGO_SIZE = 40;

const toRows = <T,>(items: readonly T[]) =>
  Array.from({ length: Math.ceil(items.length / COLUMNS) }, (_, i) =>
    items.slice(i * COLUMNS, i * COLUMNS + COLUMNS),
  );

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#2D303D80',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '80%',
    gap: gap[8],
    backgroundColor: semantic.surface.subtle,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
  },
  handleArea: { alignItems: 'center', paddingVertical: padding[12] },
  handle: {
    width: 56,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: semantic.border.default,
  },
  header: { gap: gap[20], paddingHorizontal: padding[24] },
  heading: { ...typography.heading[1].bold, color: semantic.text.default.strong },
  list: { paddingHorizontal: padding[24], paddingTop: padding[12] },
  // 3열 그리드: 열 사이 6px, 줄 사이 8px
  grid: { gap: gap[8] },
  row: { flexDirection: 'row', gap: 6 },
  // 빈 칸도 같은 좌우 여백을 가져야 flex로 나눌 때 칸 너비가 똑같아집니다.
  cell: { flex: 1, paddingHorizontal: padding[12] },
  bank: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap[8],
    paddingVertical: padding[8],
    borderRadius: radius.medium,
    backgroundColor: semantic.surface.subtle,
  },
  bankPressed: { backgroundColor: semantic.surface.default },
  logoBox: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: radius.medium,
    overflow: 'hidden',
    backgroundColor: semantic.surface.input,
  },
  logo: { width: LOGO_SIZE, height: LOGO_SIZE },
  logoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.surface.default,
  },
  logoFallbackText: { ...typography.body[4].semiBold, color: semantic.text.default.weak },
  bankName: {
    ...typography.caption[1].semiBold,
    height: 24,
    textAlign: 'center',
    color: semantic.text.default.neutral,
  },
  bankNameSelected: { color: semantic.text.brand.assistive },
  empty: {
    ...typography.body[4].medium,
    color: semantic.text.default.weak,
    textAlign: 'center',
    paddingVertical: padding[24],
  },
});
