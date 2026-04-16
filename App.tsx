import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SubmissionsProvider } from './src/context/SubmissionsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/tokens';

export default function App() {
  return (
    <SubmissionsProvider>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </SubmissionsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
