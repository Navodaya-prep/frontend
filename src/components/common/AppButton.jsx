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
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: { backgroundColor: colors.primary },
  accent: { backgroundColor: colors.accent },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  primaryText: { color: colors.white },
  accentText: { color: colors.white },
  outlineText: { color: colors.primary },
  ghostText: { color: colors.primary },
});
