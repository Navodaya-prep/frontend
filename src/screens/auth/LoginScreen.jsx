import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendOtp, clearError } from '../../store/authSlice';
import { isValidPhone, formatPhone } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/common/AppButton';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { status, error } = useSelector((s) => s.auth);

  const handleSendOtp = async () => {
    const formatted = formatPhone(phone);
    if (!isValidPhone(formatted)) {
      Alert.alert(t('auth.invalidNumberTitle'), t('auth.invalidNumberMsg'));
      return;
    }
    dispatch(clearError());
    const result = await dispatch(sendOtp(formatted));
    if (sendOtp.fulfilled.match(result)) {
      navigation.navigate('OTPVerify', { phone: formatted });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
            <Text style={styles.logoTitle}>NavodayaSarthi</Text>
            <Text style={styles.logoSub}>{t('auth.welcomeBack')}</Text>
          </View>

          <Text style={styles.title}>{t('auth.loginOrSignup')}</Text>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>

          <Text style={styles.label}>{t('auth.mobileNumber')}</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder={t('auth.enterPhonePlaceholder')}
              placeholderTextColor={colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <AppButton
            title={t('common.continue')}
            onPress={handleSendOtp}
            loading={status === 'loading'}
            style={styles.btn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingTop: spacing.sm },
  backBtn: { marginBottom: spacing.lg },
  backText: { color: colors.primary, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  logoArea: { alignItems: 'center', marginBottom: spacing.xl },
  logoImage: { width: 80, height: 80, borderRadius: 40, resizeMode: 'cover', marginBottom: spacing.sm },
  logoTitle: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.primary },
  logoSub: { fontSize: typography.sizes.md, color: colors.textSecondary, marginTop: 4 },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.xs },
  phoneInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: colors.border, borderRadius: radius.md,
    backgroundColor: colors.white, marginBottom: spacing.md,
  },
  countryCode: {
    backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md,
    paddingVertical: 14, borderRightWidth: 1.5, borderRightColor: colors.border,
    borderTopLeftRadius: radius.md - 2, borderBottomLeftRadius: radius.md - 2,
  },
  countryCodeText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.primary },
  phoneInput: { flex: 1, padding: spacing.md, fontSize: typography.sizes.lg, color: colors.text },
  errorText: { color: colors.error, fontSize: typography.sizes.sm, marginBottom: spacing.md },
  btn: { marginBottom: spacing.lg },
});
