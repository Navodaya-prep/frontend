import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const FAQS = [
  { q: 'When is the JNVST exam held?', a: 'JNVST for Class 6 is typically held in November every year. For Class 9, it is held in February. Admit cards are released 2-3 weeks before the exam.' },
  { q: 'Is this app free to use?', a: 'Yes! Navodaya Prime has a generous free plan that includes 10 practice questions per chapter, 1 full mock test, and intro videos. Premium plans unlock the full syllabus, live sessions, and 10 years of solved papers.' },
  { q: 'How to reset my password?', a: 'We use OTP-based login — no password needed! Just enter your registered mobile number and verify the OTP you receive via SMS.' },
  { q: 'Which classes is this app for?', a: 'This app is designed for Class 5 students appearing for JNVST (for Class 6 admission) and Class 8 students appearing for JNVST (for Class 9 admission).' },
  { q: 'Does the app work offline?', a: 'Practice questions and downloaded content are accessible offline. Video streaming requires an internet connection, though we optimize for low-bandwidth usage.' },
  { q: 'What subjects are covered?', a: 'All three JNVST subjects are covered: Mental Ability (40 questions), Arithmetic (20 questions), and Language — Hindi/English (20 questions).' },
  { q: 'How is the mock test structured?', a: 'Our mock tests mirror the actual JNVST format: 80 questions, 2 hours, with a digital OMR sheet interface to help you practice filling circles.' },
];

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

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20Navodaya%20Prime');
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
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor={colors.textLight}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Your Query"
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Send Message</Text>
          </TouchableOpacity>
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
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm,
  },
  submitBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#25D366', margin: spacing.md, marginBottom: spacing.xl,
    borderRadius: radius.lg, padding: spacing.md,
  },
  whatsappIcon: { fontSize: 32, marginRight: spacing.md },
  whatsappTitle: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  whatsappSub: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.xs, marginTop: 2 },
});
