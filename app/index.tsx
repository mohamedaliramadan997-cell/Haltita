import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/i18n';
import { colors, typography } from '@/theme';

// Placeholder Home screen; replaced by the real Home in later tasks.
export default function Home() {
  const { strings } = useI18n();

  return (
    <Screen style={styles.container}>
      <Text style={styles.name}>{strings.appName}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.hero,
    color: colors.text,
  },
});
