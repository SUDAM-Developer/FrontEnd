import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { s } from './styles';
import type { HomeData } from './types';
/** 빠른 조회의 깜빡임을 줄이기 위해 500ms 이상 기다릴 때만 표시합니다. */
export function HomeLoading({ data }: { data: HomeData }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={s.loadingRoot} aria-busy accessibilityLabel="홈 정보 불러오는 중">
      {visible && (
        <ScrollView contentContainerStyle={s.content}>
          <View style={s.bannerSkeleton} />
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{data.dateLabel}</Text>
              <Text style={s.sectionCount}>{data.lessons.length}</Text>
            </View>
            <View
              style={[s.skeleton, s.lessonSkeleton]}
              role="progressbar"
              accessibilityLabel="홈 정보 불러오는 중"
            />
            <View style={s.dots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[s.dot, s.skeletonDot, i === 0 && s.skeletonActiveDot]} />
              ))}
            </View>
            <View style={[s.sectionHeader, s.tasksHeader]}>
              <Text style={s.sectionTitle}>할 일</Text>
              <Text style={s.sectionCount}>
                {data.tasks.reduce((sum, task) => sum + task.count, 0)}
              </Text>
            </View>
            <View style={[s.skeleton, s.tasksSkeleton]} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
