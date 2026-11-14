import { StyleSheet, Text, View } from 'react-native';
import { semantic } from '@/styles/colors';
import { gap, padding, radius } from '@/styles/measurement';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '@/styles/typography';

const SEGMENT_WIDTH = 54;
const SEGMENT_HEIGHT = 6;

export type ProgressBarProps = {
  /** 현재 단계 (1부터 시작) */
  step: number;
  /** 전체 단계 수 */
  total: number;
  /** 막대 아래 `step/total` 표시 여부 */
  showLabel?: boolean;
  /** true면 막대가 부모 너비를 꽉 채우고 칸 너비를 나눠 가집니다. */
  stretch?: boolean;
};

export function ProgressBar({ step, total, showLabel = true, stretch = false }: ProgressBarProps) {
  const current = Math.min(Math.max(step, 0), total);

  return (
    <View
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`${current}/${total}`}
      style={[s.root, stretch && s.rootStretch]}
    >
      <View style={[s.track, stretch && s.trackStretch]}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[s.segment, stretch && s.segmentStretch, i < current && s.segmentFilled]}
          />
        ))}
      </View>
      {showLabel ? (
        <Text style={s.label}>
          {current}/{total}
        </Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { alignItems: 'center', gap: gap[12] },
  rootStretch: { alignSelf: 'stretch', paddingVertical: padding[4] },
  track: { flexDirection: 'row', gap: gap[2] },
  trackStretch: { alignSelf: 'stretch', paddingHorizontal: padding[4] },
  segment: {
    width: SEGMENT_WIDTH,
    height: SEGMENT_HEIGHT,
    borderRadius: radius.small,
    backgroundColor: semantic.surface.disabled,
  },
  segmentStretch: { flex: 1, width: undefined },
  segmentFilled: { backgroundColor: semantic.icon.brand },
  label: {
    fontSize: fontSize[12],
    lineHeight: lineHeight[12],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.none,
    textAlign: 'center',
    color: semantic.text.default.normal,
  },
});
