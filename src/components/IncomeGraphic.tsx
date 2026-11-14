import { Image } from 'expo-image';
import type { ImageProps } from 'expo-image';
import graphic from '../../assets/images/income-graphic.png';

type Props = {
  size?: number;
  style?: ImageProps['style'];
};

/** 수입 관련 카드에서 재사용하는 장식 그래픽. 텍스트 정보는 부모 화면에서 제공합니다. */
export function IncomeGraphic({ size = 100, style }: Props) {
  return (
    <Image
      source={graphic}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      accessible={false}
    />
  );
}
