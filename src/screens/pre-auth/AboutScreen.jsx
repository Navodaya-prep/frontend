import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import Footer from '../../components/common/Footer';

const AVATAR_COLORS = ['#E53935', '#8E24AA', '#1E88E5', '#00897B', '#F4511E', '#6D4C41'];
const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const TEAM = [
  { name: 'Deepak Kumar', roleKey: 'about.roleCoFounderAlumni', expKey: 'about.expBuilding' },
  { name: 'Vikram Kumar', roleKey: 'about.roleCoFounderAlumni', expKey: 'about.expBuilding' },
  { name: 'DK Gaur', roleKey: 'about.roleMathExpert', expKey: 'about.exp20' },
  { name: 'Suraj Yadav', roleKey: 'about.roleCoFounderReasoning', expKey: 'about.exp5' },
  { name: 'Rahul Kumar', roleKey: 'about.roleLanguageAlumni', expKey: 'about.exp3' },
];

export default function AboutScreen({ navigation }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about.title')}</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Story */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🏫</Text>
          <Text style={styles.heroTitle}>{t('about.storyTitle')}</Text>
          <Text style={styles.heroText}>{t('about.storyP1')}</Text>
          <Text style={styles.heroText}>{t('about.storyP2')}</Text>
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <Text style={styles.missionIcon}>🎯</Text>
          <Text style={styles.missionTitle}>{t('about.missionTitle')}</Text>
          <Text style={styles.missionText}>{t('about.missionText')}</Text>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.teamTitle')}</Text>
          {TEAM.map((member) => (
            <View key={member.name} style={styles.teamCard}>
              <View style={[styles.teamAvatar, { backgroundColor: getAvatarColor(member.name) }]}>
                <Text style={styles.teamAvatarInitial}>{member.name[0]}</Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{t(member.roleKey)}</Text>
                <Text style={styles.teamExp}>{t(member.expKey)}</Text>
              </View>
            </View>
          ))}
        </View>

        <Footer navigation={navigation} />
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
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  teamAvatarInitial: {
    fontSize: 22, fontWeight: 'bold', color: '#fff',
  },
  teamInfo: { flex: 1 },
  teamName: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  teamRole: { fontSize: typography.sizes.sm, color: colors.primary, marginTop: 2 },
  teamExp: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
});
