import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export function AppLoader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return <ActivityIndicator size="large" color={colors.primary} style={styles.center} />;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignSelf: 'center', marginVertical: 32 },
});
