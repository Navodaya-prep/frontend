import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout, fetchProfile } from '../../store/authSlice';
import { profileApi } from '../../api/profileApi';
import { storage } from '../../utils/storage';
import { LANGUAGES } from '../../i18n';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const MENU_ITEMS = [
  { icon: '📊', titleKey: 'profile.myProgress', subKey: 'profile.myProgressSub', screen: 'Analytics' },
  { icon: '🌐', titleKey: 'profile.language', subKey: 'profile.languageSub', action: 'language' },
  { icon: '🔒', titleKey: 'profile.privacyPolicy', subKey: 'profile.privacyPolicySub', screen: 'PrivacyPolicy' },
  { icon: '📞', titleKey: 'profile.helpSupport', subKey: 'profile.helpSupportSub', screen: 'Doubts', tab: true },
];

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({ totalTests: 0, totalScore: 0, bestScore: 0 });
  const [langModal, setLangModal] = useState(false);

  const changeLanguage = async (code) => {
    await i18n.changeLanguage(code);
    await storage.setLanguage(code);
    setLangModal(false);
  };

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
      // silently fail — profile loads from cached Redux state
    }
  };

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const handleMenuPress = (item) => {
    if (item.action === 'language') {
      setLangModal(true);
    } else if (item.screen) {
      item.tab ? navigation.navigate(item.screen) : navigation.getParent()?.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || t('common.student')}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone || '—'}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.getParent()?.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            [stats.totalTests || 0, t('profile.testsDone')],
            [user?.starPoints || 0, t('profile.starPoints')],
            [user?.streak || 0, t('profile.dayStreakLabel')]
          ].map(([val, label]) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => {
            const isActionable = !!item.screen || !!item.action;
            return (
              <TouchableOpacity
                key={item.titleKey}
                style={[styles.menuItem, !isActionable && styles.menuItemDisabled]}
                onPress={() => handleMenuPress(item)}
                activeOpacity={isActionable ? 0.7 : 1}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuInfo}>
                  <Text style={[styles.menuTitle, !isActionable && styles.menuTitleDisabled]}>{t(item.titleKey)}</Text>
                  <Text style={styles.menuSubtitle}>{t(item.subKey)}</Text>
                </View>
                <Text style={[styles.menuArrow, !isActionable && { opacity: 0.3 }]}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
        <Text style={styles.version}>NavodayaSarthi v1.0.0</Text>
      </ScrollView>

      {/* Language selector */}
      <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('profile.chooseLanguage')}</Text>
            {LANGUAGES.map((lang) => {
              const selected = i18n.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langOption, selected && styles.langOptionSelected]}
                  onPress={() => changeLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langLabel, selected && styles.langLabelSelected]}>{lang.label}</Text>
                  {selected && <Text style={styles.langCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginHorizontal: spacing.md, marginTop: -spacing.lg, marginBottom: spacing.md,
    borderRadius: radius.xl,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statVal: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.primary },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
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
  menuItemDisabled: { opacity: 0.5 },
  menuTitleDisabled: { color: colors.textSecondary },
  logoutBtn: {
    margin: spacing.md, borderRadius: radius.md, paddingVertical: 14,
    alignItems: 'center', borderWidth: 2, borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  version: { textAlign: 'center', color: colors.textLight, fontSize: typography.sizes.xs, marginBottom: spacing.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: spacing.xl },
  modalCard: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg },
  modalTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  langOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border, marginBottom: spacing.sm,
  },
  langOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  langLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text },
  langLabelSelected: { color: colors.primary },
  langCheck: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.primary },
});
