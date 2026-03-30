import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const TEAM = [
  { name: 'Rajesh Kumar', role: 'Founder & Math Expert', exp: '15 years experience', icon: '👨‍🏫' },
  { name: 'Anita Singh', role: 'Language & Hindi Expert', exp: '12 years experience', icon: '👩‍🏫' },
  { name: 'Dr. Mohan Lal', role: 'Mental Ability Specialist', exp: '10 years experience', icon: '🧑‍🔬' },
];

const MILESTONES = [
  { year: '2020', event: 'Navodaya Prime Founded' },
  { year: '2021', event: '10,000 students joined' },
  { year: '2022', event: 'Launched in 15 states' },
  { year: '2023', event: '50,000 students, 95% success rate' },
  { year: '2024', event: 'Mobile app launched' },
];

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Story */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🏫</Text>
          <Text style={styles.heroTitle}>Our Story</Text>
          <Text style={styles.heroText}>
            Navodaya Prime was born from a simple belief — every child in rural India deserves a chance at world-class education.
            The Jawahar Navodaya Vidyalaya system provides exactly that, but the path to getting in has always been tough for students without access to quality coaching.
          </Text>
          <Text style={styles.heroText}>
            We built this app to bridge that gap. Our team of expert educators from IIT, IIM, and top universities work tirelessly to create content that is simple, effective, and accessible — even on slow 2G connections.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <Text style={styles.missionIcon}>🎯</Text>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            To make high-quality JNVST preparation available to every student in India, regardless of their economic background or geographic location.
          </Text>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Our Experts</Text>
          {TEAM.map((member) => (
            <View key={member.name} style={styles.teamCard}>
              <View style={styles.teamAvatar}>
                <Text style={styles.teamAvatarText}>{member.icon}</Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamExp}>{member.exp}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Journey</Text>
          {MILESTONES.map((m, i) => (
            <View key={m.year} style={styles.milestone}>
              <View style={styles.milestoneLeft}>
                <View style={styles.milestoneDot} />
                {i < MILESTONES.length - 1 && <View style={styles.milestoneLine} />}
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneYear}>{m.year}</Text>
                <Text style={styles.milestoneEvent}>{m.event}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.ctaBtnText}>Join 50,000+ Students →</Text>
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
  heroSection: { backgroundColor: colors.primary, padding: spacing.lg, alignItems: 'center' },
  heroEmoji: { fontSize: 48, marginBottom: spacing.sm },
  heroTitle: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white, marginBottom: spacing.md },
  heroText: { color: '#B8D4FF', fontSize: typography.sizes.md, lineHeight: 24, marginBottom: spacing.md, textAlign: 'center' },
  missionCard: {
    backgroundColor: colors.accent,
    margin: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  missionIcon: { fontSize: 32, marginBottom: spacing.sm },
  missionTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white, marginBottom: spacing.sm },
  missionText: { color: colors.white, fontSize: typography.sizes.md, lineHeight: 24, textAlign: 'center' },
  section: { padding: spacing.md },
  sectionTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  teamCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  teamAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  teamAvatarText: { fontSize: 28 },
  teamInfo: { flex: 1 },
  teamName: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  teamRole: { fontSize: typography.sizes.sm, color: colors.primary, marginTop: 2 },
  teamExp: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  milestone: { flexDirection: 'row', marginBottom: 0 },
  milestoneLeft: { width: 24, alignItems: 'center' },
  milestoneDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.primary, marginTop: 4,
  },
  milestoneLine: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  milestoneContent: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.md },
  milestoneYear: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.accent },
  milestoneEvent: { fontSize: typography.sizes.md, color: colors.text },
  ctaBtn: {
    backgroundColor: colors.primary, margin: spacing.md, marginBottom: spacing.xl,
    borderRadius: radius.md, paddingVertical: 16, alignItems: 'center',
  },
  ctaBtnText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold },
});
