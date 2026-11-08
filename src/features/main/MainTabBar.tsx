import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { primitive, semantic } from '@/styles/colors';
import { gap, padding } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

// 아이콘 프레임(여백 포함) 크기
const ICON_SIZE = 32;

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
            <View style={s.icon} />
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
  labelInactive: { color: semantic.icon.secondary },
});
