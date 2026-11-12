import { Image } from 'expo-image';
import homeIcon from '../../../assets/images/navigation/home.svg';
import homeActiveIcon from '../../../assets/images/navigation/home-active.svg';
import scheduleIcon from '../../../assets/images/navigation/schedule.svg';
import scheduleActiveIcon from '../../../assets/images/navigation/schedule-active.svg';
import studentsIcon from '../../../assets/images/navigation/students.svg';
import studentsActiveIcon from '../../../assets/images/navigation/students-active.svg';
import reportsIcon from '../../../assets/images/navigation/reports.svg';
import reportsActiveIcon from '../../../assets/images/navigation/reports-active.svg';
import incomeIcon from '../../../assets/images/navigation/income.svg';
import incomeActiveIcon from '../../../assets/images/navigation/income-active.svg';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { primitive, semantic } from '@/styles/colors';
import { gap, padding } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

// 아이콘 프레임(여백 포함) 크기
const ICON_SIZE = 32;
const icons: Record<string, { inactive: number; active: number }> = {
  home: { inactive: homeIcon, active: homeActiveIcon },
  schedule: { inactive: scheduleIcon, active: scheduleActiveIcon },
  students: { inactive: studentsIcon, active: studentsActiveIcon },
  reports: { inactive: reportsIcon, active: reportsActiveIcon },
  income: { inactive: incomeIcon, active: incomeActiveIcon },
};

export function MainTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  return (
    <View role="tablist" style={[s.bar, { paddingBottom: padding[16] + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = index === state.index;
        const icon = icons[route.name];
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        return (
          <Pressable
            key={route.key}
            role="tab"
            aria-selected={focused}
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={s.item}
          >
            {icon ? (
              <Image
                source={focused ? icon.active : icon.inactive}
                style={s.icon}
                contentFit="contain"
                loading="eager"
                accessible={false}
              />
            ) : (
              <View style={s.icon} />
            )}
            <Text style={[s.label, focused ? s.labelActive : s.labelInactive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: padding[16],
    paddingHorizontal: padding[24],
    backgroundColor: primitive.white[0],
  },
  item: { alignItems: 'center', gap: gap[4] },
  icon: { width: ICON_SIZE, height: ICON_SIZE },
  label: {
    fontSize: fontSize[12],
    lineHeight: lineHeight[12],
    fontWeight: fontWeight.semiBold,
    letterSpacing: letterSpacing.none,
    textAlign: 'center',
  },
  labelActive: { color: semantic.action.default },
  labelInactive: { color: semantic.text.default.weak },
});
