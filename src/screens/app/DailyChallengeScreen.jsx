import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
  Animated, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodayChallenge, submitChallenge, revealChallenge,
} from '../../store/dailyChallengeSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function DailyChallengeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { challenge, status, submitStatus } = useSelector((s) => s.dailyChallenge);

  const [selected, setSelected] = useState(null);
  const startTimeRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(fetchTodayChallenge());
  }, []);

  // Start timer when challenge loads and no attempt yet
  useEffect(() => {
    if (challenge && !challenge.attempt) {
      startTimeRef.current = Date.now();
    }
  }, [challenge]);

  // Pulse animation for the points badge
  useEffect(() => {
    if (challenge?.attempt?.isCorrect) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [challenge?.attempt?.isCorrect]);

  const isCompleted = challenge?.attempt?.isCorrect || challenge?.attempt?.revealed;
  const hasAttempted = !!challenge?.attempt && challenge?.attempt?.attempts > 0;

  const handleSelect = useCallback((index) => {
    if (isCompleted) return;
    setSelected(index);
  }, [isCompleted]);

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    const timeTakenMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    dispatch(submitChallenge({ selectedIndex: selected, timeTakenMs })).then((action) => {
      if (!action.payload?.isCorrect) {
        setSelected(null); // Reset selection for reattempt
      }
    });
  }, [selected, dispatch]);

  const handleReveal = useCallback(() => {
    Alert.alert(
      '⚠️ Reveal Answer?',
      'You will receive 0 points for this challenge. Are you sure you want to see the answer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Show Answer',
          style: 'destructive',
          onPress: () => dispatch(revealChallenge()),
        },
      ]
    );
  }, [dispatch]);

  // ────────── RENDER ──────────

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.safe}>
        <Header navigation={navigation} />
        <AppLoader />
      </SafeAreaView>
    );
  }

  if (status === 'failed' || !challenge) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header navigation={navigation} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>😴</Text>
          <Text style={styles.emptyTitle}>No Challenge Today</Text>
          <Text style={styles.emptySub}>Check back tomorrow for a new challenge!</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => dispatch(fetchTodayChallenge())}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header navigation={navigation} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          {isCompleted && (
            <View style={[
              styles.statusBanner,
              challenge.attempt?.isCorrect ? styles.statusCorrect : styles.statusRevealed,
            ]}>
              <Animated.View style={[styles.pointsBadge, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.pointsNum}>{challenge.attempt?.points || 0}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </Animated.View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>
                  {challenge.attempt?.isCorrect ? '🎉 Correct Answer!' : '👀 Answer Revealed'}
                </Text>
                <Text style={styles.statusSub}>
                  {challenge.attempt?.isCorrect
                    ? `Solved in ${challenge.attempt?.attempts || 1} attempt${(challenge.attempt?.attempts || 1) > 1 ? 's' : ''}`
                    : 'You chose to reveal the answer (0 points)'}
                </Text>
              </View>
            </View>
          )}

          {/* Wrong Answer Banner */}
          {hasAttempted && !isCompleted && (
            <View style={styles.wrongBanner}>
              <Text style={styles.wrongIcon}>❌</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.wrongTitle}>Wrong! Try again</Text>
                <Text style={styles.wrongSub}>
                  Attempt {challenge.attempt.attempts} · Each wrong answer reduces points by 20
                </Text>
              </View>
            </View>
          )}

          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              {challenge.subject ? (
                <View style={styles.subjectBadge}>
                  <Text style={styles.subjectBadgeText}>{challenge.subject}</Text>
                </View>
              ) : null}
              {challenge.difficulty ? (
                <View style={[styles.diffBadge, {
                  backgroundColor: challenge.difficulty === 'easy' ? colors.successLight
                    : challenge.difficulty === 'hard' ? colors.errorLight : colors.warningLight,
                }]}>
                  <Text style={[styles.diffBadgeText, {
                    color: challenge.difficulty === 'easy' ? colors.success
                      : challenge.difficulty === 'hard' ? colors.error : '#e65100',
                  }]}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.questionText}>{challenge.text}</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {challenge.options?.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectAnswer = isCompleted && i === challenge.correctIndex;
                const isWrongSelected = isCompleted && challenge.attempt?.selectedIndex === i && !challenge.attempt?.isCorrect && i !== challenge.correctIndex;
                const wasSelectedWrong = hasAttempted && !isCompleted && challenge.attempt?.selectedIndex === i;

                let optionStyle = styles.option;
                let textStyle = styles.optionText;
                let letterStyle = styles.optionLetter;
                let letterWrapStyle = styles.optionLetterWrap;

                if (isCorrectAnswer) {
                  optionStyle = [styles.option, styles.optionCorrect];
                  textStyle = [styles.optionText, { color: colors.success }];
                  letterWrapStyle = [styles.optionLetterWrap, { backgroundColor: colors.success }];
                  letterStyle = [styles.optionLetter, { color: colors.white }];
                } else if (isWrongSelected) {
                  optionStyle = [styles.option, styles.optionWrong];
                  textStyle = [styles.optionText, { color: colors.error }];
                  letterWrapStyle = [styles.optionLetterWrap, { backgroundColor: colors.error }];
                  letterStyle = [styles.optionLetter, { color: colors.white }];
                } else if (isSelected) {
                  optionStyle = [styles.option, styles.optionSelected];
                  textStyle = [styles.optionText, { color: colors.primary }];
                  letterWrapStyle = [styles.optionLetterWrap, { backgroundColor: colors.primary }];
                  letterStyle = [styles.optionLetter, { color: colors.white }];
                } else if (wasSelectedWrong) {
                  optionStyle = [styles.option, { borderColor: colors.error, opacity: 0.5 }];
                }

                return (
                  <TouchableOpacity
                    key={i}
                    style={optionStyle}
                    onPress={() => handleSelect(i)}
                    disabled={isCompleted}
                    activeOpacity={0.7}
                  >
                    <View style={letterWrapStyle}>
                      <Text style={letterStyle}>{OPTION_LETTERS[i]}</Text>
                    </View>
                    <Text style={textStyle}>{opt}</Text>
                    {isCorrectAnswer && <Text style={styles.checkMark}>✓</Text>}
                    {isWrongSelected && <Text style={styles.crossMark}>✗</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {isCompleted && challenge.explanation ? (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>💡 Explanation</Text>
                <Text style={styles.explanationText}>{challenge.explanation}</Text>
              </View>
            ) : null}
          </View>

          {/* Action Buttons */}
          {!isCompleted && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.submitBtn, selected === null && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={selected === null || submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {hasAttempted ? 'Try Again' : 'Submit Answer'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.revealBtn} onPress={handleReveal}>
                <Text style={styles.revealBtnText}>👁 Show Answer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* View Leaderboard CTA */}
          {isCompleted && (
            <TouchableOpacity
              style={styles.leaderboardCta}
              onPress={() => navigation.navigate('Leaderboard')}
              activeOpacity={0.8}
            >
              <Text style={styles.leaderboardCtaIcon}>🏆</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.leaderboardCtaTitle}>View Leaderboard</Text>
                <Text style={styles.leaderboardCtaSub}>See how you rank against others</Text>
              </View>
              <Text style={styles.leaderboardCtaArrow}>→</Text>
            </TouchableOpacity>
          )}

          {/* Scoring Info */}
          <View style={styles.scoringCard}>
            <Text style={styles.scoringTitle}>⚡ Scoring</Text>
            <View style={styles.scoringRow}>
              <Text style={styles.scoringDot}>•</Text>
              <Text style={styles.scoringText}>Base: 100 pts + up to 50 speed bonus</Text>
            </View>
            <View style={styles.scoringRow}>
              <Text style={styles.scoringDot}>•</Text>
              <Text style={styles.scoringText}>Faster you solve = more points!</Text>
            </View>
            <View style={styles.scoringRow}>
              <Text style={styles.scoringDot}>•</Text>
              <Text style={styles.scoringText}>Wrong attempt: −20 pts penalty</Text>
            </View>
            <View style={styles.scoringRow}>
              <Text style={styles.scoringDot}>•</Text>
              <Text style={styles.scoringText}>Reveal answer: 0 pts</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
    </SafeAreaView>
  );
}

// ──── Header Component ────
function Header({ navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.backBtn}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>⚡ Daily Challenge</Text>
      <View style={{ width: 60 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  backBtn: { color: colors.white, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  headerTitle: { color: colors.white, fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold },

  // Status Banners
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    margin: spacing.md, marginBottom: 0, padding: spacing.md,
    borderRadius: radius.lg,
  },
  statusCorrect: { backgroundColor: colors.successLight },
  statusRevealed: { backgroundColor: '#f0f0f0' },
  pointsBadge: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  pointsNum: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  pointsLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: -2 },
  statusTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  statusSub: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 },

  // Wrong banner
  wrongBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: spacing.md, marginBottom: 0, padding: spacing.md,
    backgroundColor: colors.errorLight, borderRadius: radius.lg,
  },
  wrongIcon: { fontSize: 24 },
  wrongTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.error },
  wrongSub: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 },

  // Question Card
  questionCard: {
    margin: spacing.md, backgroundColor: colors.white,
    borderRadius: radius.lg, padding: spacing.lg,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  questionHeader: { flexDirection: 'row', gap: 8, marginBottom: spacing.md, flexWrap: 'wrap' },
  dateBadge: {
    backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.sm,
  },
  dateBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.primary },
  subjectBadge: {
    backgroundColor: '#f0f0ff', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.sm,
  },
  subjectBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: '#5b5fc7' },
  diffBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm,
  },
  diffBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  questionText: {
    fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold,
    color: colors.text, lineHeight: 26, marginBottom: spacing.lg,
  },

  // Options
  optionsContainer: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionLetterWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
  },
  optionLetter: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textSecondary },
  optionText: { flex: 1, fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text },
  checkMark: { fontSize: 18, color: colors.success, fontWeight: typography.weights.bold },
  crossMark: { fontSize: 18, color: colors.error, fontWeight: typography.weights.bold },

  // Explanation
  explanationBox: {
    marginTop: spacing.lg, padding: spacing.md,
    backgroundColor: '#fffbeb', borderRadius: radius.md,
    borderLeftWidth: 3, borderLeftColor: colors.warning,
  },
  explanationTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: '#92400e', marginBottom: 4 },
  explanationText: { fontSize: typography.sizes.sm, color: '#78350f', lineHeight: 20 },

  // Actions
  actionRow: { paddingHorizontal: spacing.md, gap: 10 },
  submitBtn: {
    backgroundColor: colors.primary, paddingVertical: 14,
    borderRadius: radius.md, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.white, fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  revealBtn: {
    paddingVertical: 12, borderRadius: radius.md, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  revealBtnText: { color: colors.textSecondary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },

  // Leaderboard CTA
  leaderboardCta: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: spacing.md, marginTop: spacing.sm, padding: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.gold + '40',
  },
  leaderboardCtaIcon: { fontSize: 28 },
  leaderboardCtaTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  leaderboardCtaSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  leaderboardCtaArrow: { fontSize: typography.sizes.xl, color: colors.accent, fontWeight: typography.weights.bold },

  // Scoring
  scoringCard: {
    margin: spacing.md, padding: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  scoringTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 8 },
  scoringRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  scoringDot: { color: colors.textLight, fontSize: typography.sizes.sm },
  scoringText: { fontSize: typography.sizes.sm, color: colors.textSecondary },

  // Empty
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.md, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  retryBtn: {
    marginTop: spacing.lg, paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: colors.primary, borderRadius: radius.md,
  },
  retryText: { color: colors.white, fontWeight: typography.weights.bold },
});
