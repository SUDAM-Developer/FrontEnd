import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import onGraphic from '../../assets/images/toggle-on.svg';
import offGraphic from '../../assets/images/toggle-off.svg';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

/** 값은 부모가 관리하며, 시안의 켜짐·꺼짐 그래픽을 사용합니다. */
export function ToggleSwitch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
}: Props) {
  return (
    <Pressable
      role="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[s.control, disabled && s.disabled]}
    >
      <Image
        source={value ? onGraphic : offGraphic}
        style={s.graphic}
        accessible={false}
        contentFit="contain"
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  control: { minWidth: 50, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  graphic: { width: 50, height: 28 },
  disabled: { opacity: 0.4 },
});
