import { StyleSheet, Text } from 'react-native';

import { useI18n } from '@/i18n';
import { colors, typography } from '@/theme';

import { Screen } from './Screen';

export function ContentErrorScreen() {
  const { strings } = useI18n();

  return (
    <Screen style={styles.container}>
      <Text style={styles.message}>{strings.contentError}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
});
