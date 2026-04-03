import React, { useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMockTests } from '../../store/mockTestSlice';
import { fetchCourses } from '../../store/courseSlice';
import { fetchProfile } from '../../store/authSlice';
import { fetchSettings } from '../../store/settingsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { SUBJECTS } from '../../utils/constants';

const BIG_FOUR = [
  { id: 'recorded', icon: '🎥', title: 'Recorded Classes', subtitle: 'Learn at your pace', color: colors.primary, screen: 'Courses' },
  { id: 'live', icon: '🔴', title: 'Live Classes', subtitle: 'Join now!', color: colors.error, live: true, tab: 'Live' },
  { id: 'practice', icon: '📋', title: 'Practice Hub', subtitle: '1200+ MCQs', color: colors.accent, screen: 'PracticeSubjects' },
  { id: 'mock', icon: '📊', title: 'Mock Tests', subtitle: 'Full-length exams', color: colors.success, screen: 'MockTestList' },
];

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { tests } = useSelector((s) => s.mockTest);
  const { examDate, examName } = useSelector((s) => s.settings);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchMockTests());
    dispatch(fetchProfile());
    dispatch(fetchSettings());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchCourses()),
      dispatch(fetchMockTests()),
      dispatch(fetchProfile()),
      dispatch(fetchSettings()),
    ]);
    setRefreshing(false);
  };

  // Calculate days left dynamically
  const daysLeft = useMemo(() => {
    console.log('Calculating days left. examDate:', examDate);
    if (!examDate) return null;
    const today = new Date();
    const exam = new Date(examDate);
    console.log('Today:', today, 'Exam:', exam);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('Days left:', diffDays);
    return diffDays > 0 ? diffDays : 0;
  }, [examDate]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</Text>
            <Text style={styles.greetingSub}>Ready to crack JNVST?</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>{user?.streak || 0}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* Exam Countdown */}
        <View style={styles.countdownBanner}>
          <View>
            <Text style={styles.countdownTitle}>{examName || 'JNVST 2026'}</Text>
            <Text style={styles.countdownSub}>Stay consistent · Stay ahead</Text>
          </View>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownDays}>{daysLeft !== null ? daysLeft : '—'}</Text>
            <Text style={styles.countdownDaysLabel}>days left</Text>
          </View>
        </View>

        {/* Big Four Grid */}
        <Text style={styles.sectionTitle}>Your Learning Hub</Text>
        <View style={styles.bigFourGrid}>
          {BIG_FOUR.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.bigFourCard, { borderTopColor: item.color }]}
              onPress={() => item.tab ? navigation.navigate('Dashboard', { screen: item.tab }) : navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.bigFourIconRow}>
                <Text style={styles.bigFourIcon}>{item.icon}</Text>
                {item.live && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.bigFourTitle}>{item.title}</Text>
              <Text style={styles.bigFourSub}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subjects */}
        <Text style={styles.sectionTitle}>Study by Subject</Text>
        {SUBJECTS.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={styles.subjectRow}
            onPress={() => navigation.navigate('Courses', { subject: subject.id })}
            activeOpacity={0.8}
          >
            <View style={[styles.subjectIconWrap, { backgroundColor: subject.color + '20' }]}>
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
            </View>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectTitle}>{subject.title}</Text>
              <Text style={styles.subjectSub}>{subject.questions} Questions in Exam</Text>
            </View>
            <View style={[styles.subjectArrow, { backgroundColor: subject.color }]}>
              <Text style={styles.subjectArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Daily Challenge */}
        <TouchableOpacity
          style={styles.challengeCard}
          onPress={() => navigation.navigate('DailyChallenge')}
          activeOpacity={0.8}
        >
          <View style={styles.challengeLeft}>
            <Text style={styles.challengeEmoji}>⚡</Text>
            <View>
              <Text style={styles.challengeTitle}>Daily Challenge</Text>
              <Text style={styles.challengeSub}>Solve today's question · Earn up to 150 pts</Text>
            </View>
          </View>
          <View style={styles.challengeBtn}>
            <Text style={styles.challengeBtnText}>Go!</Text>
          </View>
        </TouchableOpacity>

        {/* Leaderboard Preview */}
        <TouchableOpacity style={styles.leaderboardBanner} onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.leaderboardIcon}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.leaderboardTitle}>Challenge Leaderboard</Text>
            <Text style={styles.leaderboardSub}>See how you rank today & this month</Text>
          </View>
          <Text style={styles.leaderboardArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  greeting: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  greetingSub: { fontSize: typography.sizes.sm, color: '#B8D4FF', marginTop: 2 },
  streakBadge: {
    backgroundColor: colors.primaryDark, borderRadius: radius.md,
    padding: spacing.sm, alignItems: 'center', minWidth: 70,
  },
  streakFire: { fontSize: 20 },
  streakNum: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  streakLabel: { fontSize: typography.sizes.xs, color: '#B8D4FF' },
  countdownBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.accent, marginHorizontal: spacing.md, marginTop: spacing.md,
    borderRadius: radius.lg, padding: spacing.md,
  },
  countdownTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.white },
  countdownSub: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  countdownBadge: { alignItems: 'center' },
  countdownDays: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.extrabold, color: colors.white },
  countdownDaysLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: {
    fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold,
    color: colors.text, marginHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  bigFourGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
  },
  bigFourCard: {
    width: '48%', backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginHorizontal: '1%', marginBottom: spacing.sm,
    borderTopWidth: 4, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  bigFourIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  bigFourIcon: { fontSize: 28, marginRight: spacing.xs },
  liveBadge: {
    backgroundColor: colors.error, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  liveBadgeText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.extrabold },
  bigFourTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  bigFourSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  subjectRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, marginHorizontal: spacing.md, marginBottom: spacing.sm,
    borderRadius: radius.lg, padding: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  subjectIconWrap: {
    width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  subjectIcon: { fontSize: 22 },
  subjectInfo: { flex: 1 },
  subjectTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  subjectSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  subjectArrow: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  subjectArrowText: { color: colors.white, fontWeight: typography.weights.bold },
  challengeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, marginHorizontal: spacing.md, marginTop: spacing.sm,
    borderRadius: radius.lg, padding: spacing.md,
  },
  challengeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  challengeEmoji: { fontSize: 28, marginRight: spacing.sm },
  challengeTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.white },
  challengeSub: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },
  challengeBtn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  challengeBtnText: { color: colors.white, fontWeight: typography.weights.extrabold, fontSize: typography.sizes.md },
  leaderboardBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, marginHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl,
    borderRadius: radius.lg, padding: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  leaderboardIcon: { fontSize: 28, marginRight: spacing.md },
  leaderboardTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  leaderboardSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  leaderboardArrow: { fontSize: typography.sizes.lg, color: colors.primary, fontWeight: typography.weights.bold },
});
