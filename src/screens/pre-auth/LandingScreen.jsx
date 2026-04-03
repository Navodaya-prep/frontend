import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🎥', title: 'Video Lessons', desc: 'Expert-taught concept videos', highlight: '500+ Videos' },
  { icon: '📋', title: 'Mock Tests', desc: 'Full-length timed exams', highlight: '50+ Tests' },
  { icon: '🧠', title: 'Practice MCQs', desc: '1200+ chapter-wise questions', highlight: '1200+ MCQs' },
  { icon: '👨‍🏫', title: 'Expert Mentors', desc: 'Doubt support anytime', highlight: '24/7 Support' },
  { icon: '🔴', title: 'Live Classes', desc: 'Interactive doubt sessions', highlight: 'Daily Live' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics & reports', highlight: 'AI Powered' },
];

const SUCCESS_STORIES = [
  { 
    name: 'Priya Sharma', 
    state: 'Uttar Pradesh', 
    school: 'JNV Lucknow',
    year: '2024',
    rank: 'AIR 127',
    story: 'Coming from a small village in UP, I never imagined I would crack JNVST. Navodaya Prime\'s video lessons helped me understand concepts that seemed impossible before. The daily practice tests and AI-powered doubt resolution were game changers. Today, I\'m proudly studying at JNV Lucknow!',
    subjects: { mental: 38, arithmetic: 19, language: 18 }
  },
  { 
    name: 'Arjun Patel', 
    state: 'Madhya Pradesh', 
    school: 'JNV Bhopal',
    year: '2024',
    rank: 'AIR 243',
    story: 'The mock tests on Navodaya Prime are exactly like the real exam. I practiced every single one and learned from my mistakes. The detailed solutions and explanation videos made all the difference. The live doubt sessions every evening cleared all my confusions right before the exam.',
    subjects: { mental: 37, arithmetic: 18, language: 19 }
  },
  { 
    name: 'Anjali Devi', 
    state: 'Bihar', 
    school: 'JNV Patna',
    year: '2023',
    rank: 'AIR 156',
    story: 'My family couldn\'t afford coaching classes. Navodaya Prime was completely free for me. The structured study plan, chapter-wise tests, and regular progress tracking kept me motivated. I studied 2 hours daily for 6 months and achieved my dream of getting into Navodaya!',
    subjects: { mental: 39, arithmetic: 17, language: 18 }
  },
  { 
    name: 'Rahul Kumar', 
    state: 'Rajasthan', 
    school: 'JNV Jaipur',
    year: '2024',
    rank: 'AIR 89',
    story: 'The practice hub with 1200+ questions was my secret weapon. I solved every question twice. The difficulty levels helped me progress gradually. The leaderboard feature motivated me to compete with thousands of other students. Thank you Navodaya Prime for making my dream come true!',
    subjects: { mental: 40, arithmetic: 19, language: 19 }
  },
];

export default function LandingScreen({ navigation }) {
  const [selectedStory, setSelectedStory] = useState(null);

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
            <Text style={styles.heroBadgeText}>🎯 #1 JNVST Preparation Platform</Text>
          </View>
          <Text style={styles.heroTitle}>Your Journey to{'\n'}Navodaya Excellence{'\n'}Starts Here</Text>
          <Text style={styles.heroSubtitle}>
            Join 50,000+ students preparing for Jawahar Navodaya Vidyalaya Selection Test with India's most trusted JNVST app. Learn from expert educators, practice with 1200+ questions, and track your progress every day.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaBtnText}>Get Started →</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>✓ No credit card required · ✓ Free forever plan available</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              ['50K+', 'Active Students'],
              ['1200+', 'Practice Questions'],
              ['95%', 'Success Rate'],
              ['500+', 'Video Lessons']
            ].map(([num, label]) => (
              <View key={label} style={styles.statItem}>
                <Text style={styles.statNum}>{num}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Trusted by Students Across India 🇮🇳</Text>
          <View style={styles.trustGrid}>
            {[
              { icon: '⭐', text: '4.8/5 Rating', sub: '10,000+ reviews' },
              { icon: '🏆', text: 'Award Winning', sub: 'Best EdTech 2024' },
              { icon: '🔒', text: '100% Safe', sub: 'Secure & Private' },
              { icon: '📱', text: 'Works Offline', sub: '2G Compatible' },
            ].map((item) => (
              <View key={item.text} style={styles.trustCard}>
                <Text style={styles.trustIcon}>{item.icon}</Text>
                <Text style={styles.trustText}>{item.text}</Text>
                <Text style={styles.trustSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Everything You Need to Crack JNVST</Text>
          <Text style={styles.sectionSubtitle}>Complete preparation package in one app</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <View style={styles.featureTop}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <View style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{f.highlight}</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Your path to success in 4 simple steps</Text>
          {[
            { step: '1', icon: '📱', title: 'Download & Sign Up', desc: 'Create your free account in 30 seconds' },
            { step: '2', icon: '📚', title: 'Choose Your Plan', desc: 'Select subjects and start learning' },
            { step: '3', icon: '🎯', title: 'Practice Daily', desc: 'Solve questions, watch videos, take tests' },
            { step: '4', icon: '🏆', title: 'Track & Improve', desc: 'Monitor progress and ace the exam' },
          ].map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepIcon}>
                <Text style={styles.stepIconText}>{item.icon}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Success Stories */}
        <View style={[styles.section, styles.successSection]}>
          <Text style={[styles.sectionTitle, { color: colors.white }]}>Success Stories</Text>
          <Text style={styles.successSubtitle}>Real students, real results, real dreams achieved ✨</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {SUCCESS_STORIES.map((s) => (
              <TouchableOpacity 
                key={s.name} 
                style={styles.storyCard}
                onPress={() => setSelectedStory(s)}
                activeOpacity={0.9}
              >
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyAvatarText}>{s.name[0]}</Text>
                </View>
                <Text style={styles.storyName}>{s.name}</Text>
                <Text style={styles.storySchool}>{s.school}</Text>
                <View style={styles.storyRankBadge}>
                  <Text style={styles.storyRank}>{s.rank}</Text>
                </View>
                <Text style={styles.storyYear}>Class of {s.year}</Text>
                <Text style={styles.storyReadMore}>Tap to read story →</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Students Choose Us</Text>
          {[
            { icon: '💰', title: 'Affordable for Everyone', desc: 'Free plan available. Premium starts at just ₹99/month' },
            { icon: '🌍', title: 'Learn Anywhere', desc: 'Works on 2G/3G/4G. Download content for offline access' },
            { icon: '📞', title: '24/7 Support', desc: 'WhatsApp support & live doubt resolution every day' },
            { icon: '🎓', title: 'Expert Teachers', desc: 'Learn from IIT, IIM & top university educators' },
          ].map((item) => (
            <View key={item.title} style={styles.whyCard}>
              <Text style={styles.whyIcon}>{item.icon}</Text>
              <View style={styles.whyContent}>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Nav Links */}
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.navButton}>
            <Text style={styles.navButtonText}>About Us</Text>
            <Text style={styles.navButtonArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')} style={styles.navButton}>
            <Text style={styles.navButtonText}>FAQ & Support</Text>
            <Text style={styles.navButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Bottom */}
        <View style={styles.bottomCta}>
          <Text style={styles.bottomCtaEmoji}>🚀</Text>
          <Text style={styles.bottomCtaTitle}>Ready to Begin Your Journey?</Text>
          <Text style={styles.bottomCtaSubtitle}>Join thousands of students who are already preparing</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaBtnText}>Start Learning Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🏫 Navodaya Prime</Text>
          <Text style={styles.footerTagline}>India's #1 JNVST Preparation Platform</Text>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkTitle}>Quick Links</Text>
            <View style={styles.quickLinksRow}>
              <View style={styles.quickLinksColumn}>
                <TouchableOpacity onPress={() => navigation.navigate('About')}>
                  <Text style={styles.footerLink}>About Us</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                  <Text style={styles.footerLink}>Help & FAQ</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickLinksColumn}>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Terms of Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkTitle}>Contact Us</Text>
            <Text style={styles.footerContact}>📧 support@navodayaprime.com</Text>
            <Text style={styles.footerContact}>📞 +91 99999 99999</Text>
            <Text style={styles.footerContact}>💬 WhatsApp Support Available</Text>
          </View>

          <View style={styles.footerSocial}>
            <Text style={styles.footerLinkTitle}>Follow Us</Text>
            <View style={styles.socialIcons}>
              {['📘', '📸', '🐦', '📹'].map((icon) => (
                <TouchableOpacity key={icon} style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>© 2024 Navodaya Prime. All rights reserved.</Text>
            <Text style={styles.footerMadeWith}>Made with ❤️ in India for Indian Students</Text>
          </View>
        </View>
      </ScrollView>

      {/* Success Story Modal */}
      <Modal
        visible={selectedStory !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedStory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedStory && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalAvatar}>
                      <Text style={styles.modalAvatarText}>{selectedStory.name[0]}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.modalClose}
                      onPress={() => setSelectedStory(null)}
                    >
                      <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.modalName}>{selectedStory.name}</Text>
                  <Text style={styles.modalSchool}>{selectedStory.school}</Text>
                  <Text style={styles.modalState}>📍 {selectedStory.state}</Text>
                  
                  <View style={styles.modalRankCard}>
                    <Text style={styles.modalRank}>{selectedStory.rank}</Text>
                    <Text style={styles.modalYear}>JNVST {selectedStory.year}</Text>
                  </View>

                  <View style={styles.modalScores}>
                    <Text style={styles.modalScoresTitle}>Subject-wise Performance</Text>
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Mental Ability:</Text>
                      <Text style={styles.scoreValue}>{selectedStory.subjects.mental}/40</Text>
                    </View>
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Arithmetic:</Text>
                      <Text style={styles.scoreValue}>{selectedStory.subjects.arithmetic}/20</Text>
                    </View>
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Language:</Text>
                      <Text style={styles.scoreValue}>{selectedStory.subjects.language}/20</Text>
                    </View>
                  </View>

                  <View style={styles.modalStory}>
                    <Text style={styles.modalStoryTitle}>Success Story</Text>
                    <Text style={styles.modalStoryText}>{selectedStory.story}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.modalCtaBtn}
                    onPress={() => {
                      setSelectedStory(null);
                      navigation.navigate('Login');
                    }}
                  >
                    <Text style={styles.modalCtaBtnText}>Start Your Journey →</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: '100%',
    elevation: 4,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaBtnText: { 
    color: colors.white, 
    fontSize: typography.sizes.lg, 
    fontWeight: typography.weights.extrabold, 
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  ctaNote: { textAlign: 'center', color: '#B8D4FF', fontSize: typography.sizes.xs, marginBottom: spacing.lg },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  statItem: { alignItems: 'center', width: '48%', marginBottom: spacing.sm },
  statNum: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
  statLabel: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2, textAlign: 'center' },
  
  // Trust Section
  trustSection: { backgroundColor: '#F8F9FA', padding: spacing.lg },
  trustTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  trustCard: { width: '48%', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, alignItems: 'center', elevation: 1 },
  trustIcon: { fontSize: 28, marginBottom: spacing.xs },
  trustText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text, textAlign: 'center' },
  trustSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  
  section: { padding: spacing.md, paddingTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  sectionSubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
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
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  featureIcon: { fontSize: 28 },
  featureBadge: { backgroundColor: colors.accent + '20', borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  featureBadgeText: { fontSize: 9, color: colors.accent, fontWeight: typography.weights.bold },
  featureTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  featureDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  
  // How It Works
  howItWorksSection: { backgroundColor: '#F8F9FA', padding: spacing.lg },
  stepCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, elevation: 1 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  stepNumberText: { color: colors.white, fontWeight: typography.weights.extrabold, fontSize: typography.sizes.md },
  stepIcon: { marginRight: spacing.sm },
  stepIconText: { fontSize: 28 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  stepDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  
  // Success Stories
  successSection: { backgroundColor: colors.primary, paddingBottom: spacing.lg },
  successSubtitle: { color: '#B8D4FF', fontSize: typography.sizes.sm, marginBottom: spacing.md, textAlign: 'center' },
  storiesScroll: { paddingLeft: spacing.md },
  storyCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
    width: 180,
    borderWidth: 2,
    borderColor: colors.accent + '30',
  },
  storyAvatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
    borderWidth: 3, borderColor: colors.white,
  },
  storyAvatarText: { color: colors.white, fontWeight: typography.weights.extrabold, fontSize: typography.sizes.xxl },
  storyName: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md, textAlign: 'center', marginBottom: 4 },
  storySchool: { color: '#B8D4FF', fontSize: typography.sizes.xs, textAlign: 'center', marginBottom: spacing.sm },
  storyRankBadge: { backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 4, marginBottom: spacing.xs },
  storyRank: { color: colors.white, fontSize: typography.sizes.sm, fontWeight: typography.weights.extrabold },
  storyYear: { color: '#B8D4FF', fontSize: typography.sizes.xs, marginBottom: spacing.sm },
  storyReadMore: { color: colors.accent, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  
  // Why Choose Us
  whyCard: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, elevation: 1 },
  whyIcon: { fontSize: 32, marginRight: spacing.md },
  whyContent: { flex: 1 },
  whyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  whyDesc: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  
  navLinks: { flexDirection: 'row', justifyContent: 'space-around', padding: spacing.md },
  navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, flex: 0.48, justifyContent: 'space-between', elevation: 1 },
  navButtonText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  navButtonArrow: { color: colors.primary, fontSize: typography.sizes.lg },
  
  bottomCta: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  bottomCtaEmoji: { fontSize: 48, marginBottom: spacing.sm },
  bottomCtaTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  bottomCtaSubtitle: { fontSize: typography.sizes.sm, color: '#B8D4FF', marginBottom: spacing.md, textAlign: 'center' },
  
  // Footer
  footer: { backgroundColor: '#1A1A2E', padding: spacing.xl, paddingTop: spacing.xxl },
  footerLogo: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white, textAlign: 'center' },
  footerTagline: { fontSize: typography.sizes.sm, color: '#B8B8C7', textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  footerLinks: { marginBottom: spacing.lg },
  quickLinksRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickLinksColumn: { flex: 1 },
  footerLinkTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.white, marginBottom: spacing.sm },
  footerLink: { fontSize: typography.sizes.sm, color: '#B8B8C7', marginBottom: spacing.xs, paddingVertical: 4 },
  footerContact: { fontSize: typography.sizes.sm, color: '#B8B8C7', marginBottom: spacing.xs },
  footerSocial: { marginBottom: spacing.lg },
  socialIcons: { flexDirection: 'row', marginTop: spacing.sm },
  socialIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2A2A3E', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  socialIconText: { fontSize: 20 },
  footerBottom: { borderTopWidth: 1, borderTopColor: '#2A2A3E', paddingTop: spacing.lg, alignItems: 'center' },
  footerCopyright: { fontSize: typography.sizes.xs, color: '#B8B8C7', marginBottom: spacing.xs },
  footerMadeWith: { fontSize: typography.sizes.xs, color: '#B8B8C7' },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, maxHeight: '90%', padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.primary },
  modalAvatarText: { fontSize: 36, fontWeight: typography.weights.extrabold, color: colors.white },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.backgroundDark, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: typography.sizes.lg, color: colors.text },
  modalName: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: 4 },
  modalSchool: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.primary, marginBottom: 4 },
  modalState: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md },
  modalRankCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  modalRank: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
  modalYear: { fontSize: typography.sizes.sm, color: '#B8D4FF', marginTop: 4 },
  modalScores: { backgroundColor: '#F8F9FA', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  modalScoresTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  scoreLabel: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  scoreValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary },
  modalStory: { marginBottom: spacing.lg },
  modalStoryTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.sm },
  modalStoryText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 24 },
  modalCtaBtn: { 
    backgroundColor: colors.accent, 
    borderRadius: radius.lg, 
    paddingVertical: 18, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  modalCtaBtnText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, letterSpacing: 0.5 },
});
