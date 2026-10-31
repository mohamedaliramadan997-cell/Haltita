import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/i18n';
import { colors, typography } from '@/theme';

// Placeholder Home screen; replaced by the real Home in later tasks.
export default function Home() {
  const { strings } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{strings.appName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  name: {
    ...typography.hero,
    color: colors.text,
  },
});
