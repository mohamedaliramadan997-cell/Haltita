import { StyleSheet } from 'react-native';
import Svg, { Defs, G, Path, Pattern as SvgPattern, Rect } from 'react-native-svg';

import { colors } from '@/theme';

import { MASK_EYES, MASK_FACE } from './MaskToken';

const CELL = 80;
const TILE = CELL * 3;
// An eight-point star (two overlapping squares) with lines joining it to its neighbours.
const STAR =
  'M22 22H58V58H22ZM40 14.5L65.5 40L40 65.5L14.5 40ZM40 0V14.5M40 65.5V80M0 40H14.5M65.5 40H80';
const CELLS = [0, 1, 2].flatMap((row) => [0, 1, 2].map((column) => [column, row]));
// Tiny mask centres, in the gaps where four cells meet.
const MASKS = [
  [CELL, CELL],
  [CELL * 2, CELL * 2],
];
const MASK_SCALE = 0.2;

/** The star-lattice background (design.md §2.4). Fills its parent and ignores touches. */
export function Pattern() {
  return (
    <Svg width="100%" height="100%" pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgPattern id="lattice" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
          <G stroke={colors.text} fill="none">
            <G opacity={0.08}>
              {CELLS.map(([column, row]) => (
                <Path
                  key={`${column}-${row}`}
                  d={STAR}
                  transform={`translate(${column * CELL} ${row * CELL})`}
                />
              ))}
            </G>
            <G opacity={0.05} strokeWidth={5}>
              {MASKS.map(([x, y]) => (
                <G key={x} transform={`translate(${x - 10} ${y - 10}) scale(${MASK_SCALE})`}>
                  <Path d={MASK_FACE} />
                  <Path d={MASK_EYES} />
                </G>
              ))}
            </G>
          </G>
        </SvgPattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#lattice)" />
    </Svg>
  );
}
