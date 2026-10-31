const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

// Room codes are strings rendered as they are, so they stay in Western digits (rules.md §8).
export function formatNumber(value: number, language: 'ar' | 'en'): string {
  const text = String(value);
  return language === 'ar' ? text.replace(/\d/g, (d) => ARABIC_INDIC_DIGITS[Number(d)]) : text;
}
