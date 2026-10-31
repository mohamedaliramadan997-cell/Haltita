import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

// Placeholder Home screen; replaced by the real Home in later tasks.
export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{Constants.expoConfig?.name}</Text>
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
