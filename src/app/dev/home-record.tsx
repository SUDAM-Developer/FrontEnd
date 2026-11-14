import { Redirect, useLocalSearchParams } from 'expo-router';
import { CAN_PREVIEW } from '@/config/review';
import { homePreviewData } from '@/features/home/previewData';
import { SessionPreview } from '@/features/session-record/preview';
export default function Screen() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const lesson = homePreviewData.lessons.find((item) => item.id === lessonId);
  if (!CAN_PREVIEW || !lesson) return <Redirect href="/home" />;
  return (
    <SessionPreview
      lessonOverride={{
        lessonId: lesson.id,
        studentName: lesson.studentName,
        dateLabel: homePreviewData.dateLabel,
        sessionNumber: lesson.sessionNumber,
        completedCount: lesson.completedCount,
        totalCount: lesson.totalCount,
        sameDayCancellationCounts: false,
        parentConsented: true,
        teacherLabel: homePreviewData.teacherLabel,
        textbooks: [
          {
            id: 'home-preview-book',
            name: '수능특강 영어',
            unit: '강',
            previousProgress: '6강',
            suggestions: ['7강', '7-8강', '8-9강'],
          },
        ],
        homeworkSuggestions: ['워크북 42~45p'],
      }}
    />
  );
}
