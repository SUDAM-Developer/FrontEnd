import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/ActionButton';
import { Chip } from '@/components/Chip';
import { Loading } from '@/components/Loading';
import { TextInput } from '@/components/TextInput';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { semantic } from '@/styles/colors';
import { gap, grid, lineWeight, padding } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { isValidProfileName, profileSubjects } from './profile';
import type { ProfileValue, SaveProfile } from './profile';

type Props = { onSave?: SaveProfile; initialProfile?: ProfileValue };
export default function ProfileScreen({ onSave, initialProfile }: Props) {
  const router = useRouter();
  const { name, setName, selected, setSelected, setProfile, editing } = useOnboarding();
  const [draftName, setDraftName] = useState(initialProfile?.name ?? name);
  const [draftSubjects, setDraftSubjects] = useState(initialProfile?.subjects ?? selected);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const controller = useRef<AbortController | null>(null);
  const validName = isValidProfileName(draftName);
  const nameTooLong = draftName.trim().length > 10;
  const canSubmit = validName && draftSubjects.length > 0;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);

  async function submit() {
    if (!canSubmit || inFlight.current) return;
    inFlight.current = true;
    setFailed(false);
    Keyboard.dismiss();
    const request = new AbortController();
    controller.current = request;
    const value = { name: draftName.trim(), subjects: [...draftSubjects] };
    try {
      if (onSave) {
        setSaving(true);
        await onSave(value, request.signal);
      }
      if (!mounted.current || request.signal.aborted) return;
      // API 미확정: 기본 동작은 메모리 상태 반영만 수행합니다.
      setName(value.name);
      setSelected(value.subjects);
      setProfile(value);
      if (editing) {
        if (router.canGoBack()) router.back();
        else router.replace('/settings');
      } else {
        if (router.canDismiss()) router.dismissAll();
        router.replace('/home');
      }
    } catch {
      if (mounted.current && !request.signal.aborted) setFailed(true);
    } finally {
      inFlight.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  function back() {
    if (inFlight.current) return;
    Keyboard.dismiss();
    setName(draftName);
    setSelected([...draftSubjects]);
    if (router.canGoBack()) router.back();
    else router.replace(editing ? '/settings' : '/terms');
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <KeyboardAvoidingView
        style={s.phone}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <Pressable
            role="button"
            accessibilityLabel="뒤로 가기"
            disabled={saving}
            onPress={back}
            style={s.back}
          >
            <View style={s.backIcon}>
              <View style={s.arrowHead} />
              <View style={s.arrowLine} />
            </View>
          </Pressable>
          <Text role="heading" style={s.headerTitle}>
            프로필
          </Text>
        </View>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text role="heading" style={s.title}>
            학부모님께 보일 이름을 알려 주세요
          </Text>
          <Text style={s.nameLabel}>
            이름<Text style={s.required}>*</Text>
          </Text>
          <TextInput
            accessibilityLabel="이름 (필수)"
            value={draftName}
            placeholder="2~10자 이내"
            editable={!saving}
            autoComplete="name"
            returnKeyType="done"
            onChangeText={(value) => {
              setDraftName(value);
              setFailed(false);
            }}
            onBlur={() => setTouched(true)}
            onSubmitEditing={() => {
              if (!validName) setTouched(true);
              else void submit();
            }}
            errorMessage={
              nameTooLong
                ? '글자 수가 초과되었어요'
                : touched && draftName.length > 0 && !validName
                  ? '이름은 2~10자로 입력해 주세요.'
                  : undefined
            }
          />
          <Text style={s.subjectLabel}>
            과목<Text style={s.required}>*</Text> (복수 선택 가능)
          </Text>
          <View style={s.chips}>
            {profileSubjects.map((subject) => (
              <Chip
                key={subject}
                label={subject}
                selected={draftSubjects.includes(subject)}
                disabled={saving}
                onPress={() => {
                  setFailed(false);
                  setDraftSubjects((current) =>
                    current.includes(subject)
                      ? current.filter((item) => item !== subject)
                      : [...current, subject],
                  );
                }}
              />
            ))}
          </View>
        </ScrollView>
        <View style={s.footer}>
          {failed && (
            <View role="alert" accessibilityLiveRegion="assertive" style={s.error}>
              <Text style={s.errorText}>연결이 불안정해요. 다시 시도해 주세요.</Text>
            </View>
          )}
          <ActionButton
            label={editing ? '저장' : '완료'}
            disabled={!canSubmit}
            loading={saving}
            onPress={() => void submit()}
          />
        </View>
      </KeyboardAvoidingView>
      <Loading visible={saving} />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safeArea: { flex: 1, alignItems: 'center', backgroundColor: semantic.surface.input },
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  header: { height: 54, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.body[1].semiBold, color: semantic.text.default.strong },
  back: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { width: 16, height: 16, justifyContent: 'center' },
  arrowHead: {
    position: 'absolute',
    left: 1,
    width: 10,
    height: 10,
    borderLeftWidth: lineWeight.semiBold,
    borderBottomWidth: lineWeight.semiBold,
    borderColor: semantic.icon.primary,
    transform: [{ rotate: '45deg' }],
  },
  arrowLine: { height: lineWeight.semiBold, width: 16, backgroundColor: semantic.icon.primary },
  scroll: { flex: 1 },
  content: { paddingHorizontal: grid.margin, paddingTop: padding[20], paddingBottom: padding[24] },
  title: {
    ...typography.heading[1].semiBold,
    color: semantic.text.default.strong,
    marginBottom: gap[20],
  },
  required: { color: semantic.text.brand.assistive },
  nameLabel: {
    ...typography.body[5].medium,
    color: semantic.text.default.normal,
    marginLeft: padding[8],
    marginBottom: gap[8],
  },
  subjectLabel: {
    ...typography.body[5].medium,
    color: semantic.text.default.normal,
    marginTop: gap[16],
    marginBottom: gap[8],
    marginLeft: padding[4],
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: gap[8] },
  footer: { paddingHorizontal: grid.margin, paddingTop: padding[16], paddingBottom: 24 },
  error: { marginBottom: gap[8] },
  errorText: { ...typography.caption[1].regular, color: semantic.text.feedback.warning },
});
