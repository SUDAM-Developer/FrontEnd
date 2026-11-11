import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { Chip } from '@/components/Chip';
import { Loading } from '@/components/Loading';
import { TextInput } from '@/components/TextInput';
import { BookEditor } from './BookEditor';
import { Choices } from './Choices';
import { CancellationSheet } from './CancellationSheet';
import { CancellationComplete } from './CancellationComplete';
import { RecordComplete } from './RecordComplete';
import { s } from './styles';
import { useSubmission } from './useSubmission';
import type {
  BookProgress,
  CancellationResult,
  HomeworkStatus,
  LessonContext,
  SaveCancellation,
  SaveRecord,
  SessionRecordResult,
  RecordShareTarget,
  SessionRecord,
  Textbook,
  Understanding,
} from './types';

type Props = {
  lesson: LessonContext;
  onSaveRecord: SaveRecord;
  onSaveCancellation: SaveCancellation;
  onBack: () => void;
  onHome: () => void;
  onCoordinate: () => void;
  onShare: (target: RecordShareTarget) => void;
  onReport: () => void;
  initialFilled?: boolean;
  initialDirect?: boolean;
  initialSheet?: boolean;
  initialCompletion?: CancellationResult;
  onRecorded?: (record: SessionRecord) => void;
};
export function SessionRecordScreen({
  lesson,
  onSaveRecord,
  onSaveCancellation,
  onBack,
  onHome,
  onCoordinate,
  onShare,
  onReport,
  initialFilled = false,
  initialDirect = false,
  initialSheet = false,
  initialCompletion,
  onRecorded,
}: Props) {
  const [books, setBooks] = useState<Textbook[]>(lesson.textbooks);
  const [progress, setProgress] = useState<Record<string, string>>(() =>
    initialFilled
      ? Object.fromEntries(
          lesson.textbooks.map((book, i) => [book.id, book.suggestions[i === 1 ? 1 : 0] ?? '']),
        )
      : {},
  );
  const [customProgress, setCustomProgress] = useState<Record<string, string>>({});
  const [understanding, setUnderstanding] = useState<Understanding | null>(
    initialFilled ? '중' : null,
  );
  const selectedUnderstanding = understanding;
  const [homework, setHomework] = useState<HomeworkStatus | null>(initialFilled ? '일부' : null);
  const [nextHomework, setNextHomework] = useState(initialDirect ? '직접' : '');
  const [customHomework, setCustomHomework] = useState('');
  const [observation, setObservation] = useState('');
  const [editingBook, setEditingBook] = useState(lesson.textbooks.length === 0);
  const [sheet, setSheet] = useState(initialSheet);
  const [completion, setCompletion] = useState<CancellationResult | undefined>(initialCompletion);
  const [saved, setSaved] = useState<{ record: SessionRecord; result: SessionRecordResult } | null>(
    null,
  );
  const [discard, setDiscard] = useState(false);
  const nextBookId = useRef(0);
  const submit = useSubmission();
  const validProgress =
    books.length > 0 &&
    books.every(
      (book) =>
        Boolean(progress[book.id]) &&
        (progress[book.id] !== '직접' || Boolean(customProgress[book.id]?.trim())),
    );
  const canSave =
    validProgress && selectedUnderstanding !== null && homework !== null && !editingBook;
  const dirty =
    Object.values(progress).some(Boolean) ||
    selectedUnderstanding !== null ||
    homework !== null ||
    Boolean(observation) ||
    Boolean(nextHomework) ||
    books.length !== lesson.textbooks.length ||
    editingBook;
  function save() {
    if (!canSave || submit.pending || !selectedUnderstanding || !homework) return;
    Keyboard.dismiss();
    const entries: BookProgress[] = books.map((book) => ({
      book: { ...book, suggestions: [...book.suggestions] },
      value: progress[book.id] === '직접' ? customProgress[book.id].trim() : progress[book.id],
      skipped: progress[book.id] === '안 함',
    }));
    const record: SessionRecord = {
      lessonId: lesson.lessonId,
      progress: entries,
      understanding: selectedUnderstanding,
      previousHomework: homework,
      nextHomework:
        nextHomework === '직접'
          ? customHomework.trim()
          : nextHomework === '없음'
            ? ''
            : nextHomework,
      observation: observation.trim(),
    };
    void submit.run(
      (signal) => onSaveRecord(record, signal),
      (result) => {
        setSaved({ record, result });
        onRecorded?.(record);
      },
    );
  }
  function register(book: Omit<Textbook, 'id'>) {
    const id = `local-book-${++nextBookId.current}`;
    setBooks((current) => [...current, { ...book, id }]);
    setEditingBook(false);
    submit.clearError();
  }
  function leave() {
    if (submit.pending) return;
    if (dirty) setDiscard(true);
    else onBack();
  }
  if (saved)
    return (
      <RecordComplete
        lesson={lesson}
        record={saved.record}
        result={saved.result}
        onShare={onShare}
        onReport={onReport}
        onHome={onHome}
      />
    );
  if (completion)
    return (
      <CancellationComplete
        result={completion}
        teacherLabel={lesson.teacherLabel}
        onHome={onHome}
        onCoordinate={onCoordinate}
      />
    );
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.phone}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <Pressable
            role="button"
            accessibilityLabel="수업 기록 뒤로 가기"
            disabled={submit.pending}
            onPress={leave}
            style={s.back}
          >
            <Text style={s.backText}>←</Text>
          </Pressable>
          <Text role="heading" style={s.headerTitle}>
            수업 기록
          </Text>
          <Pressable
            role="button"
            accessibilityLabel="휴강 기록하기"
            disabled={submit.pending}
            onPress={() => {
              Keyboard.dismiss();
              setSheet(true);
            }}
            style={s.leave}
          >
            <Text style={s.link}>휴강</Text>
          </Pressable>
        </View>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.student}>{lesson.studentName} 학생</Text>
          <Text style={s.lessonTitle}>
            {lesson.dateLabel}, <Text style={s.blue}>{lesson.sessionNumber}</Text>회차
          </Text>
          <View
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={lesson.totalCount}
            aria-valuenow={lesson.sessionNumber}
            accessibilityLabel="기록 후 인정 회차"
            style={s.track}
          >
            {Array.from({ length: lesson.totalCount }, (_, i) => (
              <View key={i} style={[s.segment, i < lesson.sessionNumber && s.filledSegment]} />
            ))}
          </View>
          <Text style={s.progressText}>
            기록하면 정산{' '}
            <Text style={s.blue}>
              {lesson.sessionNumber}/{lesson.totalCount}
            </Text>
            회차가 돼요
          </Text>
          <View style={s.section}>
            <Text style={s.label}>교재별 진도</Text>
            {books.map((book) => (
              <View key={book.id} style={s.card}>
                <View style={s.bookHeading}>
                  <Text style={s.bookName}>{book.name}</Text>
                  {book.previousProgress && (
                    <Text style={s.previous}>지난 {book.previousProgress}</Text>
                  )}
                </View>
                {book.previousProgress && book.suggestions.length > 0 && (
                  <View style={s.chips}>
                    {[
                      ...book.suggestions,
                      ...(book.unit === 'Unit' ? ['안 함', '직접'] : ['직접', '안 함']),
                    ].map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        selected={progress[book.id] === value}
                        disabled={submit.pending}
                        onPress={() => {
                          submit.clearError();
                          setProgress((current) => ({
                            ...current,
                            [book.id]: current[book.id] === value ? '' : value,
                          }));
                        }}
                      />
                    ))}
                  </View>
                )}
                {(!book.previousProgress ||
                  book.suggestions.length === 0 ||
                  progress[book.id] === '직접') && (
                  <TextInput
                    accessibilityLabel={`${book.name} 진도 직접 입력`}
                    value={customProgress[book.id] ?? ''}
                    editable={!submit.pending}
                    maxLength={100}
                    placeholder="진도를 직접 입력해주세요"
                    onChangeText={(value) => {
                      submit.clearError();
                      setCustomProgress((current) => ({ ...current, [book.id]: value }));
                      setProgress((current) => ({ ...current, [book.id]: '직접' }));
                    }}
                  />
                )}
                {book.id.startsWith('local-book-') && (
                  <Pressable
                    role="button"
                    accessibilityLabel={`${book.name} 교재 삭제`}
                    disabled={submit.pending}
                    onPress={() => setBooks((current) => current.filter((v) => v.id !== book.id))}
                  >
                    <Text style={s.previous}>교재 삭제</Text>
                  </Pressable>
                )}
              </View>
            ))}
            {editingBook && (
              <BookEditor
                number={books.length + 1}
                disabled={submit.pending}
                onRegister={register}
                onCancel={() => setEditingBook(false)}
              />
            )}
            <Pressable
              role="button"
              accessibilityLabel="교재 추가"
              disabled={editingBook || submit.pending}
              onPress={() => setEditingBook(true)}
              style={s.add}
            >
              <Text style={s.plus}>＋</Text>
              <Text style={s.addText}>교재 추가</Text>
            </Pressable>
          </View>
          <View style={s.section}>
            <Text style={s.label}>이해도</Text>
            <Choices
              label="이해도"
              options={['상', '중', '하'] as const}
              value={selectedUnderstanding}
              disabled={submit.pending}
              onChange={(value) => {
                submit.clearError();
                setUnderstanding(value);
              }}
            />
          </View>
          <View style={s.section}>
            <Text style={s.label}>지난 숙제 수행</Text>
            <Choices
              label="지난 숙제 수행"
              options={['완료', '일부', '안함'] as const}
              value={homework}
              disabled={submit.pending}
              onChange={(value) => {
                submit.clearError();
                setHomework(value);
              }}
            />
          </View>
          <View style={s.section}>
            <Text style={s.label}>다음 숙제</Text>
            <View style={s.chips}>
              {[...lesson.homeworkSuggestions, '없음', '직접'].map((value) => (
                <Chip
                  key={value}
                  label={value}
                  selected={nextHomework === value}
                  disabled={submit.pending}
                  onPress={() => setNextHomework((current) => (current === value ? '' : value))}
                />
              ))}
            </View>
            {nextHomework === '직접' && (
              <View style={{ marginTop: 12 }}>
                <Text style={s.label}>다음 숙제 직접 입력 (선택)</Text>
                <TextInput
                  accessibilityLabel="다음 숙제 직접 입력"
                  editable={!submit.pending}
                  value={customHomework}
                  onChangeText={setCustomHomework}
                  maxLength={300}
                  placeholder="다음 숙제를 입력해주세요"
                />
              </View>
            )}
          </View>
          <View style={s.section}>
            <Text style={s.label}>관찰 한줄 (선택)</Text>
            <TextInput
              accessibilityLabel="관찰 한줄"
              editable={!submit.pending}
              value={observation}
              onChangeText={setObservation}
              maxLength={500}
              placeholder="예: 원서를 이전보다 흥미롭게 공부함"
            />
          </View>
        </ScrollView>
        <View style={s.footer}>
          {submit.error ? (
            <View role="alert" style={s.toast}>
              <Text style={s.toastText}>다시 시도해주세요</Text>
            </View>
          ) : (
            <Text style={s.hint}>진도·이해도·지난 숙제를 고르면 저장할 수 있어요</Text>
          )}
          <ActionButton
            label={submit.error ? '다시 저장' : '저장하기'}
            disabled={!canSave}
            loading={submit.pending}
            onPress={save}
          />
        </View>
      </KeyboardAvoidingView>
      <Loading visible={submit.pending} />
      {sheet && (
        <CancellationSheet
          lesson={lesson}
          onClose={() => setSheet(false)}
          onSave={onSaveCancellation}
          onComplete={(result) => {
            setSheet(false);
            setCompletion(result);
          }}
        />
      )}
      <Modal
        visible={discard}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setDiscard(false);
        }}
      >
        <View style={s.confirmBackdrop}>
          <View style={s.confirmCard}>
            <Text role="heading" style={s.confirmTitle}>
              입력 중인 기록을 나갈까요?
            </Text>
            <Text style={s.description}>입력한 내용은 저장되지 않아요.</Text>
            {discard && (
              <ActionButton
                label="계속 작성"
                variant="secondary"
                onPress={() => setDiscard(false)}
              />
            )}
            <ActionButton
              label="나가기"
              onPress={() => {
                setDiscard(false);
                onBack();
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
