import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const SECTIONS = [
  {
    heading: '1. Introduction',
    body: 'NavodayaSarthi is committed to protecting the privacy of every student who uses our platform. This Privacy Policy explains what personal data we collect, why we collect it, how we use and store it, and what rights you have.\n\nThis Policy is prepared in compliance with the Information Technology Act, 2000, the SPDI Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act). By using the app, you consent to the practices described here.',
  },
  {
    heading: '2. Information We Collect',
    body: 'When you register, we collect your full name, mobile phone number (10 digits), and class level (VI–XII).\n\nAs you use the app, we automatically record: every practice question you attempt and your answer, your chapter and course progress, mock test attempt records (answers, scores, time taken), daily challenge attempts (including time taken in milliseconds), live class quiz responses, and the date of each day you use the app (for streak tracking).\n\nFor Premium purchases, we store your Razorpay Payment ID, Order ID, payment status, and amount. We do NOT store your card number, UPI ID, or bank credentials — those are handled by Razorpay.\n\nIf you post doubts, we collect the doubt text and any images you attach.',
  },
  {
    heading: '3. How We Use Your Information',
    body: 'We use your data solely to:\n\n• Authenticate your account via OTP\n• Track your study progress and personalise content\n• Display your performance analytics and leaderboard ranking\n• Maintain your daily study streak and send milestone notifications\n• Answer your academic doubts\n• Verify Premium subscription payments\n• Deliver push notifications (reminders, alerts, announcements)\n• Respond to your contact form queries\n\nWe do not use your data for advertising, profiling for marketing, or sale to data brokers.',
  },
  {
    heading: '4. Study Streak Tracking',
    body: 'Every time you use the app, we record today\'s date as your last active date. If you were active the previous day, your streak count increases by one. If you missed a day, the streak resets to one.\n\nWe do not track what time of day you use the app, how long you spend on individual screens, or any fine-grained time data. Streak data is used only for motivational purposes and to trigger notifications at 7, 30, and 100-day milestones.',
  },
  {
    heading: '5. Push Notifications',
    body: 'We send push notifications for:\n\n• Daily Challenge reminder (9:00 AM IST)\n• Streak-at-risk reminder (8:00 PM IST)\n• Streak milestones (7, 30, 100 days)\n• When your doubt is answered\n• New mock tests or lessons published\n• Live class started\n• Leaderboard rank improvement\n• Admin announcements\n\nYou can disable notifications anytime via your device settings (Settings → Notifications → NavodayaSarthi). This does not affect your account or access to content.',
  },
  {
    heading: '6. Data Sharing and Third Parties',
    body: 'We do not sell or rent your data. We share data only with the following service providers as strictly necessary:\n\n• 2Factor.in — delivers your OTP via SMS (receives your phone number only)\n• Razorpay — processes your payment (receives transaction metadata only, not card/UPI details)\n• Agora — powers live video classes (receives your user ID and a time-limited RTC token)\n• Cloudinary — stores images you upload such as doubt attachments\n• Expo — delivers push notifications to your device (receives your push token only)\n\nWe may disclose data to law enforcement if required by a court order or applicable law.',
  },
  {
    heading: '7. Data Security',
    body: 'We implement reasonable technical safeguards including:\n\n• OTP-only authentication — no passwords stored for students\n• bcrypt hashing for admin and teacher passwords\n• JWT session tokens signed with HMAC-SHA256, expiring in 30 days\n• Razorpay webhook verification via HMAC-SHA256 signatures\n• All data transmitted over TLS (HTTPS)\n• API credentials stored server-side in environment variables, never exposed to clients\n\nIn the event of a data breach likely to affect your rights, we will notify you as required under the DPDP Act, 2023.',
  },
  {
    heading: '8. Data Retention',
    body: 'OTP records are deleted within 5 minutes of use or expiry. Account and activity data is retained for the duration of your account plus 3 years after deletion. Payment records are kept for 7 years as required by Indian accounting law. Push notification logs are retained for 1 year.\n\nWhen you request account deletion, we will delete or anonymise your personal data within 30 days, except where legally required to retain it.',
  },
  {
    heading: '9. Children\'s Privacy',
    body: 'NavodayaSarthi serves students in Classes VI–XII, many of whom are under 18. By using the app, a user under 18 confirms their parent or guardian has reviewed and consented to this Policy.\n\nIf you are a parent and believe your child registered without your consent, contact navodayasarthi.help@gmail.com — we will investigate and delete the account upon verification.\n\nWe collect only the minimum data necessary. We do not use minors\' data for profiling or advertising. The app does not enable direct messaging between students.',
  },
  {
    heading: '10. Your Rights',
    body: 'Under the DPDP Act, 2023, you have the right to:\n\n• Access — request a summary of the data we hold about you\n• Correction — update your name and class level in the app; other corrections via email\n• Erasure — request deletion of your account and data\n• Withdraw Consent — disable push notifications via device settings at any time\n• Grievance Redressal — raise a complaint with our Grievance Officer\n\nTo exercise any right, email navodayasarthi.help@gmail.com with your registered phone number and request description. We respond within 30 days.',
  },
  {
    heading: '11. Cookies and Local Storage',
    body: 'The NavodayaSarthi app does not use cookies. We use Expo SecureStore (device-level encrypted storage) to keep your login token so you stay signed in between sessions. This token expires in 30 days. No third-party analytics, advertising, or tracking SDKs are embedded in the app.',
  },
  {
    heading: '12. Leaderboard',
    body: 'The weekly mock test leaderboard displays your name alongside your score among the top 50 users. Your phone number is never shown. The leaderboard refreshes weekly and covers only the last 7 days of scores. To opt out of the leaderboard, contact navodayasarthi.help@gmail.com.',
  },
  {
    heading: '13. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. For material changes, we will notify you via push notification or in-app banner at least 14 days before the changes take effect. Continued use after the effective date constitutes acceptance.',
  },
  {
    heading: '14. Contact and Grievance Officer',
    body: 'NavodayaSarthi\nEmail: navodayasarthi.help@gmail.com\nPhone: +91 8175947318\n\nGrievances are acknowledged within 48 hours and resolved within 30 days, as required under the Information Technology Act, 2000.',
  },
];

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
