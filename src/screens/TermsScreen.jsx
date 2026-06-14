import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const SECTIONS = [
  {
    heading: '1. Agreement to Terms',
    body: 'These Terms and Conditions constitute a legally binding agreement between you and NavodayaSarthi governing your access to and use of the app and all associated content, features, and services. By downloading, installing, registering, or using the app in any manner, you agree to be bound by these Terms. If you do not agree, you must immediately discontinue use of the app.',
  },
  {
    heading: '2. Eligibility and Account Registration',
    body: 'The app is designed for students enrolled in Navodaya Vidyalaya schools, typically in Classes VI through XII (ages 11–18). If you are under 18, you confirm that a parent or legal guardian has consented to these Terms on your behalf.\n\nTo create an account you must provide your full name, a valid Indian mobile number, and your class level. You are responsible for keeping your account details accurate. Each OTP sent to your phone is valid for 5 minutes only — never share it with anyone.',
  },
  {
    heading: '3. Services Offered',
    body: 'NavodayaSarthi provides the following educational services:\n\n• Practice Hub — subject-wise MCQs by chapter with progress tracking and bookmarks\n• Mock Tests — timed tests with auto-scoring, analytics, and leaderboard rankings\n• Live Classes — real-time video lectures with interactive quiz popups\n• Recorded Classes — pre-recorded video lessons by subject and chapter\n• Daily Challenge — one question per day with a points system\n• Doubt Resolution — post academic questions for teacher or peer answers\n• Push Notifications — reminders for streaks, new content, and live classes',
  },
  {
    heading: '4. Premium Subscription',
    body: 'NavodayaSarthi offers a free tier and a one-time Premium subscription priced at ₹999 (lifetime access). Payments are processed through Razorpay and accepted via UPI, debit/credit cards, and net banking.\n\nAll Premium purchases are final and non-refundable, given the immediate digital access provided. We do not store your card or UPI credentials — these are handled solely by Razorpay. Your Premium status is linked to your mobile number and will be restored upon reinstallation.',
  },
  {
    heading: '5. User Conduct',
    body: 'You agree not to:\n\n• Share test answers or assist others in cheating\n• Attempt to access another user\'s account or circumvent authentication\n• Post abusive, defamatory, or harassing content in doubts or messages\n• Screen-record, copy, redistribute, or sell any platform content\n• Use the app for commercial tutoring, coaching, or competing products\n• Use automated bots or scripts to interact with the platform\n• Violate any applicable law or regulation of India\n\nViolations may result in immediate account suspension, forfeiture of Premium access without refund, and referral to law enforcement where warranted.',
  },
  {
    heading: '6. Intellectual Property',
    body: 'All content on NavodayaSarthi — including questions, explanations, video lectures, course material, graphics, and the NavodayaSarthi name — is the exclusive intellectual property of the Company or its licensed providers, protected under the Copyright Act, 1957 and the Trade Marks Act, 1999.\n\nYou are granted a limited, non-exclusive, non-transferable licence to access content for your personal educational use only. You may not reproduce, distribute, modify, or create derivative works from any platform content.',
  },
  {
    heading: '7. Disclaimers',
    body: 'NavodayaSarthi is a supplementary study aid only. We make no guarantee that use of the app will result in admission to Navodaya Vidyalayas or any specific academic outcome.\n\nThe app is provided on an "as-is" and "as-available" basis. We disclaim all warranties including merchantability, fitness for a particular purpose, and accuracy of content. We integrate with third-party services (Razorpay, Agora, Expo, Cloudinary, 2Factor.in) and are not responsible for their availability or conduct.',
  },
  {
    heading: '8. Limitation of Liability',
    body: 'To the fullest extent permitted by law, NavodayaSarthi shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app.\n\nOur total liability for any claim shall not exceed ₹999 (the Premium price) for paid users, or ₹100 for free users.',
  },
  {
    heading: '9. Termination',
    body: 'You may stop using the app at any time. To delete your account, email navodayasarthi.help@gmail.com — we will process the request within 30 days.\n\nWe reserve the right to suspend or terminate your account for violations of these Terms, fraudulent activity, or conduct harmful to other users, with or without prior notice.',
  },
  {
    heading: '10. Governing Law',
    body: 'These Terms are governed by the laws of India. Any dispute shall first be resolved through informal negotiation via navodayasarthi.help@gmail.com. If unresolved within 30 days, disputes may be referred to binding arbitration under the Arbitration and Conciliation Act, 1996. Nothing herein limits your rights under the Consumer Protection Act, 2019.',
  },
  {
    heading: '11. Changes to Terms',
    body: 'We may update these Terms at any time. For material changes, we will notify you via the app or push notification at least 14 days before the changes take effect. Continued use after the effective date constitutes acceptance of the revised Terms.',
  },
  {
    heading: '12. Contact Us',
    body: 'For any questions about these Terms:\n\nNavodayaSarthi\nEmail: navodayasarthi.help@gmail.com\nPhone: +91 8175947318\nResponse Time: Within 48 hours on business days',
  },
];

export default function TermsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: June 2026</Text>
        {SECTIONS.map((s) => (
          <View key={s.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{s.heading}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
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
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  lastUpdated: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.md },
  section: { marginBottom: spacing.lg },
  sectionHeading: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs },
  sectionBody: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 22 },
});
