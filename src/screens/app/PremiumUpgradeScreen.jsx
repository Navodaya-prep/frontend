import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import { paymentApi } from '../../api/paymentApi';
import { fetchProfile } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const BENEFIT_KEYS = ['benefit1', 'benefit2', 'benefit3', 'benefit4'];

export default function PremiumUpgradeScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await paymentApi.createOrder();

      // Already premium (e.g. paid on another device) — just refresh and exit.
      if (data?.alreadyPremium) {
        await dispatch(fetchProfile());
        navigation.goBack();
        return;
      }
      if (!data?.orderId || !data?.keyId) throw new Error('no-order');

      const options = {
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'NavodayaSarthi',
        description: data.description || t('premium.title'),
        prefill: { name: user?.name || data.name || '', contact: user?.phone || data.contact || '' },
        theme: { color: colors.primary },
      };

      // In LIVE mode, lock checkout to UPI only — shows the installed UPI apps
      // (GPay / PhonePe / Paytm) for the intent flow. In TEST mode (or before
      // the Razorpay account is activated, where UPI isn't provisioned), show
      // all available methods so the full pay → verify → unlock flow is testable.
      const isLive = typeof data.keyId === 'string' && data.keyId.startsWith('rzp_live');
      if (isLive) {
        options.config = {
          display: {
            blocks: { upi: { name: t('premium.payUpi'), instruments: [{ method: 'upi' }] } },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: false },
          },
        };
      }

      let checkout;
      try {
        checkout = await RazorpayCheckout.open(options);
      } catch (err) {
        // User dismissed the sheet or payment failed — not an app error.
        Alert.alert(t('premium.pendingTitle'), t('premium.pendingMessage'));
        return;
      }

      // Verify the signature server-side before unlocking.
      const res = await paymentApi.verify({
        razorpay_order_id: checkout.razorpay_order_id,
        razorpay_payment_id: checkout.razorpay_payment_id,
        razorpay_signature: checkout.razorpay_signature,
      });

      if (res.data?.isPremium) {
        await dispatch(fetchProfile()); // refresh isPremium in the store
        Alert.alert(t('premium.successTitle'), t('premium.successMessage'), [
          { text: t('premium.successCta'), onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(t('premium.pendingTitle'), t('premium.pendingMessage'));
      }
    } catch (e) {
      Alert.alert(t('premium.errorTitle'), t('premium.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('premium.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.heroTitle}>{t('premium.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('premium.heroSubtitle')}</Text>
        </View>

        <View style={styles.benefits}>
          {BENEFIT_KEYS.map((key) => (
            <View key={key} style={styles.benefitRow}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.benefitText}>{t(`premium.${key}`)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.buyBtn, loading && styles.buyBtnDisabled]}
          onPress={handleBuy}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.buyBtnText}>{t('premium.buyButton')}</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.primary },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  content: { padding: spacing.lg },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  crown: { fontSize: 64, marginBottom: spacing.md },
  heroTitle: {
    fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold,
    color: colors.text, textAlign: 'center', marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: typography.sizes.md, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 24,
  },
  benefits: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  check: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primaryLight,
    color: colors.primary, textAlign: 'center', lineHeight: 26,
    fontSize: typography.sizes.md, fontWeight: typography.weights.bold, overflow: 'hidden',
  },
  benefitText: { flex: 1, fontSize: typography.sizes.md, color: colors.text },
  footer: {
    padding: spacing.md, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  buyBtn: {
    backgroundColor: colors.accent, borderRadius: radius.lg,
    paddingVertical: 16, alignItems: 'center',
  },
  buyBtnDisabled: { opacity: 0.7 },
  buyBtnText: {
    color: colors.white, fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold, letterSpacing: 0.5,
  },
});
