import { cardColors, fonts, minCairoLineHeightRatio, palette, typography } from '@/theme';

// WCAG 2.x relative luminance and contrast ratio.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('colour contrast (design.md §2.3)', () => {
  const textPairs: [keyof typeof palette, keyof typeof palette][] = [
    ['cream', 'plum900'],
    ['mint', 'plum900'],
    ['gold', 'plum900'],
    ['pink', 'plum900'],
    ['white', 'teal'],
    ['pinkDeep', 'cream'],
    ['mutedOnDark', 'plum900'],
    ['mutedOnLight', 'cream'],
  ];

  it.each(textPairs)('%s on %s meets WCAG AA (4.5)', (fg, bg) => {
    expect(contrast(palette[fg], palette[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it('pink on cream stays below AA, so it is never used for text', () => {
    expect(contrast(palette.pink, palette.cream)).toBeLessThan(4.5);
  });

  it.each(Object.keys(cardColors) as (keyof typeof cardColors)[])(
    '%s card band text is readable',
    (type) => {
      const { band, bandText } = cardColors[type];
      expect(contrast(bandText, band)).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe('typography (design.md §3)', () => {
  it('every line height is at least the font size', () => {
    for (const token of Object.values(typography)) {
      expect(token.lineHeight).toBeGreaterThanOrEqual(token.fontSize);
    }
  });

  it('Cairo line height is at least 1.4× the size', () => {
    const display: string = fonts.display;
    for (const token of Object.values(typography)) {
      if (token.fontFamily === display) continue;
      expect(token.lineHeight / token.fontSize).toBeGreaterThanOrEqual(minCairoLineHeightRatio);
    }
  });
});
