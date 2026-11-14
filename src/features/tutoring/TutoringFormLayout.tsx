import arrowBackImage from '../../../assets/images/arrow_back.svg';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { Loading } from '@/components/Loading';
import { ProgressBar } from '@/components/ProgressBar';
import { semantic } from '@/styles/colors';
import { gap, padding, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';

export const TOTAL_STEPS = 5;

/** 앞 단계에서 미리 채워 둔 정보의 출처. 출처에 따라 안내 문구가 달라집니다. */
export type PrefillSource = 'lastTutoring' | 'curriculum';

const PREFILL_NOTICE: Record<PrefillSource, string> = {
  lastTutoring: '지난 과외 계좌를 불러왔어요.',
  curriculum: '커리큘럼에서 학생 정보, 교재, 요일을 채워두었어요',
};

export const isPrefillSource = (value: unknown): value is PrefillSource =>
  value === 'lastTutoring' || value === 'curriculum';

// TODO: 저장 API가 생기면 실제 요청으로 바꿉니다. 지금은 로딩 화면만 보여 줍니다.
const SUBMIT_PREVIEW_MS = 1500;
const ERROR_TOAST_MS = 3000;

const previewRequest = () => new Promise<void>((resolve) => setTimeout(resolve, SUBMIT_PREVIEW_MS));

/**
 * "다음"을 누르면 request를 기다리는 동안 로딩을 보여 주고, 성공하면 onDone을 부릅니다.
 * 실패하면 failed가 3초 동안 true가 됩니다.
 */
export function useSubmit(onDone: () => void, request: () => Promise<void> = previewRequest) {
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!failed) return;
    const timer = setTimeout(() => setFailed(false), ERROR_TOAST_MS);
    return () => clearTimeout(timer);
  }, [failed]);

  const submit = async () => {
    if (submitting) return;
    setFailed(false);
    setSubmitting(true);
    try {
      await request();
    } catch {
      setFailed(true);
      return;
    } finally {
      setSubmitting(false);
    }
    onDone();
  };

  return { submitting, failed, submit };
}

export type TutoringFormLayoutProps = {
  step: number;
  /** 없으면 안내 메시지를 보여 주지 않습니다. */
  prefillSource?: PrefillSource;
  canProceed: boolean;
  submitting: boolean;
  onNext: () => void;
  /** 하단 버튼 글자. 기본값은 "다음" */
  ctaLabel?: string;
  /** false면 로딩 중에 가운데 로딩 카드 없이 버튼만 로딩으로 바뀝니다. */
  loadingOverlay?: boolean;
  /** 값이 있으면 하단 버튼 위에 토스트로 보여 줍니다. */
  toast?: string;
  children: ReactNode;
};

/** 과외 만들기 단계 화면의 공통 틀 (헤더, 진행 막대, 안내 메시지, 다음 버튼, 로딩) */
export function TutoringFormLayout({
  step,
  prefillSource,
  canProceed,
  submitting,
  onNext,
  ctaLabel = '다음',
  loadingOverlay = true,
  toast,
  children,
}: TutoringFormLayoutProps) {
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
      <View style={s.phone}>
        <View style={s.navBar}>
          <Pressable role="button" accessibilityLabel="뒤로 가기" onPress={back} hitSlop={8}>
            <Image source={arrowBackImage} style={s.icon} />
          </Pressable>
          <Text role="heading" style={s.title}>
            과외 만들기
          </Text>
          <View style={s.icon} />
        </View>

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <ProgressBar step={step} total={TOTAL_STEPS} stretch />

          {prefillSource ? (
            <View style={s.inlineMessage}>
              <Text style={s.inlineMessageText}>{PREFILL_NOTICE[prefillSource]}</Text>
            </View>
          ) : null}

          <View style={s.form}>{children}</View>
        </ScrollView>

        <View style={s.cta}>
          {toast ? (
            <View pointerEvents="none" style={s.toastSlot}>
              <View role="alert" accessibilityLiveRegion="assertive" style={s.toast}>
                <Text style={s.toastText}>{toast}</Text>
              </View>
            </View>
          ) : null}
          <ActionButton
            label={ctaLabel}
            disabled={!canProceed}
            loading={submitting}
            onPress={() => {
              if (canProceed) onNext();
            }}
          />
        </View>
      </View>
      <Loading visible={loadingOverlay && submitting} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', backgroundColor: semantic.surface.input },
  // 웹에서는 휴대폰 너비(390)로 가운데 정렬하고, 상태바 높이만큼 위를 띄웁니다.
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding[24],
    paddingVertical: padding[12],
  },
  icon: { width: 24, height: 24 },
  title: {
    ...typography.body[1].bold,
    textAlign: 'center',
    color: semantic.text.default.strong,
  },
  content: {
    paddingHorizontal: padding[24],
    gap: gap[8],
  },
  inlineMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap[4],
    paddingHorizontal: padding[12],
    paddingVertical: padding[8],
    borderRadius: radius.small,
    backgroundColor: semantic.surface.focused,
  },
  inlineMessageText: {
    ...typography.caption[1].medium,
    color: semantic.text.brand.assistive,
  },
  form: { paddingVertical: padding[12], gap: gap[20] },
  // 토스트 아래쪽이 버튼 위쪽에서 12px 떨어지도록 CTA 위로 띄웁니다. (토스트 32 + 12 - CTA 위 여백 20)
  toastSlot: { position: 'absolute', top: -24, left: 0, right: 0, alignItems: 'center' },
  toast: {
    backgroundColor: semantic.surface.inverse,
    borderRadius: radius.full,
    paddingHorizontal: padding[12],
    paddingVertical: padding[8],
    // PushBanner와 같은 그림자입니다.
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.18)',
    elevation: 6,
  },
  toastText: { ...typography.caption[1].regular, color: semantic.text.default.inverse },
  cta: {
    paddingHorizontal: padding[24],
    paddingTop: padding[20],
    paddingBottom: padding[20],
    backgroundColor: semantic.surface.input,
  },
});
