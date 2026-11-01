import Svg, { G, Path } from 'react-native-svg';

import { colors } from '@/theme';

// Mask shapes on a 100×100 grid, shared with Masky and Pattern.
export const MASK_FACE = 'M16 18C38 8 62 8 84 18C88 50 78 82 50 94C22 82 12 50 16 18Z';
export const MASK_EYES = 'M26 38Q36 30 44 40Q34 46 26 38ZM56 40Q64 30 74 38Q66 46 56 40Z';
const MASK_SMILE = 'M28 54Q50 60 72 54Q66 80 50 80Q34 80 28 54Z';
const MASK_FROWN = 'M32 76Q50 48 68 76Q50 66 32 76Z';

type MaskShapeProps = {
  fill: string;
  mood?: 'smile' | 'frown';
  transform?: string;
};

/** The theatre mask as SVG content, for use inside another `Svg`. */
export function MaskShape({ fill, mood = 'smile', transform }: MaskShapeProps) {
  return (
    <G transform={transform}>
      <Path d={MASK_FACE} fill={fill} stroke={colors.background} strokeWidth={5} />
      <Path d={MASK_EYES} fill={colors.background} />
      <Path d={mood === 'smile' ? MASK_SMILE : MASK_FROWN} fill={colors.background} />
    </G>
  );
}

type MaskTokenProps = {
  size?: number;
};

/** The point icon (design.md §5.1). */
export function MaskToken({ size = 24 }: MaskTokenProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <MaskShape fill={colors.mask} />
    </Svg>
  );
}
