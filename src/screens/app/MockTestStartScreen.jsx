import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { startMockTest, resetMockTest } from '../../store/mockTestSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';

const RULES = [
  'The timer starts as soon as you tap "Start Test".',
  'The test will auto-submit when time runs out.',
  'You can navigate between questions using the number grid.',
  'Answered questions are highlighted in green.',
  'You can change your answer anytime before submitting.',
  'Each correct answer carries 1 mark. No negative marking.',
  'Do not exit the app during the test.',
];

export default function MockTestStartScreen({ navigation, route }) {
  const { test } = route.params;
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.mockTest);

  const questionCount = test.questionCount || (test.questions?.length) || '—';
  const isRetest = !!test.latestAttempt;

  const handleStart = async () => {
    dispatch(resetMockTest());
    const result = await dispatch(startMockTest(test.id || test._id));
    if (startMockTest.fulfilled.match(result)) {
      navigation.replace('MockTestTake');
    } else {
      Alert.alert('Error', result.payload || 'Failed to load test. Please try again.');
    }
  };

  if (status === 'loading') return <AppLoader fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Test Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.testTitle}>{test.title}</Text>

          {isRetest && (
            <View style={styles.retestBanner}>
              <Text style={styles.retestBannerText}>
                🔄 You have already attempted this test. This will be a new attempt.
              </Text>
            </View>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{questionCount}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{test.duration}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{questionCount}</Text>
              <Text style={styles.statLabel}>Max Marks</Text>
            </View>
          </View>
        </View>

        {/* Previous Score */}
        {isRetest && test.latestAttempt && (
          <View style={styles.prevAttempt}>
            <Text style={styles.prevTitle}>Your Previous Score</Text>
            <View style={styles.prevScoreRow}>
              <Text style={styles.prevScore}>
                {test.latestAttempt.score}/{test.latestAttempt.totalMarks}
              </Text>
              <Text style={styles.prevPercent}>
                {Math.round(test.latestAttempt.percent || (test.latestAttempt.score / test.latestAttempt.totalMarks) * 100)}%
              </Text>
            </View>
          </View>
        )}

        {/* Rules */}
        <View style={styles.rulesSection}>
          <Text style={styles.rulesTitle}>📋 Instructions</Text>
          {RULES.map((rule, i) => (
            <View key={i} style={styles.ruleItem}>
              <View style={styles.ruleBullet}>
                <Text style={styles.ruleBulletText}>{i + 1}</Text>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>
              {isRetest ? '🔄 Start Retest' : '🚀 Start Test'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
  back: { color: colors.white, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  headerTitle: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  infoCard: {
    backgroundColor: colors.primary, padding: spacing.lg, marginBottom: spacing.md,
  },
  testTitle: {
    fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold,
    color: colors.white, marginBottom: spacing.lg, lineHeight: 32,
  },
  retestBanner: {
    backgroundColor: colors.accent + '30', borderRadius: radius.md,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  retestBannerText: { color: colors.white, fontSize: typography.sizes.sm, lineHeight: 20 },
  statsGrid: {
    flexDirection: 'row', backgroundColor: colors.primaryDark,
    borderRadius: radius.lg, padding: spacing.md, alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.white },
  statLabel: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 4 },
  prevAttempt: {
    backgroundColor: colors.white, margin: spacing.md, borderRadius: radius.lg,
    padding: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  prevTitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  prevScoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prevScore: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text },
  prevPercent: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.success },
  rulesSection: { backgroundColor: colors.white, margin: spacing.md, borderRadius: radius.lg, padding: spacing.md },
  rulesTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  ruleBullet: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm, marginTop: 1,
  },
  ruleBulletText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.primary },
  ruleText: { flex: 1, fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 22 },
  footer: { padding: spacing.md, paddingBottom: spacing.xl },
  startBtn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginBottom: spacing.sm,
  },
  startBtnText: { color: colors.white, fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: colors.textSecondary, fontSize: typography.sizes.md },
});
