import emailImage from '../../../assets/images/email.svg';
import googleImage from '../../../assets/images/google.svg';
import kakaoImage from '../../../assets/images/kakao.svg';
import logoImage from '../../../assets/images/logo.svg';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from './OnboardingProvider';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Screen = 'welcome' | 'terms' | 'profile' | 'settings';
const subjects = ['국어', '영어', '수학', '과학', '사회', '기타'];
const terms = ['이용약관', '개인정보 수집 · 이용', '학부모 · 학생 연락처 처리'];
const ink = '#343845';

export default function OnboardingApp({ screen }: { screen: Screen }) {
  const router = useRouter();
  const {
    agreed,
    setAgreed,
    name,
    setName,
    selected,
    setSelected,
    profile,
    setProfile,
    editing,
    setEditing,
  } = useOnboarding();
  const setScreen = (next: Screen) => router.push(next === 'welcome' ? '/' : `/${next}`);

  const [dialog, setDialog] = useState<{
    title: string;
    body: string;
    action?: 'logout' | 'delete';
  } | null>(null);
  const allAgreed = agreed.every(Boolean);
  const validName = name.trim().length >= 1 && name.trim().length <= 20;
  const openTerms = (title: string) =>
    setDialog({
      title,
      body: '약관 원문이 아직 제공되지 않았습니다. 현재 화면은 UI 확인용 데모이며 실제 가입이나 개인정보 수집은 이루어지지 않습니다. 정식 서비스에서는 확정된 약관을 연결해야 합니다.',
    });
  const start = () => {
    setEditing(false);
    setScreen('terms');
  };
  const reset = () => {
    setName('');
    setSelected([]);
    setProfile({ name: '', subjects: [] });
    setAgreed([false, false, false]);
    router.dismissAll();
    router.replace('/');
    setDialog(null);
  };
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace(screen === 'profile' && !editing ? '/terms' : '/');
  };
  const primary = (label: string, disabled: boolean, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [s.primary, disabled && s.disabled, pressed && s.pressed]}
    >
      <Text style={[s.primaryText, disabled && s.disabledText]}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={s.phone}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {screen === 'welcome' ? (
          <ScrollView contentContainerStyle={s.welcome} keyboardShouldPersistTaps="handled">
            <View style={s.brand}>
              <Image accessibilityLabel="SUDAM" source={logoImage} style={s.logo} />
              <Text style={s.tagline}>
                선생님은 수업만, 나머지는 <Text style={s.blue}>수담</Text>이
              </Text>
            </View>
            <View style={s.loginActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  setDialog({
                    title: '카카오 로그인',
                    body: '카카오 로그인은 서버 연동 전입니다. 데모로 화면 흐름을 확인할 수 있어요.',
                  })
                }
                style={({ pressed }) => [s.loginButton, s.kakao, pressed && s.pressed]}
              >
                <Image source={kakaoImage} style={s.provider} />
                <Text style={s.loginText}>카카오로 시작하기</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  setDialog({
                    title: '구글 로그인',
                    body: '구글 로그인은 서버 연동 전입니다. 데모로 화면 흐름을 확인할 수 있어요.',
                  })
                }
                style={({ pressed }) => [s.loginButton, pressed && s.pressed]}
              >
                <Image source={googleImage} style={s.provider} />
                <Text style={s.loginText}>구글로 시작하기</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={start}
                style={({ pressed }) => [s.loginButton, pressed && s.pressed]}
              >
                <Image source={emailImage} style={s.provider} />
                <Text style={s.loginText}>이메일로 가입하기</Text>
              </Pressable>
              <View style={s.links}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setDialog({
                      title: '이메일 로그인',
                      body: '이메일 인증 및 로그인 API는 아직 연결되지 않았습니다.',
                    })
                  }
                >
                  <Text style={s.smallLink}>이메일로 로그인</Text>
                </Pressable>
                <Text style={s.smallLink}> | </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setDialog({
                      title: '비밀번호 찾기',
                      body: '비밀번호 재설정은 이메일 발송 API 연동 후 이용할 수 있습니다.',
                    })
                  }
                >
                  <Text style={s.smallLink}>비밀번호 찾기</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : (
          <>
            <View style={s.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="뒤로 가기"
                onPress={back}
                style={s.back}
              >
                <Text style={s.backText}>←</Text>
              </Pressable>
              <Text accessibilityRole="header" style={s.headerTitle}>
                {screen === 'terms' ? '약관 동의' : screen === 'profile' ? '프로필' : '설정'}
              </Text>
            </View>
            <ScrollView
              style={s.content}
              contentContainerStyle={s.contentInner}
              keyboardShouldPersistTaps="handled"
            >
              {screen === 'terms' && (
                <>
                  <Text style={s.heading}>수담을 쓰려면 동의가 필요해요</Text>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: allAgreed }}
                    onPress={() => setAgreed(agreed.map(() => !allAgreed))}
                    style={[s.termRow, s.allRow]}
                  >
                    <View style={[s.checkbox, allAgreed && s.checked]}>
                      <Text style={s.checkMark}>{allAgreed ? '✓' : ''}</Text>
                    </View>
                    <Text style={s.termText}>전체 동의</Text>
                  </Pressable>
                  {terms.map((term, i) => (
                    <View key={term} style={s.termRow}>
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityLabel={`필수 ${term}`}
                        accessibilityState={{ checked: agreed[i] }}
                        onPress={() => setAgreed(agreed.map((v, j) => (i === j ? !v : v)))}
                        style={s.termChoice}
                      >
                        <View style={[s.checkbox, agreed[i] && s.checked]}>
                          <Text style={s.checkMark}>{agreed[i] ? '✓' : ''}</Text>
                        </View>
                        <Text style={s.termText}>[필수] {term}</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${term} 보기`}
                        onPress={() => openTerms(term)}
                        style={s.viewTerm}
                      >
                        <Text style={s.underlined}>보기</Text>
                      </Pressable>
                    </View>
                  ))}
                </>
              )}
              {screen === 'profile' && (
                <>
                  <Text style={s.heading}>학부모님께 보일 이름을 알려 주세요</Text>
                  <Text nativeID="name-label" style={s.label}>
                    이름 (필수)
                  </Text>
                  <TextInput
                    accessibilityLabel="이름 (필수)"
                    value={name}
                    onChangeText={setName}
                    maxLength={20}
                    placeholder="이름을 입력해 주세요"
                    placeholderTextColor="#9399a4"
                    style={s.input}
                    returnKeyType="done"
                    autoComplete="name"
                  />
                  <Text style={s.subjectLabel}>과목 (선택, 여러 개)</Text>
                  <View style={s.chips}>
                    {subjects.map((subject) => (
                      <Pressable
                        key={subject}
                        accessibilityRole="checkbox"
                        accessibilityLabel={subject}
                        accessibilityState={{ checked: selected.includes(subject) }}
                        onPress={() =>
                          setSelected(
                            selected.includes(subject)
                              ? selected.filter((v) => v !== subject)
                              : [...selected, subject],
                          )
                        }
                        style={[s.chip, selected.includes(subject) && s.selectedChip]}
                      >
                        <Text
                          style={[s.chipText, selected.includes(subject) && s.selectedChipText]}
                        >
                          {subject}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
              {screen === 'settings' && (
                <>
                  <View style={s.profileRow}>
                    <View>
                      <Text style={s.profileName}>{profile.name} 선생님</Text>
                      <Text style={s.profileSubjects}>
                        {profile.subjects.join(' · ') || '과목 미설정'}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      style={s.edit}
                      onPress={() => {
                        setName(profile.name);
                        setSelected(profile.subjects);
                        setEditing(true);
                        setScreen('profile');
                      }}
                    >
                      <Text style={s.smallLink}>수정</Text>
                    </Pressable>
                  </View>
                  {['이용약관', '개인정보 처리방침'].map((term) => (
                    <Pressable
                      key={term}
                      accessibilityRole="button"
                      onPress={() => openTerms(term)}
                      style={s.settingRow}
                    >
                      <Text style={s.settingText}>{term}</Text>
                      <Text style={s.chevron}>›</Text>
                    </Pressable>
                  ))}
                  <View style={s.divider} />
                  <Pressable
                    accessibilityRole="button"
                    style={s.settingRow}
                    onPress={() =>
                      setDialog({
                        title: '로그아웃',
                        body: '데모 프로필을 지우고 시작 화면으로 돌아갈까요?',
                        action: 'logout',
                      })
                    }
                  >
                    <Text style={s.settingText}>로그아웃</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    style={s.settingRow}
                    onPress={() =>
                      setDialog({
                        title: '회원 탈퇴',
                        body: '실제 계정은 생성되지 않았습니다. 이 화면에서 입력한 데모 프로필을 삭제할까요?',
                        action: 'delete',
                      })
                    }
                  >
                    <Text style={s.withdraw}>회원 탈퇴</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
            {screen === 'terms' && (
              <View style={s.footer}>
                {primary('다음', !allAgreed, () => setScreen('profile'))}
              </View>
            )}
            {screen === 'profile' && (
              <View style={s.footer}>
                {primary(editing ? '저장' : '완료', !validName, () => {
                  setProfile({ name: name.trim(), subjects: selected });
                  if (editing && router.canGoBack()) router.back();
                  else router.replace('/settings');
                })}
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog(null)}
      >
        <View style={s.overlay}>
          <View accessibilityViewIsModal style={s.dialog}>
            <Text accessibilityRole="header" style={s.dialogTitle}>
              {dialog?.title}
            </Text>
            <Text style={s.dialogBody}>{dialog?.body}</Text>
            {dialog?.action ? (
              <View style={s.dialogActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDialog(null)}
                  style={s.cancel}
                >
                  <Text style={s.settingText}>취소</Text>
                </Pressable>
                <View style={s.flex}>{primary('확인', false, reset)}</View>
              </View>
            ) : (
              <>
                {screen === 'welcome' &&
                  (dialog?.title === '카카오 로그인' || dialog?.title === '구글 로그인') && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setDialog(null);
                        start();
                      }}
                      style={s.demoButton}
                    >
                      <Text style={s.blue}>데모로 계속하기</Text>
                    </Pressable>
                  )}
                {primary('닫기', false, () => setDialog(null))}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', backgroundColor: '#f3f4f7' },
  phone: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 44 : 0,
  },
  welcome: { flexGrow: 1, paddingHorizontal: 28, justifyContent: 'space-between' },
  brand: { alignItems: 'center', paddingTop: 189 },
  logo: { width: 230, height: 51, marginBottom: 16 },
  tagline: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#151515' },
  blue: { color: '#1557ff' },
  loginActions: { paddingBottom: 64, gap: 10, marginTop: 100 },
  loginButton: {
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d2d5dc',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  kakao: { backgroundColor: '#ffe500', borderColor: '#ffe500' },
  loginText: { color: ink, fontSize: 16, fontWeight: '600', marginLeft: 56 },
  provider: { position: 'absolute', left: 78, width: 28, height: 28 },
  links: { flexDirection: 'row', justifyContent: 'center', paddingTop: 14 },
  smallLink: { color: '#9a9fac', fontSize: 12 },
  header: { height: 54, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, color: ink, fontWeight: '700' },
  back: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { fontSize: 28, color: '#454954' },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  heading: { color: ink, fontSize: 18, fontWeight: '700', marginBottom: 22, letterSpacing: -0.5 },
  termRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 16 },
  allRow: { paddingBottom: 18, marginBottom: 10, borderBottomWidth: 1, borderColor: '#d2d5dc' },
  termChoice: { flex: 1, flexDirection: 'row', gap: 16, alignItems: 'center', minHeight: 44 },
  termText: { fontSize: 14, fontWeight: '600', color: '#242424' },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#e0e5f1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: '#219bff', borderColor: '#219bff' },
  checkMark: { fontSize: 12, color: '#fff', fontWeight: '700' },
  viewTerm: { minHeight: 44, minWidth: 32, justifyContent: 'center', alignItems: 'flex-end' },
  underlined: { fontSize: 12, color: '#9a9fac', textDecorationLine: 'underline' },
  footer: { paddingHorizontal: 24, paddingBottom: 38, paddingTop: 16 },
  primary: {
    height: 56,
    borderRadius: 4,
    backgroundColor: '#219bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled: { backgroundColor: '#d6d8dc' },
  disabledText: { color: '#949aa4' },
  pressed: { opacity: 0.7 },
  label: { color: ink, fontSize: 12, marginBottom: 12 },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#d2d5dc',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 15,
    color: ink,
    backgroundColor: '#fcfcff',
  },
  subjectLabel: { fontSize: 13, color: ink, marginTop: 18, marginBottom: 10, marginLeft: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: 200, paddingLeft: 4 },
  chip: {
    paddingHorizontal: 17,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#e9ebf4',
    justifyContent: 'center',
  },
  chipText: { fontSize: 14, color: ink },
  selectedChip: { backgroundColor: '#219bff' },
  selectedChipText: { color: '#fff', fontWeight: '600' },
  profileRow: {
    borderBottomWidth: 1,
    borderColor: '#d2d5dc',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileName: { color: ink, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  profileSubjects: { color: '#7c8391', fontSize: 14 },
  edit: { minWidth: 44, minHeight: 44, alignItems: 'flex-end' },
  settingRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: { color: ink, fontSize: 14, fontWeight: '500' },
  chevron: { fontSize: 28, color: '#525968' },
  divider: { height: 1, backgroundColor: '#d2d5dc', marginTop: 12, marginBottom: 6 },
  withdraw: { color: '#8e95a1', fontSize: 14 },
  demoNote: { color: '#888f9b', fontSize: 11, padding: 12, textAlign: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: '#0006',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: { width: '100%', maxWidth: 342, borderRadius: 16, backgroundColor: '#fff', padding: 24 },
  dialogTitle: { fontSize: 20, fontWeight: '700', color: ink },
  dialogBody: { fontSize: 14, lineHeight: 23, color: '#6b7280', marginVertical: 20 },
  dialogActions: { flexDirection: 'row', gap: 12 },
  cancel: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  demoButton: { alignItems: 'center', padding: 16, marginBottom: 8 },
});
