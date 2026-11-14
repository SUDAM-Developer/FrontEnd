import addImage from '../../../assets/images/add.svg';
import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ChipSelectField, TextField } from './FormFields';
import type { TextFieldProps } from './FormFields';
import { TutoringFormLayout, useSubmit } from './TutoringFormLayout';
import { semantic } from '@/styles/colors';
import { gap, lineWeight, padding, radius, unit } from '@/styles/measurement';
import { typography } from '@/styles/typography';
import { INVALID_PHONE_MESSAGE, formatPhone, isValidPhone } from '@/utils/phone';

const TITLES = ['어머님', '아버님', '보호자님'] as const;
const MAX_PARENTS = 2;

type ParentTitle = (typeof TITLES)[number];
type Parent = { phone: string; title: ParentTitle | null };

// TODO: 학부모 번호 입력 여부에 따라 문구가 바뀌는지 기획 확인이 필요합니다. 지금은 디자인 문구 그대로입니다.
const INVITE_SUMMARY = [
  { label: '학부모', value: '초대 링크 / 근황 보내지 않음' },
  { label: '학생', value: '초대 링크' },
  { label: '함께 보내요', value: '수업 계획서' },
];

const emptyParent = (): Parent => ({ phone: '', title: null });

type PhoneFieldProps = Omit<TextFieldProps, 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (value: string) => void;
};

/** 하이픈을 자동으로 넣고, 입력칸을 벗어났을 때 번호가 틀리면 오류 문구를 보여 주는 입력칸 */
function PhoneField({ value, onChangeText, onBlur, ...props }: PhoneFieldProps) {
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.length > 0 && !isValidPhone(value);

  return (
    <TextField
      {...props}
      value={value}
      onChangeText={(text) => onChangeText(formatPhone(text))}
      onBlur={(e) => {
        setTouched(true);
        onBlur?.(e);
      }}
      errorMessage={invalid ? INVALID_PHONE_MESSAGE : undefined}
      keyboardType="phone-pad"
      placeholder="전화번호"
    />
  );
}

/** T-05 과외 만들기 · 초대 (5/5 단계) */
export function InviteScreen() {
  const [parents, setParents] = useState<Parent[]>([emptyParent()]);
  const [studentPhone, setStudentPhone] = useState('');

  const updateParent = (index: number, patch: Partial<Parent>) =>
    setParents((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  // 첫 번째 학부모 번호는 필수, 나머지 번호는 입력했다면 올바른 형식이어야 합니다.
  const optionalOk = (phone: string) => phone.length === 0 || isValidPhone(phone);
  const canProceed =
    isValidPhone(parents[0].phone) &&
    parents.slice(1).every((p) => optionalOk(p.phone)) &&
    optionalOk(studentPhone);

  // TODO: 저장·초대 링크 전송 API를 useSubmit 두 번째 인자로 넘기고, 성공하면 완료 화면으로 이동합니다.
  const { submitting, failed, submit } = useSubmit(() => {});

  return (
    <TutoringFormLayout
      step={5}
      canProceed={canProceed}
      submitting={submitting}
      onNext={submit}
      ctaLabel="저장하고 초대 링크 보내기"
      loadingOverlay={false}
      toast={failed ? '전송하지 못했어요. 다시 시도해 주세요.' : undefined}
    >
      {parents.map((parent, index) => (
        <Fragment key={index}>
          <PhoneField
            label={index === 0 ? '학부모 휴대폰 번호' : `학부모 휴대폰 번호 ${index + 1}`}
            required={index === 0}
            value={parent.phone}
            onChangeText={(phone) => updateParent(index, { phone })}
          />
          <View>
            <ChipSelectField
              label={index === 0 ? '호칭' : `호칭 ${index + 1}`}
              required={false}
              strong
              single
              options={TITLES}
              isSelected={(title) => parent.title === title}
              onPress={(title) => updateParent(index, { title })}
            />
            {index === parents.length - 1 && parents.length < MAX_PARENTS ? (
              <Pressable
                role="button"
                accessibilityLabel="학부모 추가"
                onPress={() => setParents((prev) => [...prev, emptyParent()])}
                style={({ pressed }) => [s.addButton, pressed && s.addButtonPressed]}
              >
                <Image source={addImage} style={s.addIcon} />
                <Text style={s.addLabel}>학부모 추가 (최대 2명)</Text>
              </Pressable>
            ) : null}
          </View>
        </Fragment>
      ))}

      <PhoneField
        label="학생 휴대폰"
        required={false}
        value={studentPhone}
        onChangeText={setStudentPhone}
      />

      <View style={s.inviteSection}>
        <Text style={s.sectionLabel}>이렇게 초대해요</Text>
        <View style={s.summary}>
          {INVITE_SUMMARY.map((row, i) => (
            <Fragment key={row.label}>
              {i > 0 ? <View style={s.divider} /> : null}
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>{row.label}</Text>
                <Text style={s.summaryValue}>{row.value}</Text>
              </View>
            </Fragment>
          ))}
        </View>
        {/* 전송 실패 토스트가 떠 있는 동안에는 디자인대로 안내 상자를 숨기고 그 자리에 토스트를 보여 줍니다. */}
        {failed ? null : (
          <View style={s.notice}>
            <Text style={s.noticeText}>
              {
                '링크로 볼지 앱을 깔지는 각자 고르고, 초대를 수락하기 전에는\n아무것도 보내지 않아요.'
              }
            </Text>
          </View>
        )}
      </View>
    </TutoringFormLayout>
  );
}

const s = StyleSheet.create({
  addButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap[8],
    // 칩 묶음과 버튼 사이가 12px입니다 (칩 영역 아래 여백 8 + 4).
    marginTop: unit[4],
    paddingHorizontal: padding[12],
    paddingVertical: padding[8],
    borderRadius: radius.medium,
    borderWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    backgroundColor: semantic.surface.default,
  },
  addButtonPressed: { backgroundColor: semantic.surface.disabled },
  addIcon: { width: 16, height: 16 },
  addLabel: {
    ...typography.body[3].medium,
    textAlign: 'center',
    color: semantic.text.default.weak,
  },
  inviteSection: { paddingVertical: padding[12], gap: gap[12] },
  sectionLabel: {
    ...typography.body[5].semiBold,
    paddingHorizontal: padding[4],
    color: semantic.text.default.neutral,
  },
  summary: {
    gap: gap[12],
    paddingHorizontal: padding[16],
    paddingVertical: padding[12],
    borderRadius: radius.medium,
    backgroundColor: semantic.surface.subtle,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body[4].semiBold, color: semantic.text.default.neutral },
  summaryValue: { ...typography.body[4].medium, color: semantic.text.default.weak },
  divider: {
    height: lineWeight.subtle,
    borderRadius: radius.small,
    backgroundColor: semantic.border.default,
  },
  notice: {
    paddingHorizontal: padding[12],
    paddingVertical: padding[8],
    borderRadius: radius.small,
    backgroundColor: semantic.surface.focused,
  },
  noticeText: { ...typography.caption[1].medium, color: semantic.text.brand.assistive },
});
