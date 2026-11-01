import content from '@/content/content.json';

import { containsProfanity } from './profanity';

describe('containsProfanity', () => {
  it.each([
    // Plain words, any case
    'shit',
    'SHIT',
    'you are an asshole',
    'شرموطة',
    'كس',
    // Longer forms of a stem
    'motherfucker',
    'fuckyou',
    'الشرموطة',
    // Disguises
    'sh1t',
    '$hit',
    '@ss',
    'sh!t',
    'fuuuuck',
    'f u c k',
    'f.u.c.k',
    'fu​ck',
    // Arabic spelling variations
    'شَرْمُوطَة',
    'شرمـــوطة',
    'شرموطه',
    'أحا',
    'ك س',
    'الخول',
    'ياخول',
    'خوووول',
    // Arabic in Latin letters and digits
    'a7a',
    'sharmouta',
    '5awal',
  ])('blocks %s', (text) => {
    expect(containsProfanity(text)).toBe(true);
  });

  it.each([
    '',
    '   ',
    '🎭',
    '12345',
    // Innocent words containing a blocked one
    'Hassan',
    'Assad',
    'class',
    'Cassandra',
    'Scunthorpe',
    'Dickson',
    'Niger',
    'grape',
    'Nikos',
    'Yasmin',
    // Arabic names and words containing a blocked one
    'محمد',
    'سارة',
    'ناصر',
    'خولة',
    'يارا',
    'ياسين',
    'مكسب',
    'كسلان',
    'كسر',
    'زبدة',
    'زبون',
    'Ali',
    'Layla',
  ])('allows %j', (text) => {
    expect(containsProfanity(text)).toBe(false);
  });

  it('allows every built-in punishment, which custom ones are modelled on', () => {
    const blocked = content.punishments.filter(
      ({ textAr, textEn }) => containsProfanity(textAr) || containsProfanity(textEn),
    );
    expect(blocked).toEqual([]);
  });
});
