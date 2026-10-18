import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

// Placeholder Home screen; replaced by the real Home in later tasks (fonts T-011, i18n T-012).
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
    color: colors.text,
  },
});
