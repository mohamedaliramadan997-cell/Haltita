import { reloadAppAsync } from 'expo';
import { Component, type ReactNode } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { useI18n } from '@/i18n';
import { colors, spacing, typography } from '@/theme';

import { Button } from './Button';
import { Screen } from './Screen';

// A restart rather than router.replace: the navigator is unmounted here and would restore the
// crashed route. A restart opens on Home, and saved data such as lastRoom stays for rejoin.
function goHome() {
  if (Platform.OS === 'web') {
    // A web reload would stay on the crashed URL.
    window.location.assign('/');
    return;
  }
  // shortcut: a failed restart isn't reported yet, send it to log.error at T-016.
  reloadAppAsync('Back to home after a crash').catch(() => {});
}

function ErrorFallback() {
  const { strings } = useI18n();

  return (
    <Screen style={styles.fallback}>
      <Text style={styles.message}>{strings.crashMessage}</Text>
      <Button label={strings.backHome} onPress={goHome} />
    </Screen>
  );
}

type ErrorBoundaryProps = { children: ReactNode };

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // shortcut: the crash isn't reported yet, add componentDidCatch with log.error at T-016.

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    gap: spacing.xl,
  },
  message: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
});
