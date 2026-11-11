import loadingImage from '../../assets/images/loading.svg';
import { useEffect, useState } from 'react';
import { Animated, Easing, Modal, Platform, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { semantic } from '@/styles/colors';
import { radius } from '@/styles/measurement';

const BOX_WIDTH = 120;
const BOX_HEIGHT = 130;
const SPINNER_SIZE = 80;
// SVG에 그림자 여백이 포함되어 있어 원(80)보다 이미지가 큽니다. (원 80 / 이미지 104)
const SPINNER_IMAGE_SIZE = (SPINNER_SIZE * 104) / 80;
const ROTATION_MS = 1000;

export type LoadingProps = {
  visible: boolean;
};

/** 화면 가운데에 로딩 상자를 띄우고, 로딩 중에는 뒤쪽 화면을 누를 수 없게 막습니다. */
export function Loading({ visible }: LoadingProps) {
  const [rotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;
    rotation.setValue(0);
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: ROTATION_MS,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, rotation]);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => {}}>
      <View style={s.overlay}>
        <View role="progressbar" aria-busy accessibilityLabel="로딩 중" style={s.box}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Image source={loadingImage} style={s.spinner} loading="eager" />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: radius.medium,
    backgroundColor: semantic.surface.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: { width: SPINNER_IMAGE_SIZE, height: SPINNER_IMAGE_SIZE },
});
