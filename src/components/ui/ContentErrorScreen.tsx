import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/i18n';
import { colors, screenPadding, typography } from '@/theme';

export function ContentErrorScreen() {
  const { strings } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{strings.contentError}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: colors.background,
  },
  message: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
});
