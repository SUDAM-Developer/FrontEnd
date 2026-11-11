import { Pressable, StyleSheet, Text, View } from 'react-native';
import { semantic } from '@/styles/colors';
import { gap, lineWeight, radius } from '@/styles/measurement';
import { typography } from '@/styles/typography';

type Props = { label: string; checked: boolean; disabled: boolean; onPress: () => void };
export function TermsCheckbox({ label, checked, disabled, onPress }: Props) {
  return (
    <Pressable
      role="checkbox"
      aria-checked={checked}
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      <View aria-hidden style={[s.box, checked && s.checked]}>
        {checked && <View style={s.check} />}
      </View>
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  row: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap[8],
    paddingLeft: 2,
  },
  pressed: { opacity: 0.7 },
  box: {
    width: 16,
    height: 16,
    borderRadius: radius.small,
    borderWidth: lineWeight.regular,
    borderColor: semantic.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: semantic.icon.brand, borderColor: semantic.icon.brand },
  check: {
    width: 8,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: semantic.text.default.inverse,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  label: { ...typography.body[3].regular, color: semantic.text.default.normal, flexShrink: 1 },
});
