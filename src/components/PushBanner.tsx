import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
import { radius, padding, gap } from '@/styles/measurement';
import icon from '../../assets/images/push-banner-icon.svg';
export type PushBannerProps = {
  title: string;
  message: string;
  timeLabel?: string;
  onPress: () => void;
  onDismiss: () => void;
};
/** 앱 내부 배너입니다. OS 푸시 권한이나 실제 알림 수신 기능을 포함하지 않습니다. */
export function PushBanner({
  title,
  message,
  timeLabel = '지금',
  onPress,
  onDismiss,
}: PushBannerProps) {
  return (
    <View role="status" accessibilityLiveRegion="polite" style={s.shadow}>
      <Pressable
        role="button"
        accessibilityLabel={`SUDAM, ${title}, ${message}, ${timeLabel}`}
        accessibilityHint="알림 열기. 접근성 동작으로 닫을 수 있어요."
        accessibilityActions={[{ name: 'dismiss', label: '알림 닫기' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'dismiss') onDismiss();
        }}
        onAccessibilityEscape={onDismiss}
        onPress={onPress}
        style={({ pressed }) => [s.card, pressed && s.pressed]}
      >
        <Image source={icon} style={s.icon} />
        <View style={s.content}>
          <View style={s.meta}>
            <Text style={s.brand}>SUDAM</Text>
            <Text style={s.time}>{timeLabel}</Text>
          </View>
          <Text style={s.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={s.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  shadow: {
    borderRadius: radius.large,
    backgroundColor: c.surface.subtle,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.18)',
    elevation: 6,
  },
  card: {
    minHeight: 82,
    borderRadius: radius.large,
    paddingHorizontal: 14,
    paddingVertical: padding[12],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: c.surface.subtle,
  },
  pressed: { opacity: 0.85 },
  icon: { width: 38, height: 38 },
  content: { flex: 1, minWidth: 0 },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    gap: gap[8],
  },
  brand: { ...t.caption[1].semiBold, color: c.text.default.strong },
  time: { ...t.caption[1].regular, color: c.text.default.strong },
  title: { ...t.body[3].semiBold, color: c.text.default.normal },
  message: { ...t.caption[1].regular, color: c.text.default.normal },
});
