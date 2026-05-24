import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using NavodayaSarthi, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.',
  },
  {
    heading: '2. Use of the App',
    body: 'NavodayaSarthi is intended solely for students preparing for the Jawahar Navodaya Vidyalaya Selection Test (JNVST). You agree to use the app only for lawful, personal, and non-commercial purposes.',
  },
  {
    heading: '3. Account Responsibility',
    body: 'You are responsible for maintaining the confidentiality of your account. Any activity that occurs under your account is your responsibility. Notify us immediately of any unauthorised use.',
  },
  {
    heading: '4. Content',
    body: 'All content on NavodayaSarthi — including videos, questions, and study material — is the intellectual property of NavodayaSarthi. You may not copy, distribute, or reproduce any content without prior written permission.',
  },
  {
    heading: '5. Termination',
    body: 'We reserve the right to suspend or terminate your access at any time if you violate these terms or engage in conduct that we determine to be harmful to other users or to the platform.',
  },
  {
    heading: '6. Disclaimer',
    body: 'NavodayaSarthi provides content on a best-effort basis. We do not guarantee specific results or selection in JNVST. The app is provided "as is" without warranties of any kind.',
  },
  {
    heading: '7. Changes to Terms',
    body: 'We may update these terms from time to time. Continued use of the app after changes constitutes your acceptance of the revised terms.',
  },
  {
    heading: '8. Contact',
    body: 'For any questions about these terms, contact us at support@navodayasarthi.com.',
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
