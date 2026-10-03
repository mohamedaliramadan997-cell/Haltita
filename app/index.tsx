import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

// Placeholder Home screen; replaced by the real Home in later tasks (theme T-010, i18n T-012).
export default function Home() {
  return (
    <View style={styles.container}>
      <Text>{Constants.expoConfig?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
