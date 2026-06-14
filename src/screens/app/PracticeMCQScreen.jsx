import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { markQuestionSolved } from '../../store/practiceHubSlice';
import { practiceHubApi } from '../../api/practiceHubApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { QuestionCard } from '../../components/mcq/QuestionCard';

const DIFF_COLORS = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
};

export default function PracticeMCQScreen({ navigation, route }) {
  const {
    questions = [],
    startIndex = 0,
    chapterId,
    chapterTitle,
    reviewMode = false,
  } = route.params || {};

  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const question = questions[currentIndex];
  const total = questions.length;

  if (!question) return null;

  const selectedForCurrent = selectedAnswers[question.id];
  const isRevealed = !!revealed[question.id] || reviewMode;

  function handleSelect(optionIndex) {
    if (isRevealed) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  }

  function handleSubmit() {
    if (selectedForCurrent === undefined || isRevealed) return;
    setRevealed((prev) => ({ ...prev, [question.id]: true }));
    practiceHubApi
      .submitChapterPractice(chapterId, { [question.id]: selectedForCurrent })
      .then(() => dispatch(markQuestionSolved(question.id)))
      .catch(() => {});
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  const diffColor = DIFF_COLORS[question.difficulty] || colors.primary;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const showSubmit = !isRevealed && !reviewMode;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Progress header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.exitWrap}>
          <Text style={styles.exitBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${((currentIndex + 1) / total) * 100}%` }]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{total}</Text>
      </View>

      {/* Chapter + difficulty */}
      <View style={styles.metaRow}>
        {chapterTitle ? (
          <Text style={styles.chapterLabel} numberOfLines={1}>{chapterTitle}</Text>
        ) : null}
        {question.difficulty ? (
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '20' }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{question.difficulty}</Text>
          </View>
        ) : null}
      </View>

      {/* Scrollable question area */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <QuestionCard
          question={question}
          selectedAnswer={selectedForCurrent}
          onSelect={handleSelect}
          showResult={isRevealed}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {/* Prev */}
          <TouchableOpacity
            style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
            onPress={handlePrev}
            disabled={isFirst}
          >
            <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>← Prev</Text>
          </TouchableOpacity>

          {/* Submit — only when unanswered and not review */}
          {showSubmit && (
            <TouchableOpacity
              style={[
                styles.submitBtn,
                selectedForCurrent === undefined && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={selectedForCurrent === undefined}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          )}

          {/* Next / Done */}
          <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
            <Text style={styles.navBtnText}>{isLast ? 'Done ✓' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  exitWrap: { width: 32, alignItems: 'center' },
  exitBtn: { fontSize: 18, color: colors.textSecondary },
  progressBarWrap: {
    flex: 1, height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  counter: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.bold,
    color: colors.primary, minWidth: 40, textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  chapterLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, flex: 1 },
  diffBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  diffText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  body: { flex: 1 },
  bodyContent: { padding: spacing.md, paddingBottom: spacing.lg },
  footer: {
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  navBtn: {
    flex: 1, borderRadius: radius.md, paddingVertical: 13,
    alignItems: 'center', borderWidth: 2, borderColor: colors.primary,
  },
  navBtnDisabled: { borderColor: colors.border },
  navBtnText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  navBtnTextDisabled: { color: colors.textLight },
  submitBtn: {
    flex: 2, backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 13, alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: colors.border },
  submitBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
});
