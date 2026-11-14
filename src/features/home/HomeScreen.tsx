import { useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import logo from '../../../assets/images/home-logo.svg';
import installArt from '../../../assets/images/home-install-art.svg';
import type { HomeData, HomeLesson, HomeTask } from './types';
import { s } from './styles';
import { HomeLoading } from './HomeLoading';
import { FirstTutoring } from './FirstTutoring';
import type { PreparationStep } from './FirstTutoring';
import emptyArt from '../../../assets/images/home-empty.svg';

type Props = {
  data: HomeData;
  loading?: boolean;
  firstTutoring?: boolean;
  onPreparationStep: (step: PreparationStep) => void;
  onStudents: () => void;
  onProfile: () => void;
  onRecord: (lesson: HomeLesson) => void;
  onTask: (task: HomeTask) => void;
  onInstallInfo: () => void;
};
export function HomeScreen({
  data,
  loading = false,
  firstTutoring = false,
  onPreparationStep,
  onStudents,
  onProfile,
  onRecord,
  onTask,
  onInstallInfo,
}: Props) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(342);
  const cardStride = cardWidth + 16;
  const carousel = useRef<ComponentRef<typeof ScrollView>>(null);
  const todoCount = data.tasks.reduce((sum, task) => sum + task.count, 0);
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <View style={s.webInset} />
      <View style={s.header}>
        <Image source={logo} style={s.logo} contentFit="contain" accessibilityLabel="SUDAM" />
        <Pressable
          role="button"
          accessibilityLabel="프로필 및 설정"
          onPress={onProfile}
          style={s.profile}
        >
          <Text numberOfLines={1} style={s.profileText}>
            {data.teacherLabel}
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <HomeLoading data={data} />
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          {bannerVisible && (
            <View style={s.banner}>
              <Pressable
                role="button"
                accessibilityLabel="홈 화면 추가 및 알림 안내"
                onPress={onInstallInfo}
                style={s.bannerBody}
              >
                <Image source={installArt} style={s.art} contentFit="contain" accessible={false} />
                <View style={s.bannerCopy}>
                  <Text style={s.bannerTitle}>홈 화면에 추가하고 알림 받기</Text>
                  <Text style={s.bannerText}>
                    수업이 끝나면 기록 알림,{'\n'}입금 · 보강 답이 오면 바로 알려드려요
                  </Text>
                </View>
              </Pressable>
              <Pressable
                role="button"
                accessibilityLabel="홈 화면 추가 안내 닫기"
                onPress={() => setBannerVisible(false)}
                style={s.close}
              >
                <Text style={s.closeText}>×</Text>
              </Pressable>
            </View>
          )}
          {firstTutoring ? (
            <FirstTutoring onStep={onPreparationStep} />
          ) : (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>{data.dateLabel}</Text>
                <Text style={s.sectionCount}>{data.lessons.length}</Text>
              </View>
              {data.lessons.length > 0 && (
                <View
                  style={s.carouselViewport}
                  onLayout={(event) =>
                    setCardWidth(Math.max(1, event.nativeEvent.layout.width - 24))
                  }
                >
                  <ScrollView
                    ref={carousel}
                    horizontal
                    pagingEnabled
                    contentContainerStyle={s.carouselContent}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(event) => {
                      const index = Math.round(event.nativeEvent.contentOffset.x / cardStride);
                      setActiveIndex(Math.max(0, Math.min(data.lessons.length - 1, index)));
                    }}
                  >
                    {data.lessons.map((lesson) => (
                      <View
                        key={lesson.id}
                        style={[s.lesson, { width: cardWidth, marginRight: 16 }]}
                      >
                        <Text style={s.session}>오늘 {lesson.sessionNumber}회차</Text>
                        <View style={s.lessonRow}>
                          <View style={s.lessonInfo}>
                            <View style={s.studentRow}>
                              <Text style={s.student}>{lesson.studentName}</Text>
                              <Text style={s.description}>{lesson.description}</Text>
                            </View>
                            <Text style={s.schedule}>{lesson.schedule}</Text>
                          </View>
                          <ActionButton
                            label="기록하기"
                            size="S"
                            onPress={() => onRecord(lesson)}
                          />
                        </View>
                        <View
                          style={s.progress}
                          accessibilityLabel={`완료 ${lesson.completedCount}/${lesson.totalCount}회차`}
                        >
                          {Array.from({ length: lesson.totalCount }, (_, i) => (
                            <View
                              key={i}
                              style={[s.segment, i < lesson.completedCount && s.segmentFilled]}
                            />
                          ))}
                        </View>
                        <Text style={s.progressText}>
                          오늘 기록하면 정산{' '}
                          {Math.min(lesson.completedCount + 1, lesson.totalCount)}/
                          {lesson.totalCount}회차가 돼요
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
              {data.lessons.length === 0 && (
                <View style={s.emptyCard}>
                  <Image
                    source={emptyArt}
                    style={s.emptyArt}
                    contentFit="contain"
                    accessible={false}
                  />
                  <Text style={s.emptyLabel}>오늘은 수업이 없어요</Text>
                  <View style={s.studentsButton}>
                    <ActionButton
                      label="학생 목록 바로가기"
                      size="M"
                      fullWidth
                      onPress={onStudents}
                    />
                  </View>
                </View>
              )}
              {data.lessons.length > 0 && (
                <View style={s.dots}>
                  {data.lessons.map((lesson, index) => (
                    <Pressable
                      key={lesson.id}
                      role="button"
                      accessibilityLabel={`${index + 1}번째 수업 보기`}
                      accessibilityState={{ selected: activeIndex === index }}
                      style={s.dotTarget}
                      onPress={() => {
                        setActiveIndex(index);
                        carousel.current?.scrollTo({ x: cardStride * index, animated: true });
                      }}
                    >
                      <View style={[s.dot, activeIndex === index && s.activeDot]} />
                    </Pressable>
                  ))}
                </View>
              )}
              <View
                style={[
                  s.sectionHeader,
                  s.tasksHeader,
                  data.lessons.length === 0 && s.emptyTasksHeader,
                ]}
              >
                <Text style={s.sectionTitle}>할 일</Text>
                <Text style={s.sectionCount}>{todoCount}</Text>
              </View>
              <View style={[s.tasks, data.lessons.length === 0 && s.emptyTasks]}>
                {data.tasks.map((task, index) => (
                  <Pressable
                    key={task.id}
                    role="button"
                    accessibilityLabel={`${task.label} ${task.count}건`}
                    disabled={task.count === 0}
                    onPress={() => onTask(task)}
                    style={[s.task, index > 0 && s.taskBorder]}
                  >
                    <Text style={s.taskLabel}>{task.label}</Text>
                    <Text style={[s.taskCount, task.count > 0 && s.taskCountActive]}>
                      {task.count}건
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
