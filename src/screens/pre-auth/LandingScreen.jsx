import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Modal, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { storage } from '../../utils/storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🎥', titleKey: 'landing.featureVideoTitle', descKey: 'landing.featureVideoDesc', highlightKey: 'landing.featureVideoHighlight' },
  { icon: '📋', titleKey: 'landing.featureMockTitle', descKey: 'landing.featureMockDesc', highlightKey: 'landing.featureMockHighlight' },
  { icon: '🧠', titleKey: 'landing.featureMcqTitle', descKey: 'landing.featureMcqDesc', highlightKey: 'landing.featureMcqHighlight' },
  { icon: '👨‍🏫', titleKey: 'landing.featureMentorTitle', descKey: 'landing.featureMentorDesc', highlightKey: 'landing.featureMentorHighlight' },
  { icon: '🔴', titleKey: 'landing.featureLiveTitle', descKey: 'landing.featureLiveDesc', highlightKey: 'landing.featureLiveHighlight' },
  { icon: '📊', titleKey: 'landing.featureProgressTitle', descKey: 'landing.featureProgressDesc', highlightKey: 'landing.featureProgressHighlight' },
];

const SUCCESS_STORIES = [
  {
    name: 'Utkarsh',
    state: 'Uttar Pradesh',
    school: 'JNV Ambedkar Nagar',
    year: '2024',
    story: 'Coming from a small village in UP, I never imagined I would crack JNVST. NavodayaSarthi\'s video lessons helped me understand concepts that seemed impossible before. The daily practice tests and doubt resolution were game changers. Today, I\'m proudly studying at JNV Ambedkar Nagar!',
  },
  {
    name: 'Rishikesh Mishra',
    state: 'Uttar Pradesh',
    school: 'JNV Ambedkar Nagar',
    year: '2024',
    story: 'The mock tests on NavodayaSarthi are exactly like the real exam. I practiced every single one and learned from my mistakes. The detailed solutions and explanation videos made all the difference. The live doubt sessions every evening cleared all my confusions right before the exam.',
  },
  {
    name: 'Amit Verma',
    state: 'Uttar Pradesh',
    school: 'JNV Faizabad',
    year: '2024',
    story: 'My family couldn\'t afford coaching classes. NavodayaSarthi was completely free for me. The structured study plan, chapter-wise tests, and regular progress tracking kept me motivated. I studied 2 hours daily for 6 months and achieved my dream of getting into Navodaya!',
  },
  {
    name: 'Anurag Anand',
    state: 'Uttar Pradesh',
    school: 'JNV Prayagraj',
    year: '2024',
    story: 'The practice hub with 1200+ questions was my secret weapon. I solved every question twice. The difficulty levels helped me progress gradually. The leaderboard feature motivated me to compete with thousands of other students. Thank you NavodayaSarthi for making my dream come true!',
  },
];

export default function LandingScreen({ navigation }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    await i18n.changeLanguage(next);
    await storage.setLanguage(next);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoRow}>
              <Image source={require('../../../assets/logo.png')} style={styles.logoImg} />
              <Text style={styles.logo}>NavodayaSarthi</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage} activeOpacity={0.7}>
                <Text style={styles.langBtnText}>🌐 {i18n.language === 'hi' ? 'EN' : 'हिं'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('landing.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('landing.heroSubtitle')}
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaBtnText}>{t('landing.getStarted')}</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>{t('landing.ctaNote')}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              ['1K+', t('landing.statActiveStudents')],
              ['1200+', t('landing.statPracticeQuestions')],
              [t('landing.statSubjects'), t('landing.statFullCoverage')],
              ['100+', t('landing.statVideoLessons')]
            ].map(([num, label]) => (
              <View key={label} style={styles.statItem}>
                <Text style={styles.statNum}>{num}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Success Stories */}
        <View style={[styles.section, styles.successSection]}>
          <Text style={[styles.sectionTitle, { color: colors.white }]}>{t('landing.successTitle')}</Text>
          <Text style={styles.successSubtitle}>{t('landing.successSubtitle')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {SUCCESS_STORIES.map((s) => (
              <TouchableOpacity
                key={s.name}
                style={styles.storyCard}
                onPress={() => setSelectedStory(s)}
                activeOpacity={0.95}
              >
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyAvatarText}>{s.name[0]}</Text>
                </View>
                <Text style={styles.storyName}>{s.name}</Text>
                <Text style={styles.storySchool}>{s.school}</Text>
                <Text style={styles.storyYear}>{t('landing.classOf', { year: s.year })}</Text>
                <Text style={styles.storyReadMore}>{t('landing.tapToRead')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('landing.featuresTitle')}</Text>
          <Text style={styles.sectionSubtitle}>{t('landing.featuresSubtitle')}</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <View key={f.titleKey} style={styles.featureCard}>
                <View style={styles.featureTop}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <View style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{t(f.highlightKey)}</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
                <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>{t('landing.howItWorksTitle')}</Text>
          <Text style={styles.sectionSubtitle}>{t('landing.howItWorksSubtitle')}</Text>
          {[
            { step: '1', icon: '📱', title: t('landing.step1Title'), desc: t('landing.step1Desc') },
            { step: '2', icon: '📚', title: t('landing.step2Title'), desc: t('landing.step2Desc') },
            { step: '3', icon: '🎯', title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            { step: '4', icon: '🏆', title: t('landing.step4Title'), desc: t('landing.step4Desc') },
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

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>{t('landing.trustTitle')}</Text>
          <View style={styles.trustGrid}>
            {[
              { icon: '🔒', text: t('landing.trustSafe'), sub: t('landing.trustSafeSub') },
              { icon: '📱', text: t('landing.trustOffline'), sub: t('landing.trustOfflineSub') },
            ].map((item) => (
              <View key={item.text} style={styles.trustCard}>
                <Text style={styles.trustIcon}>{item.icon}</Text>
                <Text style={styles.trustText}>{item.text}</Text>
                <Text style={styles.trustSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('landing.whyTitle')}</Text>
          {[
            { icon: '🎁', title: t('landing.whyFreeTitle'), desc: t('landing.whyFreeDesc') },
            { icon: '🌍', title: t('landing.whyAnywhereTitle'), desc: t('landing.whyAnywhereDesc') },
            { icon: '📞', title: t('landing.whySupportTitle'), desc: t('landing.whySupportDesc') },
            { icon: '🎓', title: t('landing.whyTeachersTitle'), desc: t('landing.whyTeachersDesc') },
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
            <Text style={styles.navButtonText}>{t('landing.aboutUs')}</Text>
            <Text style={styles.navButtonArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')} style={styles.navButton}>
            <Text style={styles.navButtonText}>{t('landing.faqSupport')}</Text>
            <Text style={styles.navButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Bottom */}
        <View style={styles.bottomCta}>
          <Text style={styles.bottomCtaEmoji}>🚀</Text>
          <Text style={styles.bottomCtaTitle}>{t('landing.bottomCtaTitle')}</Text>
          <Text style={styles.bottomCtaSubtitle}>{t('landing.bottomCtaSubtitle')}</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaBtnText}>{t('landing.startLearningNow')}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <Image source={require('../../../assets/logo.png')} style={styles.footerLogoImg} />
            <Text style={styles.footerLogo}>NavodayaSarthi</Text>
          </View>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkTitle}>{t('landing.quickLinks')}</Text>
            <View style={styles.quickLinksRow}>
              <View style={styles.quickLinksColumn}>
                <TouchableOpacity onPress={() => navigation.navigate('About')}>
                  <Text style={styles.footerLink}>{t('landing.aboutUs')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                  <Text style={styles.footerLink}>{t('landing.helpFaq')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickLinksColumn}>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                  <Text style={styles.footerLink}>{t('landing.privacyPolicy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                  <Text style={styles.footerLink}>{t('landing.termsOfService')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkTitle}>{t('landing.contactUs')}</Text>
            <Text style={styles.footerContact}>📧 navodayasarthi.help@gmail.com</Text>
            <Text style={styles.footerContact}>📞 +91 81759 47318</Text>
            <Text style={styles.footerContact}>{t('landing.whatsappSupport')}</Text>
          </View>


<View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>{t('landing.copyright')}</Text>
            <Text style={styles.footerMadeWith}>{t('landing.madeWith')}</Text>
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
                    <Text style={styles.modalYear}>JNVST {selectedStory.year}</Text>
                  </View>

                  <View style={styles.modalStory}>
                    <Text style={styles.modalStoryTitle}>{t('landing.successStoryLabel')}</Text>
                    <Text style={styles.modalStoryText}>{selectedStory.story}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCtaBtn}
                    onPress={() => {
                      setSelectedStory(null);
                      navigation.navigate('Login');
                    }}
                  >
                    <Text style={styles.modalCtaBtnText}>{t('landing.startYourJourney')}</Text>
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
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 36, height: 36, borderRadius: 18, resizeMode: 'cover' },
  logo: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  logoSub: { fontSize: typography.sizes.sm, color: colors.accent, fontWeight: typography.weights.bold, marginTop: -4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  langBtn: {
    borderWidth: 2, borderColor: colors.white, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  langBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  loginBtn: {
    borderWidth: 2, borderColor: colors.white, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  loginBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: 0,
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
  successSection: { backgroundColor: colors.accent, paddingBottom: spacing.lg },
  successSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: typography.sizes.sm, marginBottom: spacing.md, textAlign: 'center' },
  storiesScroll: { paddingLeft: spacing.md },
  storyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
    width: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  storyAvatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
    borderWidth: 3, borderColor: colors.accent,
  },
  storyAvatarText: { color: colors.white, fontWeight: typography.weights.extrabold, fontSize: typography.sizes.xxl },
  storyName: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.md, textAlign: 'center', marginBottom: 4 },
  storySchool: { color: colors.textSecondary, fontSize: typography.sizes.xs, textAlign: 'center', marginBottom: spacing.sm },
  storyRankBadge: { backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 4, marginBottom: spacing.xs },
  storyRank: { color: colors.white, fontSize: typography.sizes.sm, fontWeight: typography.weights.extrabold },
  storyYear: { color: colors.textLight, fontSize: typography.sizes.xs, marginBottom: spacing.sm },
  storyReadMore: { color: colors.primary, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  
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
  footerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  footerLogoImg: { width: 40, height: 40, borderRadius: 20, resizeMode: 'cover' },
  footerLogo: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
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
