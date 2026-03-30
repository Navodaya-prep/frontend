import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, sendOtp, clearError } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/common/AppButton';
import { OTP_LENGTH, OTP_TIMER_SECONDS } from '../../utils/constants';

export default function OTPVerifyScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const inputs = useRef([]);
  const dispatch = useDispatch();
  const { status, error, isNewUser } = useSelector((s) => s.auth);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (isNewUser) {
      navigation.replace('Signup', { phone });
    }
  }, [isNewUser]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const otpStr = otp.join('');
    if (otpStr.length < OTP_LENGTH) return;
    dispatch(clearError());
    dispatch(verifyOtp({ phone, otp: otpStr }));
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(OTP_TIMER_SECONDS);
    dispatch(sendOtp(phone));
  };

  const otpComplete = otp.join('').length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phone}>+91 {phone}</Text>
          </Text>

          {/* OTP Input Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(r) => (inputs.current[index] = r)}
                style={[styles.otpBox, digit && styles.otpBoxFilled]}
                value={digit}
                onChangeText={(v) => handleChange(v, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <AppButton
            title="Verify OTP →"
            onPress={handleVerify}
            loading={status === 'loading'}
            disabled={!otpComplete}
            style={styles.btn}
          />

          <View style={styles.resendRow}>
            {timer > 0
              ? <Text style={styles.timerText}>Resend OTP in <Text style={styles.timerNum}>{timer}s</Text></Text>
              : <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.md, paddingTop: spacing.sm },
  backBtn: { marginBottom: spacing.xl },
  backText: { color: colors.primary, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: spacing.md },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
  phone: { color: colors.primary, fontWeight: typography.weights.bold },
  otpRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  otpBox: {
    width: 48, height: 56, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold,
    color: colors.text, backgroundColor: colors.white, marginHorizontal: 4,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  errorText: { color: colors.error, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.md },
  btn: { marginBottom: spacing.md },
  resendRow: { alignItems: 'center' },
  timerText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  timerNum: { fontWeight: typography.weights.bold, color: colors.primary },
  resendText: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: typography.weights.bold },
});
