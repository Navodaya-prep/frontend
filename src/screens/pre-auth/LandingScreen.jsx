import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🎥', title: 'Video Lessons', desc: 'Expert-taught concept videos' },
  { icon: '📋', title: 'Mock Tests', desc: 'Full-length timed exams' },
  { icon: '🧠', title: 'Practice MCQs', desc: '1200+ chapter-wise questions' },
  { icon: '👨‍🏫', title: 'Expert Mentors', desc: 'Doubt support anytime' },
];

const SUCCESS_STORIES = [
  { name: 'Priya Sharma', state: 'UP', score: '94%', year: '2024' },
  { name: 'Arjun Patel', state: 'MP', score: '91%', year: '2024' },
  { name: 'Sunita Devi', state: 'Bihar', score: '89%', year: '2023' },
];

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.logo}>🏫 Navodaya</Text>
              <Text style={styles.logoSub}>Prime</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🎯 JNVST Preparation</Text>
          </View>
          <Text style={styles.heroTitle}>Your Journey to{'\n'}Navodaya Excellence{'\n'}Starts Here</Text>
          <Text style={styles.heroSubtitle}>
            Join 50,000+ students preparing for Jawahar Navodaya Vidyalaya Selection Test with India's best JNVST app.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.ctaBtnText}>Start Free Trial →</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>No credit card required · Free forever plan available</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[['50K+', 'Students'], ['1200+', 'Questions'], ['95%', 'Success Rate']].map(([num, label]) => (
              <View key={label} style={styles.statItem}>
                <Text style={styles.statNum}>{num}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Everything You Need to Crack JNVST</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Success Stories */}
        <View style={[styles.section, styles.successSection]}>
          <Text style={[styles.sectionTitle, { color: colors.white }]}>Success Stories</Text>
          <Text style={styles.successSubtitle}>Real students, real results</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SUCCESS_STORIES.map((s) => (
              <View key={s.name} style={styles.storyCard}>
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyAvatarText}>{s.name[0]}</Text>
                </View>
                <Text style={styles.storyName}>{s.name}</Text>
                <Text style={styles.storyState}>{s.state} · {s.year}</Text>
                <Text style={styles.storyScore}>{s.score}</Text>
                <Text style={styles.storyScoreLabel}>Score</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Nav Links */}
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <Text style={styles.navLink}>Why Navodaya? →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
            <Text style={styles.navLink}>FAQ & Contact →</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Bottom */}
        <View style={styles.bottomCta}>
          <Text style={styles.bottomCtaTitle}>Ready to Begin?</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.ctaBtnText}>Create Free Account →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  logo: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  logoSub: { fontSize: typography.sizes.sm, color: colors.accent, fontWeight: typography.weights.bold, marginTop: -4 },
  loginBtn: {
    borderWidth: 2, borderColor: colors.white, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  loginBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroBadge: {
    backgroundColor: colors.accent + '30',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  heroBadgeText: { color: colors.accent, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  heroTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  heroSubtitle: { fontSize: typography.sizes.md, color: '#B8D4FF', lineHeight: 24, marginBottom: spacing.lg },
  ctaBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ctaBtnText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold },
  ctaNote: { textAlign: 'center', color: '#B8D4FF', fontSize: typography.sizes.xs, marginBottom: spacing.lg },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
  statLabel: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },
  section: { padding: spacing.md, paddingTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  featureIcon: { fontSize: 28, marginBottom: spacing.sm },
  featureTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  featureDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  successSection: { backgroundColor: colors.primary, paddingBottom: spacing.lg },
  successSubtitle: { color: '#B8D4FF', fontSize: typography.sizes.sm, marginBottom: spacing.md },
  storyCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
    width: 140,
  },
  storyAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  storyAvatarText: { color: colors.white, fontWeight: typography.weights.extrabold, fontSize: typography.sizes.xl },
  storyName: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm, textAlign: 'center' },
  storyState: { color: '#B8D4FF', fontSize: typography.sizes.xs, marginTop: 2 },
  storyScore: { color: colors.accent, fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, marginTop: spacing.sm },
  storyScoreLabel: { color: '#B8D4FF', fontSize: typography.sizes.xs },
  navLinks: { flexDirection: 'row', justifyContent: 'space-around', padding: spacing.md },
  navLink: { color: colors.primary, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  bottomCta: {
    backgroundColor: colors.primaryLight,
    margin: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  bottomCtaTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
});
