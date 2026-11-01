import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors, seatTints } from '@/theme';

import { MaskShape } from './MaskToken';

export type MaskyPose = 'honest' | 'sly' | 'detective' | 'shock' | 'exposed' | 'wait';

type MaskyProps = {
  pose: MaskyPose;
  /** Seat index; picks the mask tint and wraps after the last one. */
  seat?: number;
  size?: number;
};

const INK = colors.background;
const BODY = colors.surfaceLight;
const LEFT_EYE = 42;
const RIGHT_EYE = 78;
const EYE_Y = 80;

const Eye = ({ cx, cy = EYE_Y, r = 6 }: { cx: number; cy?: number; r?: number }) => (
  <G>
    <Ellipse cx={cx} cy={cy} rx={r} ry={r + 1} fill={INK} />
    <Circle cx={cx + 2} cy={cy - 3} r={r / 3} fill={BODY} />
  </G>
);

const Line = ({ d, color = INK, width = 3 }: { d: string; color?: string; width?: number }) => (
  <Path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
);

const Cheeks = () => (
  <G opacity={0.55} fill={colors.primary}>
    <Ellipse cx={32} cy={93} rx={7} ry={5} />
    <Ellipse cx={88} cy={93} rx={7} ry={5} />
  </G>
);

const Arms = () => (
  <G>
    <Line d="M30 92Q22 98 27 106Q31 110 37 108" />
    <Line d="M90 92Q98 98 93 106Q89 110 83 108" />
  </G>
);

// Small mask pushed up on the head, so poses with a bare face still show the seat tint.
const HeadMask = ({ tint }: { tint: string }) => (
  <MaskShape fill={tint} transform="translate(43 17) scale(0.34)" />
);

const poses: Record<MaskyPose, (tint: string) => ReactNode> = {
  honest: (tint) => (
    <G>
      <Ellipse cx={60} cy={9} rx={20} ry={5} fill="none" stroke={colors.mask} strokeWidth={3.5} />
      <MaskShape fill={tint} transform="translate(35 13) scale(0.5)" />
      <Eye cx={LEFT_EYE} />
      <Eye cx={RIGHT_EYE} />
      <Cheeks />
      <Line d="M50 96Q60 104 70 96" />
      <Arms />
    </G>
  ),
  // The eye-mask stays black per design.md §5.1; its outline carries the seat tint.
  sly: (tint) => (
    <G>
      <Path
        d="M20 72Q40 62 60 70Q80 62 100 72Q104 92 84 94Q68 94 60 84Q52 94 36 94Q16 92 20 72Z"
        fill={INK}
        stroke={tint}
        strokeWidth={3}
      />
      <Ellipse cx={LEFT_EYE} cy={80} rx={8} ry={6} fill={BODY} />
      <Circle cx={45} cy={80} r={4} fill={INK} />
      <Line d="M70 80Q78 74 86 80" color={BODY} />
      <Line d="M50 106Q62 112 74 101" />
      <Arms />
    </G>
  ),
  detective: (tint) => (
    <G>
      <HeadMask tint={tint} />
      <Line d="M28 96L18 118" color={colors.mask} width={6} />
      <Circle cx={40} cy={80} r={18} fill={BODY} stroke={colors.truth} strokeWidth={5} />
      <Eye cx={40} r={8} />
      <Line d="M68 64Q78 56 90 62" />
      <Eye cx={RIGHT_EYE} />
      <Line d="M54 106Q60 100 66 106" />
      <Line d="M90 92Q98 98 93 106Q89 110 83 108" />
    </G>
  ),
  shock: (tint) => (
    <G>
      <MaskShape fill={tint} mood="frown" transform="translate(14 22) rotate(-25) scale(0.5)" />
      <G>
        <Line d="M4 48L14 54" color={colors.primary} />
        <Line d="M4 62L14 62" color={colors.primary} />
        <Line d="M12 34L19 44" color={colors.primary} />
      </G>
      <Eye cx={LEFT_EYE} r={7} />
      <Eye cx={RIGHT_EYE} r={7} />
      <Ellipse cx={60} cy={100} rx={6} ry={8} fill={INK} />
      <Arms />
    </G>
  ),
  exposed: (tint) => (
    <G>
      <Rect x={26} y={86} width={68} height={11} rx={5} fill={colors.primary} opacity={0.45} />
      <Line d="M34 66Q42 62 48 68" />
      <Line d="M72 68Q78 62 86 66" />
      <Eye cx={LEFT_EYE} />
      <Eye cx={RIGHT_EYE} />
      <Line d="M50 108Q60 100 70 108" />
      <Line d="M90 92Q98 98 93 106Q89 110 83 108" />
      <MaskShape fill={tint} mood="frown" transform="translate(2 92) rotate(-12) scale(0.38)" />
      <Line d="M14 96L20 106L15 114L21 124" />
      <Path d="M42 128L48 122L52 130Z" fill={tint} stroke={INK} strokeWidth={1.5} />
    </G>
  ),
  wait: (tint) => (
    <G>
      <HeadMask tint={tint} />
      <Eye cx={LEFT_EYE} />
      <Eye cx={RIGHT_EYE} />
      <Rect x={32} y={70} width={20} height={8} fill={BODY} />
      <Rect x={68} y={70} width={20} height={8} fill={BODY} />
      <Line d="M32 78H52" />
      <Line d="M68 78H88" />
      <Line d="M52 104Q60 98 68 104" />
      <Arms />
      {/* Tapping foot with motion marks. */}
      <Line d="M4 112Q0 120 4 128" color={colors.primary} />
      <Line d="M10 114Q7 120 10 126" color={colors.primary} />
    </G>
  ),
};

/** The Masky character (design.md §5.1). */
export function Masky({ pose, seat = 0, size = 96 }: MaskyProps) {
  const tint = seatTints[seat % seatTints.length];
  // The tapping foot lifts off the ground and out from under the body.
  const [leftFootX, leftFootY] = pose === 'wait' ? [28, 120] : [40, 127];

  return (
    <Svg width={size} height={(size * 140) / 120} viewBox="0 0 120 140">
      <Ellipse cx={60} cy={132} rx={40} ry={6} fill={colors.shadow} />
      <Ellipse
        cx={leftFootX}
        cy={leftFootY}
        rx={11}
        ry={6}
        fill={BODY}
        stroke={INK}
        strokeWidth={3}
      />
      <Ellipse cx={80} cy={127} rx={11} ry={6} fill={BODY} stroke={INK} strokeWidth={3} />
      <Path
        d="M60 36C88 36 104 58 104 88C104 114 86 126 60 126C34 126 16 114 16 88C16 58 32 36 60 36Z"
        fill={BODY}
        stroke={INK}
        strokeWidth={3}
      />
      {poses[pose](tint)}
    </Svg>
  );
}
