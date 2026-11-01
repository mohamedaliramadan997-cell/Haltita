import Svg, { Path } from 'react-native-svg';

import { colors, type CardType } from '@/theme';

// One-colour line icons on a 100×100 grid, for the card backs (design.md §5, GameCard).
const EMBLEMS: Record<CardType, string> = {
  // A question mark.
  question: 'M32 34C32 14 68 12 68 34C68 50 50 50 50 66M50 84V85',
  // A halo over a sparkle.
  truth:
    'M26 18C26 10 74 10 74 18C74 26 26 26 26 18ZM50 36Q53 58 72 62Q53 66 50 88Q47 66 28 62Q47 58 50 36Z',
  // An eye-mask.
  liar: 'M10 36Q30 26 50 36Q70 26 90 36Q96 66 70 68Q56 68 50 56Q44 68 30 68Q4 66 10 36ZM24 46Q32 40 40 48Q32 54 24 46ZM60 48Q68 40 76 46Q68 54 60 48Z',
  // A lightning bolt.
  challenge: 'M58 8L22 56H46L40 92L78 40H54Z',
  // A sealed envelope.
  mission: 'M10 26H90V76H10ZM10 26L50 56L90 26',
};

type EmblemProps = {
  type: CardType;
  size?: number;
  color?: string;
};

export function Emblem({ type, size = 48, color = colors.text }: EmblemProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d={EMBLEMS[type]}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
