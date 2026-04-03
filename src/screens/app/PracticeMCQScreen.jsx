import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAnswer, clearSession, submitChapterPractice,
} from '../../store/practiceHubSlice';
import {
  fetchPracticeQuestions, selectAnswer as legacySelectAnswer,
  setCurrentIndex as legacySetIndex, resetPractice,
} from '../../store/practiceSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';
import { QuestionCard } from '../../components/mcq/QuestionCard';

const DIFF_COLORS = {
  easy: colors.success, medium: colors.warning, hard: colors.error,
};

// ─────────────────────────────────────────────────────────────────────────────
// PracticeMCQScreen
//
// Route params:
//   NEW  (from PracticeChapterDetail): { questions, chapterId, chapterTitle }
//   OLD  (from Dashboard / legacy):    { chapterId }
// ─────────────────────────────────────────────────────────────────────────────
export default function PracticeMCQScreen({ navigation, route }) {
  const { questions: paramQuestions, chapterId, chapterTitle } = route.params || {};
  const dispatch = useDispatch();

  // ── New-flow state (questions passed from ChapterDetail) ───────────────────
  const hub = useSelector((s) => s.practiceHub);
  const [hubIndex, setHubIndex] = useState(0);
  const isNewFlow = Array.isArray(paramQuestions);

  // ── Legacy-flow state (questions fetched from API) ─────────────────────────
  const { questions: apiQuestions, selectedAnswers: legacyAnswers,
          currentIndex: legacyIndex, status, submitted: legacySubmitted, result: legacyResult,
  } = useSelector((s) => s.practice);

  useEffect(() => {
    if (!isNewFlow && chapterId) {
      dispatch(fetchPracticeQuestions(chapterId));
    }
    return () => {
      if (isNewFlow) dispatch(clearSession());
      else dispatch(resetPractice());
    };
  }, [chapterId]);

  // ─────────────────────────────────────────────────────────────────────────
  // Unified accessors
  // ─────────────────────────────────────────────────────────────────────────
  const questions = isNewFlow ? paramQuestions : apiQuestions;
  const currentIndex = isNewFlow ? hubIndex : legacyIndex;
  const setCurrentIndex = isNewFlow
    ? setHubIndex
    : (i) => dispatch(legacySetIndex(i));
  const selectedAnswers = isNewFlow ? hub.selectedAnswers : legacyAnswers;
  const result = isNewFlow ? hub.result : legacyResult;
  const submitted = isNewFlow ? !!hub.result : legacySubmitted;

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────
  function handleSelect(optionIndex) {
    if (submitted) return;
    if (isNewFlow) {
      dispatch(selectAnswer({ questionId: currentQuestion.id, selectedIndex: optionIndex }));
    } else {
      dispatch(legacySelectAnswer({ questionIndex: currentIndex, optionIndex }));
    }
  }

  function handleSubmit() {
    Alert.alert(
      'Submit Practice',
      `You answered ${answeredCount}/${total} questions. Submit now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit', onPress: () => {
            if (isNewFlow && chapterId) {
              // Build answers map { questionId: selectedIndex }
              dispatch(submitChapterPractice({ chapterId, answers: hub.selectedAnswers }));
            }
            // Legacy: result is shown inline via QuestionCard after submit
          },
        },
      ]
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Result screen (shown after new-flow submit)
  // ─────────────────────────────────────────────────────────────────────────
  if (submitted && isNewFlow && result) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.exitWrap}>
            <Text style={styles.exitBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Result</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          {/* Score card */}
          <View style={[styles.scoreCard, {
            backgroundColor: result.percent >= 70 ? colors.successLight : colors.errorLight,
          }]}>
            <Text style={[styles.scorePercent, {
              color: result.percent >= 70 ? colors.success : colors.error,
            }]}>{result.percent}%</Text>
            <Text style={styles.scoreDetail}>
              {result.correct} / {result.total} correct
            </Text>
          </View>

          {/* Detailed answers */}
          {result.detailed?.map((item, i) => (
            <View key={item.questionId} style={[
              styles.resultItem,
              { borderLeftColor: item.isCorrect ? colors.success : colors.error },
            ]}>
              <View style={styles.resultItemTop}>
                <Text style={styles.resultQNum}>Q{i + 1}</Text>
                <View style={[
                  styles.resultBadge,
                  { backgroundColor: item.isCorrect ? colors.successLight : colors.errorLight },
                ]}>
                  <Text style={{ color: item.isCorrect ? colors.success : colors.error, fontSize: 12, fontWeight: '600' }}>
                    {item.isCorrect ? '✓ Correct' : '✗ Wrong'}
                  </Text>
                </View>
                <View style={[styles.diffBadge, { backgroundColor: (DIFF_COLORS[item.difficulty] || colors.primary) + '20' }]}>
                  <Text style={[styles.diffText, { color: DIFF_COLORS[item.difficulty] || colors.primary }]}>
                    {item.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.resultQText}>{item.text}</Text>
              {!item.isCorrect && item.explanation ? (
                <Text style={styles.explanation}>💡 {item.explanation}</Text>
              ) : null}
            </View>
          ))}

          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Done →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Loading state (legacy fetch)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isNewFlow && status === 'loading') return <AppLoader fullScreen />;

  if (!currentQuestion) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // Quiz view
  // ─────────────────────────────────────────────────────────────────────────
  const selectedForCurrent = isNewFlow
    ? hub.selectedAnswers[currentQuestion?.id]
    : legacyAnswers[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert('Exit Practice', 'Progress will be lost. Exit?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }} style={styles.exitWrap}>
          <Text style={styles.exitBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${((currentIndex + 1) / total) * 100}%` }]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{total}</Text>
      </View>

      {/* Chapter + difficulty */}
      {(chapterTitle || currentQuestion?.difficulty) ? (
        <View style={styles.metaRow}>
          {chapterTitle ? <Text style={styles.chapterLabel} numberOfLines={1}>{chapterTitle}</Text> : null}
          {currentQuestion?.difficulty ? (
            <View style={[styles.diffBadge, {
              backgroundColor: (DIFF_COLORS[currentQuestion.difficulty] || colors.primary) + '20',
            }]}>
              <Text style={[styles.diffText, { color: DIFF_COLORS[currentQuestion.difficulty] || colors.primary }]}>
                {currentQuestion.difficulty}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Question */}
      <View style={styles.body}>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedForCurrent}
          onSelect={handleSelect}
        />
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </TouchableOpacity>

        {currentIndex === total - 1
          ? <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit →</Text>
            </TouchableOpacity>
          : <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setCurrentIndex(currentIndex + 1)}
            >
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  exitWrap: { width: 36 },
  exitBtn: { fontSize: typography.sizes.lg, color: colors.textSecondary },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  progressBarWrap: {
    flex: 1, height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  counter: { marginLeft: spacing.sm, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary, minWidth: 36, textAlign: 'right' },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  chapterLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, flex: 1 },
  diffBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  diffText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  body: { flex: 1, padding: spacing.md },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  navBtn: {
    borderWidth: 2, borderColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 12, paddingHorizontal: spacing.lg,
  },
  navBtnDisabled: { borderColor: colors.border },
  navBtnText: { color: colors.primary, fontWeight: typography.weights.bold },
  nextBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 12, paddingHorizontal: spacing.lg,
  },
  nextBtnText: { color: colors.white, fontWeight: typography.weights.bold },
  submitBtn: {
    backgroundColor: colors.success, borderRadius: radius.md,
    paddingVertical: 12, paddingHorizontal: spacing.lg,
  },
  submitBtnText: { color: colors.white, fontWeight: typography.weights.bold },
  // Result styles
  resultScroll: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  scoreCard: {
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  scorePercent: { fontSize: typography.sizes.hero, fontWeight: typography.weights.extrabold },
  scoreDetail: { fontSize: typography.sizes.md, color: colors.text, marginTop: spacing.xs },
  resultItem: {
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 4,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  resultItemTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  resultQNum: { fontSize: typography.sizes.xs, color: colors.textLight, fontWeight: typography.weights.semibold },
  resultBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  resultQText: { fontSize: typography.sizes.sm, color: colors.text, lineHeight: 20 },
  explanation: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18, fontStyle: 'italic' },
  doneBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  doneBtnText: { color: '#fff', fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
});
