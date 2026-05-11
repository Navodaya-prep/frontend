import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../store/authSlice';
import { isValidName } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/common/AppButton';

export default function SignupScreen({ navigation, route }) {
  const { phone } = route.params || {};
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { status, error, tempToken } = useSelector((s) => s.auth);

  const handleSignup = () => {
    if (!isValidName(name)) return;
    dispatch(clearError());
    dispatch(signup({ name: name.trim(), phone, tempToken }));
  };

  const isValid = isValidName(name);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.emoji}>🎓</Text>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Almost there! Enter your name to get started.</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <View style={[styles.input, styles.readOnly]}>
            <Text style={styles.readOnlyText}>+91 {phone}</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <AppButton
            title="Create Account →"
            onPress={handleSignup}
            loading={status === 'loading'}
            disabled={!isValid}
            style={styles.btn}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingTop: spacing.lg },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text, marginBottom: spacing.md,
    justifyContent: 'center',
  },
  readOnly: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  readOnlyText: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: typography.weights.semibold },
  errorText: { color: colors.error, fontSize: typography.sizes.sm, marginBottom: spacing.md },
  btn: { marginTop: spacing.sm, marginBottom: spacing.md },
  terms: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: typography.weights.semibold, textDecorationLine: 'underline' },
});
