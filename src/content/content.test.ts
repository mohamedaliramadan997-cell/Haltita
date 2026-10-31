import { content, contentProblems, validateContent } from './index';

const copy = () => JSON.parse(JSON.stringify(content));

describe('bundled content.json', () => {
  it('is valid', () => {
    expect(contentProblems).toEqual([]);
  });

  it('has the expected counts', () => {
    expect(content.questions).toHaveLength(100);
    expect(content.challenges).toHaveLength(50);
    expect(content.missions).toHaveLength(50);
    expect(content.punishments).toHaveLength(15);
  });

  it('tags only questions 35 and 36 as not family safe', () => {
    const tagged = content.questions.filter((q) => !q.familySafe).map((q) => q.id);
    expect(tagged).toEqual(['q035', 'q036']);
  });
});

describe('validateContent', () => {
  it.each([[null], [undefined], ['text'], [{}]])('reports every section for %p', (data) => {
    expect(validateContent(data)).toEqual([
      'version: missing',
      'questions: not a list',
      'challenges: not a list',
      'missions: not a list',
      'punishments: not a list',
    ]);
  });

  it('reports a wrong count', () => {
    const data = copy();
    data.punishments.pop();
    expect(validateContent(data)).toEqual(['punishments: 14 items, expected 15']);
  });

  it('reports a duplicate or out-of-order ID', () => {
    const data = copy();
    data.missions[1].id = 'm01';
    expect(validateContent(data)).toEqual(['missions[1]: id is not m02']);
  });

  it.each([
    ['questions', 0, 'questionAr', 'q001'],
    ['questions', 99, 'answerEn', 'q100'],
    ['challenges', 12, 'textAr', 'c13'],
    ['missions', 6, 'textEn', 'm07'],
    ['punishments', 4, 'textAr', 'p05'],
  ])('reports empty text in %s[%i].%s', (section, index, field, id) => {
    const data = copy();
    data[section][index][field] = '   ';
    expect(validateContent(data)).toEqual([`${id}: ${field} missing`]);
  });

  it('reports a wrong question number and familySafe', () => {
    const data = copy();
    data.questions[2].number = 9;
    data.questions[2].familySafe = 'yes';
    expect(validateContent(data)).toEqual([
      'q003: number is not 3',
      'q003: familySafe not boolean',
    ]);
  });

  it('reports a null item without crashing', () => {
    const data = copy();
    data.punishments[0] = null;
    expect(validateContent(data)).toEqual([
      'punishments[0]: id is not p01',
      'p01: textAr missing',
      'p01: textEn missing',
    ]);
  });
});
