import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

export function AppButton({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
        : <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primary: { backgroundColor: colors.primary },
  accent: { backgroundColor: colors.accent },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary, elevation: 0 },
  ghost: { backgroundColor: 'transparent', elevation: 0 },
  disabled: { opacity: 0.5 },
  text: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, letterSpacing: 0.5 },
  primaryText: { color: colors.white },
  accentText: { color: colors.white },
  outlineText: { color: colors.primary },
  ghostText: { color: colors.primary },
});
