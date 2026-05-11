import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: 'We collect your name and mobile number when you sign up. We also collect usage data such as test scores, practice progress, and activity streaks to personalise your learning experience.',
  },
  {
    heading: '2. How We Use Your Information',
    body: 'Your information is used to provide and improve the app, track your progress, send important notifications (such as live class reminders), and offer personalised study recommendations.',
  },
  {
    heading: '3. Data Sharing',
    body: 'We do not sell or share your personal information with third parties. Data may be shared with trusted service providers (such as cloud hosting) solely to operate the platform.',
  },
  {
    heading: '4. Data Security',
    body: 'We take reasonable technical measures to protect your data. Your OTP-based login ensures that no passwords are stored. However, no method of transmission over the internet is 100% secure.',
  },
  {
    heading: '5. Children\'s Privacy',
    body: 'Navodaya Prime is designed for students under parental or school guidance. We do not knowingly collect data from children without appropriate consent.',
  },
  {
    heading: '6. Retention',
    body: 'We retain your data for as long as your account is active. You may request deletion of your account and associated data by contacting us.',
  },
  {
    heading: '7. Changes to This Policy',
    body: 'We may update this Privacy Policy periodically. We will notify you of significant changes through the app.',
  },
  {
    heading: '8. Contact',
    body: 'For privacy-related concerns, reach us at support@navodayaprime.com.',
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
        <Text style={styles.lastUpdated}>Last updated: May 2026</Text>
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
