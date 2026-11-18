import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from './OnboardingProvider';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ink = '#343845';

export default function OnboardingApp({
  onLogout,
  onDelete,
}: {
  onLogout: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);
  const router = useRouter();
  const { setAgreed, setName, setSelected, profile, setProfile, setEditing } = useOnboarding();

  const [dialog, setDialog] = useState<{
    title: string;
    body: string;
    action?: 'logout' | 'delete';
  } | null>(null);
  const openTerms = (title: string) =>
    setDialog({
      title,
      body: '약관 원문을 준비 중입니다. 확정된 문서가 제공되면 확인할 수 있습니다.',
    });
  const reset = async () => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError(null);
    try {
      if (dialog?.action === 'delete') await onDelete();
      else await onLogout();

      setName('');
      setSelected([]);
      setProfile({ name: '', subjects: [] });
      setAgreed([false, false, false]);
      router.dismissAll();
      router.replace('/');
      setDialog(null);
    } catch {
      setError('처리하지 못했어요. 다시 시도해 주세요.');
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
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
              설정
            </Text>
          </View>
          <ScrollView
            style={s.content}
            contentContainerStyle={s.contentInner}
            keyboardShouldPersistTaps="handled"
          >
            {
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
                      router.push('/profile');
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
                      body: '로그아웃하고 시작 화면으로 돌아갈까요?',
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
                      body: '계정을 탈퇴할까요? 탈퇴하면 계정 정보가 삭제됩니다.',
                      action: 'delete',
                    })
                  }
                >
                  <Text style={s.withdraw}>회원 탈퇴</Text>
                </Pressable>
              </>
            }
          </ScrollView>
        </>
      </KeyboardAvoidingView>
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!busy) setDialog(null);
        }}
      >
        <View style={s.overlay}>
          <View accessibilityViewIsModal style={s.dialog}>
            <Text accessibilityRole="header" style={s.dialogTitle}>
              {dialog?.title}
            </Text>
            <Text style={s.dialogBody}>{dialog?.body}</Text>
            {error && <Text role="alert">{error}</Text>}
            {dialog?.action ? (
              <View style={s.dialogActions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => setDialog(null)}
                  style={s.cancel}
                >
                  <Text style={s.settingText}>취소</Text>
                </Pressable>
                <View style={s.flex}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => void reset()}
                    style={[s.primary, busy && s.disabled]}
                  >
                    <Text style={s.primaryText}>{busy ? '처리 중' : '확인'}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <>{primary('닫기', false, () => setDialog(null))}</>
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
  },
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
});
