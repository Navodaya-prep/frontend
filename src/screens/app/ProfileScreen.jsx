import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchProfile } from '../../store/authSlice';
import { profileApi } from '../../api/profileApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const MENU_ITEMS = [
  { icon: '📊', title: 'My Progress', subtitle: 'View your performance analytics' },
  { icon: '🏆', title: 'My Achievements', subtitle: 'Badges and star points earned' },
  { icon: '📥', title: 'Downloaded Content', subtitle: 'Offline videos and PDFs' },
  { icon: '🔔', title: 'Notifications', subtitle: 'Class reminders and updates' },
  { icon: '🌐', title: 'Language', subtitle: 'Hindi / English' },
  { icon: '🔒', title: 'Privacy Policy', subtitle: 'Read our privacy policy' },
  { icon: '📞', title: 'Help & Support', subtitle: 'Contact us for help' },
];

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({ totalTests: 0, totalScore: 0, bestScore: 0 });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
      dispatch(fetchProfile());
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone || '—'}</Text>
          <View style={styles.userTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Class {user?.classLevel || '5'}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{user?.state || 'India'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            [stats.totalTests || 0, 'Tests Done'],
            [user?.starPoints || 0, 'Star Points'],
            [user?.streak || 0, 'Day Streak']
          ].map(([val, label]) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Premium Banner */}
        <TouchableOpacity style={styles.premiumBanner}>
          <Text style={styles.premiumIcon}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumSub}>Unlock full syllabus & live doubt sessions</Text>
          </View>
          <Text style={styles.premiumArrow}>→</Text>
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.title} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Navodaya Prime v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  profileCard: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingBottom: spacing.xl, paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 32, fontWeight: typography.weights.extrabold, color: colors.white },
  userName: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
  userPhone: { fontSize: typography.sizes.sm, color: '#B8D4FF', marginTop: 4 },
  userTags: { flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm },
  tag: { backgroundColor: colors.primaryDark, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 4 },
  tagText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  editBtn: {
    marginTop: spacing.md, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs,
  },
  editBtnText: { color: colors.white, fontWeight: typography.weights.semibold, fontSize: typography.sizes.sm },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white,
    marginHorizontal: spacing.md, marginTop: -1, borderRadius: radius.xl,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statVal: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.primary },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  premiumBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.accent, margin: spacing.md, borderRadius: radius.lg, padding: spacing.md,
  },
  premiumIcon: { fontSize: 28, marginRight: spacing.md },
  premiumTitle: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  premiumSub: { color: 'rgba(255,255,255,0.85)', fontSize: typography.sizes.xs, marginTop: 2 },
  premiumArrow: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.xl },
  menu: { backgroundColor: colors.white, marginHorizontal: spacing.md, borderRadius: radius.xl, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuIcon: { fontSize: 20, marginRight: spacing.md, width: 28 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text },
  menuSubtitle: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  menuArrow: { fontSize: typography.sizes.xl, color: colors.textLight },
  logoutBtn: {
    margin: spacing.md, borderRadius: radius.md, paddingVertical: 14,
    alignItems: 'center', borderWidth: 2, borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  version: { textAlign: 'center', color: colors.textLight, fontSize: typography.sizes.xs, marginBottom: spacing.xl },
});
