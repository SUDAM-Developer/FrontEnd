import arrowBackImage from '../../../assets/images/arrow_back.svg';
import checkboxCheckedImage from '../../../assets/images/checkbox-checked.svg';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { apiMessage } from '@/hooks/useApiResource';
import { FeeEditSheet } from './FeeEditSheet';
import { ReportStatusTag } from './ReportCard';
import { detail as s } from './styles';
import { formatDateTime, formatPeriod, formatWon } from './types';
import type { FeeEdit, ReportDetail } from './types';
import type { ApiParentResponse, ApiReportCommentResponse } from '@/apis/models';

export type ReportDetailScreenProps = {
  report: ReportDetail;
  onBack: () => void;
  onSend: (comment: string, participantId?: number) => Promise<void> | void;
  onSaveComment?: (comment: string) => Promise<ApiReportCommentResponse>;
  onSaveFee?: (edit: FeeEdit, signal: AbortSignal) => Promise<void>;
  parents?: ApiParentResponse[];
};
export function ReportDetailScreen({
  report,
  onBack,
  onSend,
  onSaveComment,
  onSaveFee,
  parents = [],
}: ReportDetailScreenProps) {
  const readOnly = report.status === 'sent';
  const [comment, setComment] = useState(report.comment.draft);
  const [source, setSource] = useState(report.comment.source);
  const [checked, setChecked] = useState(report.comment.reviewed ?? false);
  const [savedComment, setSavedComment] = useState(report.comment.draft);
  const [pending, setPending] = useState(false);
  const [feeSheetOpen, setFeeSheetOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<number | undefined>(
    parents.length === 1 ? parents[0].participantId : undefined,
  );
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const validComment = comment.trim().length > 0 && comment.length <= 1000;
  const fee = report.fee;
  async function confirmComment() {
    if (locked.current || !validComment) return;
    locked.current = true;
    setPending(true);
    setNotice(null);
    try {
      if (!onSaveComment) throw new Error('코멘트 저장을 연결하지 못했어요.');
      const result = await onSaveComment(comment);
      if (!mounted.current) return;
      setComment(result.comment);
      setSavedComment(result.comment);
      setChecked(result.reviewed);
      setSource(result.commentSource);
      setNotice(result.reviewed ? '코멘트를 확인했어요' : '코멘트를 저장했어요.');
    } catch (error) {
      if (mounted.current) setNotice(apiMessage(error));
    } finally {
      locked.current = false;
      if (mounted.current) setPending(false);
    }
  }
  async function send() {
    if (locked.current || !checked || comment !== savedComment || !validComment) return;
    locked.current = true;
    setPending(true);
    setNotice(null);
    try {
      await onSend(comment, recipient);
    } catch (error) {
      if (mounted.current) setNotice(apiMessage(error));
    } finally {
      locked.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return (
    <View style={s.page}>
      <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
        <View style={s.phone}>
          <View style={s.navBar}>
            <Pressable
              role="button"
              accessibilityLabel="뒤로 가기"
              onPress={onBack}
              disabled={pending}
              hitSlop={8}
            >
              <Image source={arrowBackImage} style={s.icon} />
            </Pressable>
            <Text role="heading" style={s.navTitle}>
              {report.studentName}
            </Text>
            <View style={s.icon} />
          </View>
          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
            <View>
              <View style={s.summary}>
                <ReportStatusTag status={report.status} style={s.detailStatusTag} />
                <View style={s.summaryTexts}>
                  <Text role="heading" style={s.title}>
                    {report.sessionCount}회차 수업을 마쳤어요
                  </Text>
                  <View style={s.meta}>
                    <Text style={s.metaText}>
                      {formatPeriod(report.periodStart, report.periodEnd, '~')}
                    </Text>
                    <Text style={s.metaText}>{report.teacherName} 선생님</Text>
                  </View>
                </View>
              </View>
              <View style={s.stats}>
                <Stat
                  label="수업"
                  value={`${report.stats.completedSessions}/${report.stats.totalSessions}`}
                />
                <Stat label="휴강" value={String(report.stats.cancelledSessions)} />
                <Stat
                  label="숙제 수행"
                  value={report.stats.homeworkRate == null ? '-' : `${report.stats.homeworkRate}%`}
                />
                <Stat label="이해도 · 평균" value={report.stats.understanding ?? '-'} />
              </View>
            </View>
            <View style={s.section}>
              <Text style={s.sectionLabel}>진도</Text>
              <View style={s.card}>
                <View style={s.tableHeader}>
                  <Text style={s.tableHeaderText}>교재</Text>
                  <View style={s.lessonCols}>
                    <Text style={s.tableHeaderText}>시작</Text>
                    <Text style={s.tableHeaderText}>이번달</Text>
                  </View>
                </View>
                <View style={s.divider} />
                <View style={s.rows}>
                  {report.progress.length === 0 ? (
                    <Text>기록된 진도가 없어요.</Text>
                  ) : (
                    report.progress.map((item, i) => (
                      <Fragment key={`${item.textbook}-${i}`}>
                        {i > 0 && <View style={s.divider} />}
                        <View style={s.tableRow}>
                          <Text style={s.textbook}>{item.textbook}</Text>
                          <View style={s.lessonCols}>
                            <Text style={s.startLesson}>{item.startLesson}</Text>
                            <Text style={s.currentLesson}>{item.currentLesson}</Text>
                          </View>
                        </View>
                      </Fragment>
                    ))
                  )}
                </View>
              </View>
            </View>
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.commentLabel}>
                  <Text style={s.sectionLabel}>선생님 코멘트</Text>
                  {source === 'AI_DRAFT' && (
                    <View style={s.aiTag}>
                      <Text style={s.aiTagText}>AI 초안</Text>
                    </View>
                  )}
                </View>
              </View>
              <TextInput
                accessibilityLabel="선생님 코멘트"
                value={comment}
                onChangeText={(value) => {
                  setComment(value);
                  setChecked(false);
                  setNotice(null);
                }}
                editable={!readOnly && !pending}
                multiline
                scrollEnabled={false}
                textAlignVertical="top"
                errorMessage={
                  comment.length > 1000 ? '코멘트는 1,000자 이내로 입력해 주세요.' : undefined
                }
              />
              {!readOnly && (
                <Pressable
                  role="checkbox"
                  accessibilityLabel="코멘트를 확인했어요"
                  accessibilityState={{ checked, disabled: pending || !validComment }}
                  aria-checked={checked}
                  disabled={pending || !validComment}
                  onPress={() => {
                    if (checked) setChecked(false);
                    else void confirmComment();
                  }}
                  hitSlop={8}
                  style={s.checkRow}
                >
                  <View aria-hidden style={s.checkSlot}>
                    {checked ? (
                      <Image source={checkboxCheckedImage} style={s.checkBoxImage} />
                    ) : (
                      <View style={s.checkBox} />
                    )}
                  </View>
                  <Text style={s.checkLabel}>코멘트를 확인했어요</Text>
                </Pressable>
              )}
            </View>
            <View>
              <View style={s.sectionHeader}>
                <Text style={s.sectionLabel}>교육비 안내</Text>
                {!readOnly && (
                  <LinkButton
                    label="수정"
                    onPress={!pending && onSaveFee ? () => setFeeSheetOpen(true) : undefined}
                  />
                )}
              </View>
              <InfoCard
                highlight={{ label: '총 교육비', value: formatWon(fee.total) }}
                rows={[
                  ['적용설정', fee.setting],
                  [
                    '인정 회차 × 회당 단가',
                    `${fee.countedSessions}회 × ${formatWon(fee.unitPrice)}`,
                  ],
                  ['휴강', fee.cancellation],
                  ['입금 계좌', fee.account],
                ]}
              />
            </View>
            {readOnly && (
              <InfoCard
                rows={[
                  ['발송', report.sentAt ? formatDateTime(report.sentAt) : '-'],
                  ['학부모 열람', report.parentReadAt ? formatDateTime(report.parentReadAt) : '-'],
                ]}
              />
            )}
          </ScrollView>
          {!readOnly && (
            <View style={s.cta}>
              {parents.length > 1 && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {parents.map((parent) => (
                    <Pressable
                      key={parent.participantId}
                      role="radio"
                      accessibilityState={{ selected: recipient === parent.participantId }}
                      onPress={() => setRecipient(parent.participantId)}
                      disabled={pending}
                    >
                      <Text
                        style={{
                          color: recipient === parent.participantId ? '#0070EF' : '#848A91',
                        }}
                      >
                        {parent.label === 'MOTHER'
                          ? '어머니'
                          : parent.label === 'FATHER'
                            ? '아버지'
                            : '보호자'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              <Text role={notice ? 'status' : undefined} style={s.helpText}>
                {notice ??
                  (checked
                    ? '카카오톡 공유 창에서 학부모님을 선택해 주세요.'
                    : '코멘트를 확인해야 보낼 수 있어요.')}
              </Text>
              <ActionButton
                label="카톡으로 보내기"
                loading={pending}
                disabled={!checked || !validComment || (parents.length > 1 && !recipient)}
                onPress={() => void send()}
              />
            </View>
          )}
        </View>
        {feeSheetOpen && onSaveFee && (
          <FeeEditSheet
            currentTotal={report.fee.total}
            onClose={() => setFeeSheetOpen(false)}
            onSave={onSaveFee}
            onSaved={() => {
              setFeeSheetOpen(false);
              setNotice('교육비를 저장했어요.');
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.stat} accessible accessibilityLabel={`${label} ${value}`}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

function LinkButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [s.linkButton, pressed && s.pressed]}
    >
      <Text style={s.linkText}>{label}</Text>
    </Pressable>
  );
}

/** 회색 카드 안의 "라벨 — 값" 목록. highlight가 있으면 맨 위에 크게 보여 줍니다. */
function InfoCard({
  highlight,
  rows,
}: {
  highlight?: { label: string; value: string };
  rows: [string, ReactNode][];
}) {
  return (
    <View style={s.card}>
      <View style={s.rows}>
        {highlight && (
          <View style={s.totalBlock}>
            <View style={s.tableRow}>
              <Text style={s.totalLabel}>{highlight.label}</Text>
              <Text style={s.totalValue}>{highlight.value}</Text>
            </View>
            <View style={s.divider} />
          </View>
        )}
        {rows.map(([label, value], i) => (
          <Fragment key={label}>
            {i > 0 && <View style={s.divider} />}
            <View style={s.tableRow}>
              <Text style={s.feeRowLabel}>{label}</Text>
              <Text style={s.feeRowValue}>{value}</Text>
            </View>
          </Fragment>
        ))}
      </View>
    </View>
  );
}
