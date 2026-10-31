import raw from './content.json';

const CARD_FIELDS = ['textAr', 'textEn'];

const SECTIONS = [
  {
    name: 'questions',
    count: 100,
    prefix: 'q',
    digits: 3,
    fields: ['questionAr', 'questionEn', 'answerAr', 'answerEn'],
  },
  { name: 'challenges', count: 50, prefix: 'c', digits: 2, fields: CARD_FIELDS },
  { name: 'missions', count: 50, prefix: 'm', digits: 2, fields: CARD_FIELDS },
  { name: 'punishments', count: 15, prefix: 'p', digits: 2, fields: CARD_FIELDS },
];

type Fields = Record<string, unknown>;

const isText = (value: unknown) => typeof value === 'string' && value.trim() !== '';

// Returns one message per problem; an empty list means the content is valid.
export function validateContent(data: unknown): string[] {
  const root = (data ?? {}) as Fields;
  const problems: string[] = [];

  if (!isText(root.version)) problems.push('version: missing');

  for (const { name, count, prefix, digits, fields } of SECTIONS) {
    const items = root[name];
    if (!Array.isArray(items)) {
      problems.push(`${name}: not a list`);
      continue;
    }
    if (items.length !== count) problems.push(`${name}: ${items.length} items, expected ${count}`);

    items.forEach((value: unknown, index) => {
      const item = (value ?? {}) as Fields;
      // Sequential IDs also guarantee they're unique.
      const id = `${prefix}${String(index + 1).padStart(digits, '0')}`;
      if (item.id !== id) problems.push(`${name}[${index}]: id is not ${id}`);
      for (const field of fields) {
        if (!isText(item[field])) problems.push(`${id}: ${field} missing`);
      }
      if (name === 'questions') {
        if (item.number !== index + 1) problems.push(`${id}: number is not ${index + 1}`);
        if (typeof item.familySafe !== 'boolean') problems.push(`${id}: familySafe not boolean`);
      }
    });
  }

  return problems;
}

export const content = raw;

// Checked once at startup; app/_layout.tsx shows an error screen if this isn't empty.
export const contentProblems = validateContent(raw);
