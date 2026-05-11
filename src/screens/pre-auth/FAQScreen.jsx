import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { API_BASE_URL } from '../../config';

const FAQS = [
  { q: 'When is the JNVST exam held?', a: 'JNVST for Class 6 is typically held in November every year. For Class 9, it is held in February. Admit cards are released 2-3 weeks before the exam.' },
  { q: 'Is this app free to use?', a: 'Yes! Navodaya Prime is completely free for all students. Every feature — practice questions, mock tests, video lessons, live classes, and more — is fully unlocked at no cost.' },
  { q: 'How to reset my password?', a: 'We use OTP-based login — no password needed! Just enter your registered mobile number and verify the OTP you receive via SMS.' },
  { q: 'Which classes is this app for?', a: 'This app is designed for Class 5 students appearing for JNVST (for Class 6 admission) and Class 8 students appearing for JNVST (for Class 9 admission).' },
  { q: 'Does the app work offline?', a: 'Practice questions and downloaded content are accessible offline. Video streaming requires an internet connection, though we optimize for low-bandwidth usage.' },
  { q: 'What subjects are covered?', a: 'All three JNVST subjects are covered: Mental Ability (40 questions), Arithmetic (20 questions), and Language — Hindi/English (20 questions).' },
  { q: 'How is the mock test structured?', a: 'Our mock tests mirror the actual JNVST format: 80 questions, 2 hours, with a digital OMR sheet interface to help you practice filling circles.' },
];

const phoneRegex = /^[6-9]\d{9}$/;

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{faq.q}</Text>
        <Text style={styles.faqIcon}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{faq.a}</Text>}
    </TouchableOpacity>
  );
}

export default function FAQScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/918175947318?text=Hi%2C%20I%20need%20help%20with%20Navodaya%20Prime');
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      e.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!query.trim()) {
      e.query = 'Message is required';
    } else if (query.trim().length < 30) {
      e.query = `Message must be at least 30 characters (${query.trim().length}/30)`;
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
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to send');
      setSubmitted(true);
      setName('');
      setPhone('');
      setQuery('');
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ & Contact</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
        </View>

        {/* Contact Form */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>

          {submitted ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>Message Sent!</Text>
              <Text style={styles.successText}>We have received your message and will get back to you shortly.</Text>
              <TouchableOpacity style={styles.sendAnotherBtn} onPress={() => setSubmitted(false)}>
                <Text style={styles.sendAnotherText}>Send Another Message</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Your Name *"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })); }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Mobile Number *"
                placeholderTextColor={colors.textLight}
                value={phone}
                onChangeText={(v) => { setPhone(v); setErrors((p) => ({ ...p, phone: undefined })); }}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                style={[styles.input, styles.textarea, errors.query && styles.inputError]}
                placeholder="Your Message * (min. 30 characters)"
                placeholderTextColor={colors.textLight}
                value={query}
                onChangeText={(v) => { setQuery(v); setErrors((p) => ({ ...p, query: undefined })); }}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.charCount}>{query.trim().length}/30 min</Text>
              {errors.query && <Text style={styles.errorText}>{errors.query}</Text>}

              {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

              <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Send Message</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <Text style={styles.whatsappIcon}>💬</Text>
          <View>
            <Text style={styles.whatsappTitle}>Chat on WhatsApp</Text>
            <Text style={styles.whatsappSub}>Get instant support from our team</Text>
          </View>
        </TouchableOpacity>
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
