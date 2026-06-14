import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/common/Footer';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { API_BASE_URL } from '../../config';

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6', '7'];

const phoneRegex = /^[6-9]\d{9}$/;

function FAQItem({ qKey, aKey }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{t(qKey)}</Text>
        <Text style={styles.faqIcon}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{t(aKey)}</Text>}
    </TouchableOpacity>
  );
}

export default function FAQScreen({ navigation }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/918175947318?text=Hi%2C%20I%20need%20help%20with%20NavodayaSarthi');
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = t('faq.errNameRequired');
    if (!phone.trim()) {
      e.phone = t('faq.errPhoneRequired');
    } else if (!phoneRegex.test(phone.trim())) {
      e.phone = t('faq.errPhoneInvalid');
    }
    if (!query.trim()) {
      e.query = t('faq.errMessageRequired');
    } else if (query.trim().length < 30) {
      e.query = t('faq.errMessageMin', { n: query.trim().length });
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: query.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || t('faq.errSendFailed'));
      setSubmitted(true);
      setName('');
      setPhone('');
      setQuery('');
    } catch (err) {
      setErrors({ submit: err.message || t('faq.errGeneric') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('faq.title')}</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('faq.faqTitle')}</Text>
          {FAQ_KEYS.map((k) => <FAQItem key={k} qKey={`faq.q${k}`} aKey={`faq.a${k}`} />)}
        </View>

        {/* Contact Form */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>{t('faq.contactTitle')}</Text>

          {submitted ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>{t('faq.successTitle')}</Text>
              <Text style={styles.successText}>{t('faq.successText')}</Text>
              <TouchableOpacity style={styles.sendAnotherBtn} onPress={() => setSubmitted(false)}>
                <Text style={styles.sendAnotherText}>{t('faq.sendAnother')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder={t('faq.namePlaceholder')}
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })); }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder={t('faq.phonePlaceholder')}
                placeholderTextColor={colors.textLight}
                value={phone}
                onChangeText={(v) => { setPhone(v); setErrors((p) => ({ ...p, phone: undefined })); }}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                style={[styles.input, styles.textarea, errors.query && styles.inputError]}
                placeholder={t('faq.messagePlaceholder')}
                placeholderTextColor={colors.textLight}
                value={query}
                onChangeText={(v) => { setQuery(v); setErrors((p) => ({ ...p, query: undefined })); }}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.charCount}>{t('faq.charCount', { n: query.trim().length })}</Text>
              {errors.query && <Text style={styles.errorText}>{errors.query}</Text>}

              {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

              <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>{t('faq.sendMessage')}</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <Text style={styles.whatsappIcon}>💬</Text>
          <View>
            <Text style={styles.whatsappTitle}>{t('faq.whatsappTitle')}</Text>
            <Text style={styles.whatsappSub}>{t('faq.whatsappSub')}</Text>
          </View>
        </TouchableOpacity>

        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  back: { color: colors.white, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  headerTitle: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  section: { padding: spacing.md },
  sectionTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  faqItem: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, flex: 1, marginRight: spacing.sm },
  faqIcon: { color: colors.primary, fontSize: typography.sizes.sm },
  faqA: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 22 },
  contactSection: { padding: spacing.md, paddingTop: 0 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text, marginBottom: spacing.sm,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: '#E53E3E' },
  errorText: { color: '#E53E3E', fontSize: typography.sizes.xs, marginBottom: spacing.xs, marginTop: -2 },
  charCount: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'right', marginBottom: spacing.xs, marginTop: -4 },
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  successBox: {
    backgroundColor: '#F0FFF4', borderRadius: radius.lg, padding: spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: '#9AE6B4',
  },
  successIcon: { fontSize: 40, marginBottom: spacing.sm },
  successTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: '#276749', marginBottom: spacing.xs },
  successText: { fontSize: typography.sizes.sm, color: '#2F855A', textAlign: 'center', lineHeight: 22 },
  sendAnotherBtn: { marginTop: spacing.md },
  sendAnotherText: { color: colors.primary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#25D366', margin: spacing.md, marginBottom: spacing.xl,
    borderRadius: radius.lg, padding: spacing.md,
  },
  whatsappIcon: { fontSize: 32, marginRight: spacing.md },
  whatsappTitle: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  whatsappSub: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.xs, marginTop: 2 },
});
