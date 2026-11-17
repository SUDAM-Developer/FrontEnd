import arrowBackImage from '../../../assets/images/arrow_back.svg';
import arrowDownImage from '../../../assets/images/arrow_down_24.svg';
import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { detail as s } from './styles';
import { formatPeriod, formatWon } from './types';
import type { ReportDetail } from './types';

export type ReportDetailScreenProps = {
  report: ReportDetail;
  onBack: () => void;
  /** 카톡으로 보내기. 보낼 코멘트를 함께 넘깁니다. */
  onSend: (comment: string) => void;
  /** 초안 다시 만들기. 새 초안을 돌려주면 입력칸을 바꿉니다. */
  onRegenerate?: () => Promise<string> | string;
  /** 교육비 안내 "수정" */
  onEditFee?: () => void;
};

/** T-14 정산 리포트 상세 (정상) */
export function ReportDetailScreen({
  report,
  onBack,
  onSend,
  onRegenerate,
  onEditFee,
}: ReportDetailScreenProps) {
  const [comment, setComment] = useState(report.comment.draft);
  const [checked, setChecked] = useState(false);
  const [softenedOpen, setSoftenedOpen] = useState(false);
  const { stats, fee } = report;

  const regenerate = async () => {
    if (!onRegenerate) return;
    setComment(await onRegenerate());
    // 새 초안은 다시 확인해야 보낼 수 있습니다.
    setChecked(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.safe}>
      <View style={s.phone}>
        <View style={s.navBar}>
          <Pressable role="button" accessibilityLabel="뒤로 가기" onPress={onBack} hitSlop={8}>
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
            <View style={s.stats}>
              <Stat label="수업" value={`${stats.completedSessions}/${stats.totalSessions}`} />
              <Stat label="휴강" value={String(stats.cancelledSessions)} />
              <Stat label="숙제 수행" value={`${stats.homeworkRate}%`} />
              <Stat label="이해도 · 평균" value={stats.understanding} />
            </View>
          </View>

          <View style={s.section}>
            <View style={s.progressLabel}>
              <Text style={s.sectionLabel}>진도</Text>
            </View>
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
                {report.progress.map((item, i) => (
                  <Fragment key={item.textbook}>
                    {i > 0 && <View style={s.divider} />}
                    <View style={s.tableRow}>
                      <Text style={s.textbook}>{item.textbook}</Text>
                      <View style={s.lessonCols}>
                        <Text style={s.startLesson}>{item.startLesson}강</Text>
                        <Text style={s.currentLesson}>{item.currentLesson}강</Text>
                      </View>
                    </View>
                  </Fragment>
                ))}
              </View>
            </View>
          </View>

          <View style={s.section}>
            <View>
              <View style={s.sectionHeader}>
                <View style={s.commentLabel}>
                  <Text style={s.sectionLabel}>선생님 코멘트</Text>
                  <View style={s.aiTag}>
                    <Text style={s.aiTagText}>AI 초안</Text>
                  </View>
                </View>
                <LinkButton label="초안 다시 만들기" onPress={onRegenerate && regenerate} />
              </View>
              <TextInput
                accessibilityLabel="선생님 코멘트"
                value={comment}
                onChangeText={setComment}
                multiline
                scrollEnabled={false}
                textAlignVertical="top"
              />
            </View>
            <Pressable
              role="checkbox"
              aria-checked={checked}
              accessibilityState={{ checked }}
              accessibilityLabel="코멘트를 확인했어요"
              onPress={() => setChecked((v) => !v)}
              hitSlop={8}
              style={s.checkRow}
            >
              <View aria-hidden style={s.checkSlot}>
                <View style={[s.checkBox, checked && s.checkBoxOn]}>
                  {checked && <View style={s.checkMark} />}
                </View>
              </View>
              <Text style={s.checkLabel}>코멘트를 확인했어요</Text>
            </Pressable>
            <View style={s.divider} />
            <View style={s.accordion}>
              <Pressable
                role="button"
                aria-expanded={softenedOpen}
                accessibilityState={{ expanded: softenedOpen }}
                onPress={() => setSoftenedOpen((v) => !v)}
                style={s.accordionHeader}
              >
                <Text style={s.accordionTitle}>AI가 부드럽게 만든 문장 보기</Text>
                <Image
                  source={arrowDownImage}
                  style={[s.icon, softenedOpen && s.iconFlipped]}
                  aria-hidden
                />
              </Pressable>
              {softenedOpen && <Text style={s.accordionBody}>{report.comment.softened}</Text>}
            </View>
          </View>

          <View>
            <View style={s.sectionHeader}>
              <View style={s.feeLabel}>
                <Text style={s.sectionLabel}>교육비 안내</Text>
              </View>
              <LinkButton label="수정" onPress={onEditFee} />
            </View>
            <View style={s.card}>
              <View style={s.rows}>
                <View style={s.totalBlock}>
                  <View style={s.tableRow}>
                    <Text style={s.totalLabel}>총 교육비</Text>
                    <Text style={s.totalValue}>{formatWon(fee.total)}</Text>
                  </View>
                  <View style={s.divider} />
                </View>
                <FeeRows
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
            </View>
          </View>
        </ScrollView>

        <View style={s.cta}>
          <Text style={s.helpText}>AI 코멘트를 한 번 확인해야 보낼 수 있어요.</Text>
          <ActionButton
            label="카톡으로 보내기"
            disabled={!checked || !comment.trim()}
            disabledAppearance="brand"
            onPress={() => onSend(comment.trim())}
          />
        </View>
      </View>
    </SafeAreaView>
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

function FeeRows({ rows }: { rows: [string, ReactNode][] }) {
  return rows.map(([label, value], i) => (
    <Fragment key={label}>
      {i > 0 && <View style={s.divider} />}
      <View style={s.tableRow}>
        <Text style={s.feeRowLabel}>{label}</Text>
        <Text style={s.feeRowValue}>{value}</Text>
      </View>
    </Fragment>
  ));
}
