import { useRef, useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { useSubmission } from '@/features/session-record/useSubmission';
import { CalendarPicker, TimePicker } from './DateTimePicker';
import { candidateError, normalizeDate, timeLabel, validTime } from './dateTime';
import { s } from './styles';
import type { MakeupActions, MakeupCandidate, MakeupLesson } from './types';
type Step = 'action' | 'candidates' | 'reschedule';
type Picker = { kind: 'date' | 'time'; id: string } | { kind: 'reschedule-time' };
type Props = {
  lesson: MakeupLesson;
  actions: MakeupActions;
  onClose: () => void;
  initialStep?: Step;
  initialCandidates?: MakeupCandidate[];
};
export function MakeupSheet({
  lesson,
  actions,
  onClose,
  initialStep = 'action',
  initialCandidates,
}: Props) {
  const [step, setStep] = useState<Step>(initialStep);
  const [candidates, setCandidates] = useState<MakeupCandidate[]>(() =>
    initialCandidates?.slice(0, 3).length
      ? initialCandidates.slice(0, 3)
      : [{ id: 'candidate-1', date: '', time: '' }],
  );
  const [picker, setPicker] = useState<Picker | null>(null);
  const [newTime, setNewTime] = useState(lesson.time);
  const [notice, setNotice] = useState<string | null>(null);
  const [registered, setRegistered] = useState(Boolean(lesson.alreadyCancelled));
  const nextId = useRef(4);
  const submit = useSubmission();
  const insets = useSafeAreaInsets();
  const error = candidateError(candidates);
  const mayShare = !error && lesson.parentConsented;
  function update(id: string, patch: Partial<MakeupCandidate>) {
    if (submit.pending) return;
    submit.clearError();
    setCandidates((current) => current.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function close() {
    if (submit.pending) return;
    Keyboard.dismiss();
    if (picker) setPicker(null);
    else onClose();
  }
  function register() {
    Keyboard.dismiss();
    if (registered) {
      setStep('candidates');
      return;
    }
    void submit.run(
      (signal) => actions.registerCancellation(lesson.id, signal),
      () => {
        setRegistered(true);
        setStep('candidates');
      },
    );
  }
  function share() {
    if (!mayShare || submit.pending) return;
    Keyboard.dismiss();
    const snapshot = candidates.map((c) => ({ ...c, date: normalizeDate(c.date)! }));
    void submit.run(
      (signal) => actions.shareCandidates(lesson.id, snapshot, signal),
      (result) =>
        setNotice(
          result === 'opened'
            ? '카카오 공유 창을 열었어요. 실제 전송 여부는 카카오톡에서 확인해 주세요.'
            : result === 'cancelled'
              ? '공유를 취소했어요. 보강 후보는 그대로 유지했어요.'
              : '카카오 공유는 아직 연결되지 않았어요. 선택한 후보를 확인했으며 실제 메시지는 보내지 않았습니다.',
        ),
    );
  }
  function reschedule() {
    if (!validTime(newTime) || newTime === lesson.time || submit.pending) return;
    void submit.run(
      (signal) => actions.rescheduleTime(lesson.id, newTime, signal),
      () =>
        setNotice('시간 변경 요청을 처리했어요. 확인용 화면에서는 실제 일정이 변경되지 않습니다.'),
    );
  }
  const target = picker && 'id' in picker ? candidates.find((c) => c.id === picker.id) : undefined;
  return (
    <Modal transparent visible animationType="slide" onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable
          role="button"
          accessibilityLabel="휴강 보강 시트 닫기"
          disabled={submit.pending}
          onPress={close}
          style={s.dismiss}
        />
        <View
          role="dialog"
          accessibilityLabel="휴강 보강 조율"
          accessibilityViewIsModal
          aria-busy={submit.pending}
          style={[s.sheet, { paddingBottom: Math.max(insets.bottom + 24, 52) }]}
        >
          <View style={s.handle} />
          {notice ? (
            <>
              <Text role="heading" style={s.heading}>
                처리 안내
              </Text>
              <Text role="status" style={s.notice}>
                {notice}
              </Text>
              <ActionButton label="확인" onPress={() => setNotice(null)} />
            </>
          ) : picker ? (
            <>
              {picker.kind === 'date' && target ? (
                <CalendarPicker
                  value={target.date}
                  fallback={lesson.date}
                  onChange={(date) => {
                    update(target.id, { date: date.replaceAll('-', '.') });
                    setPicker(null);
                  }}
                  onCancel={() => setPicker(null)}
                />
              ) : (
                <TimePicker
                  value={picker.kind === 'reschedule-time' ? newTime : (target?.time ?? '')}
                  onChange={(time) => {
                    if (picker.kind === 'reschedule-time') setNewTime(time);
                    else if (target) update(target.id, { time });
                    setPicker(null);
                  }}
                  onCancel={() => setPicker(null)}
                />
              )}
            </>
          ) : (
            <>
              <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
                {step === 'action' ? (
                  <>
                    <Text role="heading" style={s.heading}>
                      {lesson.dateLabel} {lesson.studentName} 수업
                    </Text>
                    <Text style={s.description}>
                      휴강하면 보강 날짜를 학부모님께 물어볼 수 있어요.
                    </Text>
                    <View style={s.actionSpacing} />
                  </>
                ) : step === 'candidates' ? (
                  <>
                    <Text role="heading" style={s.heading}>
                      보강 후보 날짜 고르기
                    </Text>
                    <Text style={s.description}>
                      {lesson.dateLabel} {lesson.studentName} 수업을 휴강해요. 가능한 날짜를 1~3개
                      고르면 학부모님이 그중 하나를 고르고, 안 맞으면 다른 날짜를 요청해요.
                    </Text>
                    {candidates.map((candidate, index) => (
                      <View key={candidate.id} style={s.candidate}>
                        <View style={s.candidateHeading}>
                          <Text style={s.label}>
                            보강 후보 {index + 1}
                            {index === 0 ? '*' : ''}
                          </Text>
                          {index > 0 && (
                            <Pressable
                              role="button"
                              accessibilityLabel={`보강 후보 ${index + 1} 삭제`}
                              disabled={submit.pending}
                              onPress={() => {
                                submit.clearError();

                                setCandidates((current) =>
                                  current.filter((c) => c.id !== candidate.id),
                                );
                              }}
                              style={s.remove}
                            >
                              <Text style={s.removeText}>×</Text>
                            </Pressable>
                          )}
                        </View>
                        <View style={s.row}>
                          <View style={s.dateColumn}>
                            <Pressable
                              role="button"
                              accessibilityLabel={`보강 후보 ${index + 1} 날짜 선택`}
                              disabled={submit.pending}
                              onPress={() => {
                                Keyboard.dismiss();
                                setPicker({ kind: 'date', id: candidate.id });
                              }}
                              style={s.dateButton}
                            >
                              <Text style={[s.timeText, !candidate.date && s.placeholder]}>
                                {candidate.date || '날짜 선택'}
                              </Text>
                            </Pressable>
                          </View>
                          <Pressable
                            role="button"
                            accessibilityLabel={`보강 후보 ${index + 1} 시간 선택`}
                            disabled={submit.pending}
                            onPress={() => {
                              Keyboard.dismiss();
                              setPicker({ kind: 'time', id: candidate.id });
                            }}
                            style={s.time}
                          >
                            <Text style={s.timeText}>{timeLabel(candidate.time)}</Text>
                            <Text style={s.caret}>⌃</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                    {candidates.length < 3 && (
                      <Pressable
                        role="button"
                        accessibilityLabel="보강 후보 추가"
                        disabled={submit.pending}
                        onPress={() => {
                          submit.clearError();
                          const id = `candidate-${nextId.current++}`;
                          setCandidates((current) =>
                            current.length < 3 ? [...current, { id, date: '', time: '' }] : current,
                          );
                        }}
                        style={s.add}
                      >
                        <Text style={s.addText}>후보 추가 ({candidates.length}/3)</Text>
                      </Pressable>
                    )}
                    {error && candidates.every((c) => c.date && c.time) && (
                      <Text role="alert" style={s.error}>
                        {error}
                      </Text>
                    )}
                    {!lesson.parentConsented && (
                      <Text role="alert" style={s.error}>
                        학부모 수신 동의 후 보강 후보를 공유할 수 있어요.
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text role="heading" style={s.heading}>
                      수업 시간만 바꾸기
                    </Text>
                    <Text style={s.description}>
                      {lesson.dateLabel} {lesson.studentName} 수업 날짜는 유지하고 시간만 변경해요.
                    </Text>
                    <Pressable
                      role="button"
                      accessibilityLabel="변경할 수업 시간 선택"
                      disabled={submit.pending}
                      onPress={() => setPicker({ kind: 'reschedule-time' })}
                      style={s.time}
                    >
                      <Text style={s.timeText}>{timeLabel(newTime)}</Text>
                      <Text style={s.caret}>⌃</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
              {submit.error && (
                <Text role="alert" style={s.error}>
                  처리하지 못했어요. 입력값은 유지했으니 다시 시도해 주세요.
                </Text>
              )}
              <View style={s.actions}>
                {step === 'action' ? (
                  <>
                    <ActionButton
                      label="휴강하고 보강 날짜 받기"
                      loading={submit.pending}
                      onPress={register}
                    />
                    <ActionButton
                      label="시간만 바꾸기"
                      variant="secondary"
                      disabled={submit.pending}
                      onPress={() => {
                        submit.clearError();
                        setStep('reschedule');
                      }}
                    />
                  </>
                ) : step === 'candidates' ? (
                  <>
                    <ActionButton
                      label={
                        error
                          ? '날짜와 시간을 골라주세요'
                          : `후보 ${candidates.length}개 카톡으로 보내기`
                      }
                      tone="strong"
                      disabledAppearance={error && lesson.parentConsented ? 'brand' : 'muted'}
                      disabled={!mayShare}
                      loading={submit.pending}
                      onPress={share}
                    />
                    <ActionButton
                      label="취소"
                      variant="secondary"
                      disabled={submit.pending}
                      onPress={onClose}
                    />
                  </>
                ) : (
                  <>
                    <ActionButton
                      label="시간 변경하기"
                      disabled={!validTime(newTime) || newTime === lesson.time}
                      loading={submit.pending}
                      onPress={reschedule}
                    />
                    <ActionButton
                      label="취소"
                      variant="secondary"
                      disabled={submit.pending}
                      onPress={() => {
                        submit.clearError();
                        setStep('action');
                      }}
                    />
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
