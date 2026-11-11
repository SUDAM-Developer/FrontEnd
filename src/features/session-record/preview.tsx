import { useRef, useState } from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Modal, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { SessionRecordScreen } from './SessionRecordScreen';
import { RecordComplete } from './RecordComplete';
import { s } from './styles';
import type {
  CancellationReason,
  CancellationResult,
  LessonContext,
  SaveCancellation,
  SaveRecord,
} from './types';

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    function abort() {
      clearTimeout(timer);
      reject(new Error('Aborted'));
    }
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}
const reasons: Record<string, CancellationReason> = {
  sameDay: '학생 당일 취소',
  advance: '학생 사전 취소',
  teacher: '선생님 사정',
  holiday: '공휴일',
};
export function SessionPreview({
  screen = 'record',
}: {
  screen?: 'record' | 'sheet' | 'complete' | 'record-complete';
}) {
  const params = useLocalSearchParams<{
    variant?: string;
    scenario?: string;
    consent?: string;
    policy?: string;
    reason?: string;
  }>();
  const router = useRouter();
  const [notice, setNotice] = useState<
    'coordinate' | 'parent-summary' | 'student-homework' | 'report' | null
  >(null);
  const recordAttempts = useRef(0);
  const cancelAttempts = useRef(0);
  if (!__DEV__) return <Redirect href="/home" />;
  const variant = params.variant ?? 'first';
  const empty = variant === 'empty';
  const lesson: LessonContext = {
    lessonId: 'preview-lesson',
    studentName: screen === 'record-complete' ? '윤서아' : '박도윤',
    dateLabel: '10월 14일 화요일',
    sessionNumber:
      screen === 'record-complete' ? 4 : variant === 'later' || variant === 'direct' ? 2 : 1,
    completedCount:
      screen === 'record-complete' ? 7 : variant === 'later' || variant === 'direct' ? 1 : 0,
    totalCount: screen === 'complete' || screen === 'record-complete' ? 8 : 5,
    sameDayCancellationCounts: params.policy === 'count',
    parentConsented: params.consent !== 'no',
    teacherLabel: 'OOO 선생님 · 영어',
    textbooks: empty
      ? []
      : [
          {
            id: 'book-english',
            name: '수능특강 영어',
            unit: '강',
            previousProgress: '6강',
            suggestions: ['7강', '7-8강', '8-9강'],
          },
          {
            id: 'book-grammar',
            name: 'Grammar Zone 기본',
            unit: 'Unit',
            previousProgress: 'Unit 16',
            suggestions: ['Unit 17', '17-18', '18-19'],
          },
        ],
    homeworkSuggestions: ['2단원 예습', '워크북 42~45p'],
  };
  function result(reason: CancellationReason): CancellationResult {
    const counted = reason === '학생 당일 취소' && lesson.sameDayCancellationCounts;
    return {
      reason,
      counted,
      completedCount: Math.min(lesson.completedCount + (counted ? 1 : 0), lesson.totalCount),
      totalCount: lesson.totalCount,
      parentConsented: lesson.parentConsented,
    };
  }
  const saveRecord: SaveRecord = async (_, signal) => {
    await wait(params.scenario === 'loading' ? 3000 : 650, signal);
    if (params.scenario === 'error' && ++recordAttempts.current === 1)
      throw new Error('Preview save failure');
    const count = Math.min(lesson.completedCount + 1, lesson.totalCount);
    return {
      completedCount: count,
      totalCount: lesson.totalCount,
      reportReady: count >= lesson.totalCount,
    };
  };
  const saveCancellation: SaveCancellation = async (input, signal) => {
    await wait(params.scenario === 'loading' ? 3000 : 650, signal);
    if (params.scenario === 'error' && ++cancelAttempts.current === 1)
      throw new Error('Preview save failure');
    return result(input.reason);
  };
  return (
    <>
      {screen === 'record-complete' ? (
        <RecordComplete
          lesson={lesson}
          record={{
            lessonId: lesson.lessonId,
            progress: [],
            understanding: '중',
            previousHomework: '일부',
            nextHomework: '워크북 49~52쪽',
            observation: '',
          }}
          result={{ completedCount: 8, totalCount: 8, reportReady: true }}
          onShare={setNotice}
          onReport={() => setNotice('report')}
          onHome={() => router.replace('/home')}
        />
      ) : (
        <SessionRecordScreen
          lesson={lesson}
          onSaveRecord={saveRecord}
          onSaveCancellation={saveCancellation}
          onBack={() => router.replace('/home')}
          onHome={() => router.replace('/home')}
          onCoordinate={() => setNotice('coordinate')}
          onShare={setNotice}
          onReport={() => setNotice('report')}
          initialFilled={variant !== 'blank' && !empty}
          initialDirect={variant === 'direct'}
          initialSheet={screen === 'sheet'}
          initialCompletion={
            screen === 'complete'
              ? result(reasons[params.reason ?? 'teacher'] ?? '선생님 사정')
              : undefined
          }
        />
      )}
      <Modal visible={notice !== null} transparent onRequestClose={() => setNotice(null)}>
        <View style={s.confirmBackdrop}>
          <View style={s.confirmCard}>
            <Text style={s.confirmTitle}>
              {notice === 'report'
                ? '정산 리포트'
                : notice === 'coordinate'
                  ? '보강 조율하기'
                  : '카카오 공유'}
            </Text>
            <Text style={s.description}>
              {notice === 'coordinate'
                ? '보강 날짜 조율 화면은 아직 연결되지 않았어요. 학부모에게 메시지를 전송하지 않았습니다.'
                : notice === 'report'
                  ? '정산 리포트 화면은 아직 연결되지 않았어요. 정산·교육비 청구는 실행하지 않았습니다.'
                  : `카카오 공유는 아직 연결되지 않았어요. ${notice === 'parent-summary' ? '학부모용 오늘 근황' : '학생용 다음 숙제'} 카드 미리보기이며 실제 메시지는 전송하지 않았습니다.`}
            </Text>
            <ActionButton label="닫기" onPress={() => setNotice(null)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
