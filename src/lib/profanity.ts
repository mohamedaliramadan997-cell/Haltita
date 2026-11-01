// Local filter for names and custom punishments (rules.md §4). Basic by design: rooms are private,
// the host can kick, and a determined player can still get past it (for example "f*ck").

const WORDS = [
  // English
  'fuk',
  'fck',
  'shit',
  'shits',
  'shitty',
  'bullshit',
  'ass',
  'asses',
  'asshole',
  'assholes',
  'bitch',
  'bitches',
  'bastard',
  'bastards',
  'cunt',
  'cunts',
  'dick',
  'dicks',
  'cock',
  'cocks',
  'pussy',
  'pussies',
  'whore',
  'whores',
  'slut',
  'sluts',
  'wanker',
  'twat',
  'nigga',
  'faggot',
  'fag',
  'retard',
  'porn',
  'rape',
  'rapist',
  // Arabic
  'كس',
  'كسم',
  'كسمك',
  'كسك',
  'كسها',
  'كسختك',
  'زب',
  'زبي',
  'زبك',
  'زبر',
  'زبرك',
  'طيز',
  'طيزي',
  'طيزك',
  'نيك',
  'نيكه',
  'ينيك',
  'انيك',
  'عرص',
  'عرصه',
  'معرص',
  'خول',
  'خولات',
  'لبوه',
  'احا',
  'ديوث',
  'عاهر',
  'عاهره',
  'لوطي',
  // Arabic written in Latin letters and digits
  'sharmouta',
  'sharmota',
  'sharmoota',
  'sharmoot',
  'metnak',
  'mitnak',
  'manyak',
  'manyok',
  'khawal',
  '5awal',
  'kos',
  'kosom',
  'kosomak',
  'kosomk',
  'ksomk',
  'zobr',
  'zeby',
  'zebi',
  '3ars',
  'a7a',
  'a7ba',
  '2a7ba',
];

// Matched inside longer words, so these must never appear in an innocent one.
const STEMS = ['fuck', 'nigger', 'شرموط', 'شراميط', 'متناك', 'منيوك', 'قحب', 'قحاب'];

const LOOKALIKES: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i',
};

const normalize = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    // Arabic marks, the elongation stroke and invisible characters.
    .replace(/[ً-ْـ​-‏⁠﻿]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/ی/g, 'ي');

const BLOCKED_WORDS = new Set(WORDS.map(normalize));
const BLOCKED_STEMS = STEMS.map(normalize);

/** Splits into words and rejoins spaced-out letters, so "f u c k" reads as one word. */
function wordsIn(text: string): string[] {
  const words: string[] = [];
  let letters = '';
  for (const part of text.split(/[^a-z0-9ء-ي]+/).filter(Boolean)) {
    if (part.length === 1) {
      letters += part;
      continue;
    }
    if (letters) words.push(letters);
    letters = '';
    words.push(part);
  }
  if (letters) words.push(letters);
  return words;
}

const isBlocked = (word: string) =>
  // The bare word too, because Arabic glues on "ال" and "يا".
  [word, word.replace(/^(ال|يا)/, '')].some((form) => {
    // Compares with repeats removed too ("fuuuck"). Listed words keep their doubles, so "Niger" passes.
    const collapsed = form.replace(/(.)\1+/g, '$1');
    return (
      BLOCKED_WORDS.has(form) ||
      BLOCKED_WORDS.has(collapsed) ||
      BLOCKED_STEMS.some((stem) => form.includes(stem) || collapsed.includes(stem))
    );
  });

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  // Checked as written as well, because digits are letters in Arabic written with Latin letters ("a7a").
  const undisguised = normalized.replace(/[013457@$!]/g, (char) => LOOKALIKES[char]);
  return [normalized, undisguised].some((form) => wordsIn(form).some(isBlocked));
}
