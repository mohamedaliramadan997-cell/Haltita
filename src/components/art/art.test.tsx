import { render } from '@testing-library/react-native';
import { Fragment } from 'react';

import { seatTints } from '@/theme';

import { Emblem } from './Emblem';
import { Masky, type MaskyPose } from './Masky';
import { MaskShape, MaskToken } from './MaskToken';
import { Pattern } from './Pattern';

jest.mock('./MaskToken', () => {
  const actual = jest.requireActual('./MaskToken');
  return { ...actual, MaskShape: jest.fn(actual.MaskShape) };
});

const POSES: MaskyPose[] = ['honest', 'sly', 'detective', 'shock', 'exposed', 'wait'];
// Sly's eye-mask is black, so its tint is on the outline rather than on MaskShape.
const MASKED_POSES = POSES.filter((pose) => pose !== 'sly');

describe('Masky', () => {
  it.each(MASKED_POSES)('%s wears the mask in its seat tint', async (pose) => {
    jest.mocked(MaskShape).mockClear();
    await render(<Masky pose={pose} seat={3} />);
    expect(jest.mocked(MaskShape).mock.lastCall![0].fill).toBe(seatTints[3]);
  });

  it('wraps seats past the last tint', async () => {
    jest.mocked(MaskShape).mockClear();
    await render(<Masky pose="honest" seat={seatTints.length + 1} />);
    expect(jest.mocked(MaskShape).mock.lastCall![0].fill).toBe(seatTints[1]);
  });
});

describe('seatTints', () => {
  it('has 8 different colours', () => {
    expect(new Set(seatTints).size).toBe(8);
  });
});

describe('other art', () => {
  it('renders the token, pattern and every emblem', async () => {
    await render(
      <Fragment>
        <MaskToken />
        <Pattern />
        <Emblem type="question" />
        <Emblem type="truth" />
        <Emblem type="liar" />
        <Emblem type="challenge" />
        <Emblem type="mission" />
      </Fragment>,
    );
  });
});
