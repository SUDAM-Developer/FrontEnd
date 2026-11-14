import arrowBackImage from '../../../assets/images/arrow_back.svg';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

/** "다음"을 누르면 로딩을 보여 주고, 끝나면 onDone을 부릅니다. */
export function useSubmit(onDone: () => void) {
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_PREVIEW_MS));
    } finally {
      setSubmitting(false);
    }
    onDone();
  };

  return { submitting, submit };
}

export type TutoringFormLayoutProps = {
  step: number;
  /** 없으면 안내 메시지를 보여 주지 않습니다. */
  prefillSource?: PrefillSource;
  canProceed: boolean;
  submitting: boolean;
  onNext: () => void;
  children: ReactNode;
};

/** 과외 만들기 단계 화면의 공통 틀 (헤더, 진행 막대, 안내 메시지, 다음 버튼, 로딩) */
export function TutoringFormLayout({
  step,
  prefillSource,
  canProceed,
  submitting,
  onNext,
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
          <ActionButton
            label="다음"
            disabled={!canProceed}
            loading={submitting}
            onPress={() => {
              if (canProceed) onNext();
            }}
          />
        </View>
      </View>
      <Loading visible={submitting} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', backgroundColor: semantic.surface.input },
  // 웹에서는 휴대폰 너비(390)로 가운데 정렬하고, 상태바 높이만큼 위를 띄웁니다.
  phone: { flex: 1, width: '100%', maxWidth: 390, paddingTop: Platform.OS === 'web' ? 44 : 0 },
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
  cta: {
    paddingHorizontal: padding[24],
    paddingTop: padding[20],
    paddingBottom: padding[20],
    backgroundColor: semantic.surface.input,
  },
});
