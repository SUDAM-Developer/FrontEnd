import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/ActionButton';
import { Loading } from '@/components/Loading';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { semantic } from '@/styles/colors';
import { gap, grid, lineWeight, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { TermsCheckbox } from './TermsCheckbox';
import { termsItems } from './terms';
import type { SaveTerms, TermId, TermsDocuments } from './terms';

type Props = {
  /** API 확정 전에는 생략합니다. 이 경우 동의를 메모리에 반영하고 이동할 뿐 서버에 저장하지 않습니다. */
  onSave?: SaveTerms;
  documents?: TermsDocuments;
  initialChecked?: boolean;
};

export default function TermsScreen({ onSave, documents, initialChecked = false }: Props) {
  const router = useRouter();
  const { agreed, setAgreed } = useOnboarding();
  const [draft, setDraft] = useState(() =>
    termsItems.map((_, i) => initialChecked || agreed[i] || false),
  );
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [documentId, setDocumentId] = useState<TermId | null>(null);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const controller = useRef<AbortController | null>(null);
  const allChecked = draft.every(Boolean);
  const document = termsItems.find((item) => item.id === documentId);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);

  function toggle(index?: number) {
    if (inFlight.current) return;
    setFailed(false);
    setDraft((current) =>
      index === undefined
        ? current.map(() => !current.every(Boolean))
        : current.map((value, i) => (i === index ? !value : value)),
    );
  }

  async function submit() {
    if (!allChecked || inFlight.current) return;
    inFlight.current = true;
    setFailed(false);
    const request = new AbortController();
    controller.current = request;
    const selection = { service: draft[0], privacy: draft[1], contacts: draft[2] };
    try {
      if (onSave) {
        setSaving(true);
        await onSave(selection, request.signal);
      }
      if (!mounted.current || request.signal.aborted) return;
      setAgreed([...draft]);
      router.push('/profile');
    } catch {
      if (mounted.current && !request.signal.aborted) setFailed(true);
    } finally {
      inFlight.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  function back() {
    if (inFlight.current) return;
    // 뒤로 이동 후 다시 진입해도 선택은 유지합니다. 서버 저장 완료를 뜻하지 않습니다.
    setAgreed([...draft]);
    if (router.canGoBack()) router.back();
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.phone}>
        <View style={s.header}>
          {router.canGoBack() && (
            <Pressable
              role="button"
              accessibilityLabel="뒤로 가기"
              disabled={saving}
              onPress={back}
              style={s.back}
            >
              <View style={s.arrow} />
            </Pressable>
          )}
          <Text role="heading" style={s.headerTitle}>
            약관 동의
          </Text>
        </View>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          <Text role="heading" style={s.title}>
            수담을 쓰려면 동의가 필요해요
          </Text>
          <View style={s.allRow}>
            <TermsCheckbox
              label="전체 동의"
              checked={allChecked}
              disabled={saving}
              onPress={() => toggle()}
            />
          </View>
          {termsItems.map((item, index) => (
            <View key={item.id} style={s.termRow}>
              <TermsCheckbox
                label={`[필수] ${item.label}`}
                checked={draft[index]}
                disabled={saving}
                onPress={() => toggle(index)}
              />
              <Pressable
                role="button"
                accessibilityLabel={`${item.label} 보기`}
                disabled={saving}
                onPress={() => setDocumentId(item.id)}
                style={s.viewButton}
              >
                <Text style={s.viewText}>보기</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View style={s.footer}>
          <ActionButton
            label="다음"
            disabled={!allChecked}
            loading={saving}
            onPress={() => void submit()}
          />
          <View style={s.feedbackSlot}>
            {failed && (
              <View role="alert" accessibilityLiveRegion="assertive" style={s.toast}>
                <Text style={s.toastText}>연결이 불안정해요</Text>
                <Pressable
                  role="button"
                  accessibilityLabel="약관 저장 다시 시도"
                  onPress={() => void submit()}
                  style={s.retry}
                >
                  <Text style={s.retryText}>다시 시도</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
      <Loading visible={saving} />
      <Modal
        visible={document !== undefined}
        transparent
        animationType="fade"
        onRequestClose={() => setDocumentId(null)}
      >
        <View style={s.modalBackdrop}>
          <View accessibilityViewIsModal style={s.documentDialog}>
            <Text role="heading" style={s.documentTitle}>
              {document?.label}
            </Text>
            <ScrollView style={s.documentScroll} contentContainerStyle={s.documentBody}>
              <Text style={s.documentText}>
                {(documentId && documents?.[documentId]) ||
                  '약관 원문이 아직 등록되지 않았어요. 현재 화면은 구현 확인용이며, 실제 가입 전에는 확정된 약관 원문을 연결해야 해요.'}
              </Text>
            </ScrollView>
            <ActionButton label="닫기" onPress={() => setDocumentId(null)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: semantic.surface.input, alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  header: { height: 72, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.body[1].semiBold, color: semantic.text.default.strong },
  back: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 12,
    height: 12,
    borderLeftWidth: lineWeight.semiBold,
    borderBottomWidth: lineWeight.semiBold,
    borderColor: semantic.icon.primary,
    transform: [{ rotate: '45deg' }],
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: grid.margin, paddingBottom: padding[24] },
  title: {
    ...typography.heading[1].semiBold,
    color: semantic.text.default.strong,
    marginBottom: gap[8],
  },
  allRow: {
    minHeight: 48,
    borderBottomWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    marginBottom: gap[8],
  },
  termRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center' },
  viewButton: {
    minWidth: 44,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: padding[4],
  },
  viewText: {
    ...typography.body[4].regular,
    color: semantic.text.default.weak,
    textDecorationLine: 'underline',
  },
  footer: { paddingHorizontal: grid.margin, paddingTop: padding[16] },
  feedbackSlot: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: padding[4],
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.surface.inverse,
    borderRadius: radius.full,
    paddingLeft: padding[12],
    gap: gap[8],
  },
  toastText: { ...typography.caption[1].regular, color: semantic.text.default.inverse },
  retry: { minHeight: 44, justifyContent: 'center', paddingRight: padding[12] },
  retryText: {
    ...typography.caption[1].semiBold,
    color: semantic.text.default.inverse,
    textDecorationLine: 'underline',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding[24],
  },
  documentDialog: {
    width: '100%',
    maxWidth: 390,
    maxHeight: '80%',
    backgroundColor: semantic.surface.input,
    borderRadius: radius.large,
    padding: padding[24],
    gap: gap[16],
  },
  documentTitle: { ...typography.heading[1].semiBold, color: semantic.text.default.strong },
  documentScroll: { flexShrink: 1 },
  documentBody: { paddingBottom: padding[8] },
  documentText: { ...typography.body[3].regular, color: semantic.text.default.normal },
});
