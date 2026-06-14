import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { resetMockTest } from '../../store/mockTestSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { pickLocalized } from '../../utils/localize';
import { formatTime, getGrade } from '../../utils/formatters';
import { QuestionCard } from '../../components/mcq/QuestionCard';
import { mockTestApi } from '../../api/mockTestApi';

export default function MockTestResultScreen({ navigation, route }) {
  const { test, result, questions = [], fromHistory = false } = route.params || {};
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [reviewMode, setReviewMode] = useState(false);
  const [loadedResult, setLoadedResult] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // The numbers come from two sources with different shapes:
  //  • fresh submit response → has correct / wrong / skipped / percent
  //  • a stored attempt (history) → has score, totalMarks, and an answers[] array
  // Derive a consistent breakdown that works for both.
  const answers = Array.isArray(result?.answers) ? result.answers : [];
  const total = result?.totalMarks ?? questions.length;
  const correct = result?.correct ?? result?.score ?? answers.filter((a) => a.isCorrect).length;

  let wrong;
  let skipped;
  if (result?.wrong != null || result?.skipped != null) {
    wrong = result.wrong ?? 0;
    skipped = result.skipped ?? Math.max(total - correct - wrong, 0);
  } else if (answers.length > 0) {
    const answered = answers.filter((a) => a.selectedIndex != null && a.selectedIndex !== -1).length;
    wrong = Math.max(answered - correct, 0);
    skipped = Math.max(total - answered, 0);
  } else {
    wrong = Math.max(total - correct, 0);
    skipped = 0;
  }

  const percent = result?.percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0);
  const timeTaken = result?.timeTaken ?? 0;
  const grade = getGrade(percent);

  // Detailed answers: prefer freshly-fetched (history), fall back to submit response
  const detailedAnswers = (loadedResult || result)?.detailed || [];

  const handleReviewToggle = async () => {
    if (!reviewMode && fromHistory && !loadedResult) {
      setDetailLoading(true);
      try {
        const res = await mockTestApi.getAttemptDetails(result.id || result._id);
        setLoadedResult(res.data?.result || res.data);
        setReviewMode(true);
      } catch {
        Alert.alert('Error', 'Failed to load review. Please try again.');
      } finally {
        setDetailLoading(false);
      }
    } else {
      setReviewMode(!reviewMode);
    }
  };

  const handleGoHome = () => {
    dispatch(resetMockTest());
    navigation.navigate('Dashboard');
  };

  const handleRetest = () => {
    dispatch(resetMockTest());
    if (test?.isPremium && !user?.isPremium) navigation.navigate('PremiumUpgrade');
    else navigation.navigate('MockTestStart', { test });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Result Hero */}
        <View style={styles.hero}>
          <Text style={styles.emoji}>
            {percent >= 80 ? '🏆' : percent >= 60 ? '⭐' : percent >= 40 ? '💪' : '📖'}
          </Text>
          <Text style={styles.testTitle} numberOfLines={2}>{pickLocalized(test, 'title')}</Text>
          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.percentBig}>{percent}%</Text>
          <Text style={styles.scoreDetail}>{correct} correct out of {total}</Text>
          {timeTaken > 0 && (
            <View style={styles.timeTakenBadge}>
              <Text style={styles.timeTakenText}>⏱ Time taken: {formatTime(timeTaken)}</Text>
            </View>
          )}
        </View>

        {/* Score Breakdown */}
        <View style={styles.breakdown}>
          <View style={[styles.breakdownItem, { backgroundColor: colors.successLight }]}>
            <Text style={styles.breakdownNum}>{correct}</Text>
            <Text style={styles.breakdownLabel}>✅ Correct</Text>
          </View>
          <View style={[styles.breakdownItem, { backgroundColor: colors.errorLight }]}>
            <Text style={styles.breakdownNum}>{wrong}</Text>
            <Text style={styles.breakdownLabel}>❌ Wrong</Text>
          </View>
          <View style={[styles.breakdownItem, { backgroundColor: colors.warningLight }]}>
            <Text style={styles.breakdownNum}>{skipped}</Text>
            <Text style={styles.breakdownLabel}>⏭ Skipped</Text>
          </View>
        </View>

        {/* Score Bar */}
        <View style={styles.scoreBarSection}>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${percent}%`, backgroundColor: grade.color }]} />
          </View>
          <View style={styles.scoreBarLabels}>
            <Text style={styles.scoreBarLabel}>0%</Text>
            <Text style={[styles.scoreBarLabel, { color: grade.color, fontWeight: typography.weights.bold }]}>
              {percent}%
            </Text>
            <Text style={styles.scoreBarLabel}>100%</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.reviewBtn]}
            onPress={handleReviewToggle}
            disabled={detailLoading}
          >
            {detailLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.reviewBtnText}>
                {reviewMode ? '▲ Hide Review' : '🔍 Review Answers'}
              </Text>
            )}
          </TouchableOpacity>

          {!fromHistory && (
            <TouchableOpacity style={[styles.actionBtn, styles.retestBtn]} onPress={handleRetest}>
              <Text style={styles.retestBtnText}>🔄 Retest</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.homeBtn]} onPress={handleGoHome}>
            <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Answer Review Section */}
        {reviewMode && detailedAnswers.length > 0 && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Answer Review</Text>
            {detailedAnswers.map((d, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                  <View style={[
                    styles.reviewStatusBadge,
                    { backgroundColor: d.isCorrect ? colors.successLight : d.selectedIndex === -1 ? colors.warningLight : colors.errorLight },
                  ]}>
                    <Text style={[
                      styles.reviewStatusText,
                      { color: d.isCorrect ? colors.success : d.selectedIndex === -1 ? colors.warning : colors.error },
                    ]}>
                      {d.isCorrect ? '✓ Correct' : d.selectedIndex === -1 ? 'Skipped' : '✗ Wrong'}
                    </Text>
                  </View>
                </View>
                <QuestionCard
                  question={{
                    text: d.text,
                    textHi: d.textHi,
                    options: d.options,
                    correctIndex: d.correctIndex,
                    explanation: d.explanation,
                  }}
                  selectedAnswer={d.selectedIndex}
                  showResult
                  onSelect={() => {}}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.xl, paddingHorizontal: spacing.md,
  },
  emoji: { fontSize: 64, marginBottom: spacing.sm },
  testTitle: {
    fontSize: typography.sizes.md, color: '#B8D4FF',
    textAlign: 'center', marginBottom: spacing.md, lineHeight: 22,
  },
  gradeLabel: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, marginBottom: spacing.xs },
  percentBig: { fontSize: 72, fontWeight: typography.weights.extrabold, color: colors.white },
  scoreDetail: { fontSize: typography.sizes.md, color: '#B8D4FF', marginTop: spacing.xs },
  timeTakenBadge: {
    marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  timeTakenText: { color: colors.white, fontSize: typography.sizes.sm },
  breakdown: { flexDirection: 'row', margin: spacing.md, gap: spacing.sm },
  breakdownItem: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  breakdownNum: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text },
  breakdownLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  scoreBarSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  scoreBarBg: { height: 10, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: radius.full },
  scoreBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  scoreBarLabel: { fontSize: typography.sizes.xs, color: colors.textLight },
  actions: { paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  actionBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  reviewBtn: { borderWidth: 2, borderColor: colors.primary },
  reviewBtnText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  retestBtn: { backgroundColor: colors.accent },
  retestBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  homeBtn: { backgroundColor: colors.primary },
  homeBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  reviewSection: { padding: spacing.md, paddingTop: 0 },
  reviewTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  reviewCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  reviewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  reviewQNum: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold, color: colors.primary },
  reviewStatusBadge: { borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  reviewStatusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
});
