import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { reloadAppAsync } from 'expo';
import { Platform, Text } from 'react-native';

import { ar } from '@/i18n/ar';

import { Banner } from './Banner';
import { Button } from './Button';
import { ErrorBoundary } from './ErrorBoundary';
import { Screen } from './Screen';
import { showToast, Toast } from './Toast';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo', () => ({ reloadAppAsync: jest.fn(() => Promise.resolve()) }));
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'ar' }] }));

describe('Screen', () => {
  it('renders its children', async () => {
    await render(
      <Screen>
        <Text>inside</Text>
      </Screen>,
    );
    expect(screen.getByText('inside')).toBeTruthy();
  });
});

describe('Button', () => {
  it('fires onPress and exposes its label to screen readers', async () => {
    const onPress = jest.fn();
    await render(<Button label="جاهز" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'جاهز' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the crown only on the host variant', async () => {
    await render(<Button label="ابدأ" onPress={jest.fn()} variant="host" />);
    expect(screen.getByText('👑 ابدأ')).toBeTruthy();
    await render(<Button label="ابدأ" onPress={jest.fn()} variant="secondary" />);
    expect(screen.getByText('ابدأ')).toBeTruthy();
  });

  it('ignores presses and shows the reason while disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="ابدأ" onPress={onPress} disabled disabledReason="مستني لاعبين" />);
    await fireEvent.press(screen.getByRole('button', { name: 'ابدأ' }));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByText('مستني لاعبين')).toBeTruthy();
  });

  it('hides the reason while enabled', async () => {
    await render(<Button label="ابدأ" onPress={jest.fn()} disabledReason="مستني لاعبين" />);
    expect(screen.queryByText('مستني لاعبين')).toBeNull();
  });
});

describe('Toast', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const advance = (ms: number) => act(async () => void jest.advanceTimersByTime(ms));
  const show = (message: string) => act(async () => showToast(message));

  it('shows a message and hides it after 2.5 s', async () => {
    await render(<Toast />);
    await show('بالراحة شوية');
    await advance(2499);
    expect(screen.getByText('بالراحة شوية')).toBeTruthy();
    await advance(1);
    expect(screen.queryByText('بالراحة شوية')).toBeNull();
  });

  it('restarts the timer when the same message shows again', async () => {
    await render(<Toast />);
    await show('تاني');
    await advance(2000);
    await show('تاني');
    await advance(2000);
    expect(screen.getByText('تاني')).toBeTruthy();
    await advance(500);
    expect(screen.queryByText('تاني')).toBeNull();
  });
});

describe('Banner', () => {
  it.each([
    ['offline', ar.offline],
    ['hostAway', ar.hostAway],
  ] as const)('shows the %s message', async (variant, message) => {
    await render(<Banner variant={variant} />);
    expect(screen.getByText(message)).toBeTruthy();
  });
});

describe('ErrorBoundary', () => {
  const Crash = (): never => {
    throw new Error('boom');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // React logs every caught error; keep the test output readable.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('renders its children when nothing crashes', async () => {
    await render(
      <ErrorBoundary>
        <Text>fine</Text>
      </ErrorBoundary>,
    );
    expect(screen.getByText('fine')).toBeTruthy();
  });

  it('restarts the app from the fallback and keeps saved data', async () => {
    await AsyncStorage.setItem('ht.lastRoom.v1', '12345');
    await render(
      <ErrorBoundary>
        <Crash />
      </ErrorBoundary>,
    );
    expect(screen.getByText(ar.crashMessage)).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: ar.backHome }));
    expect(reloadAppAsync).toHaveBeenCalledTimes(1);
    expect(await AsyncStorage.getItem('ht.lastRoom.v1')).toBe('12345');
  });

  it('goes to the root URL on web, because a reload would stay on the crashed route', async () => {
    const assign = jest.fn();
    jest.replaceProperty(Platform, 'OS', 'web');
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { location: { assign } },
    });
    await render(
      <ErrorBoundary>
        <Crash />
      </ErrorBoundary>,
    );
    await fireEvent.press(screen.getByRole('button', { name: ar.backHome }));
    expect(assign).toHaveBeenCalledWith('/');
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });
});
