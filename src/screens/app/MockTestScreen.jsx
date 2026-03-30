import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnswer, tickTimer, submitMockTest, resetMockTest } from '../../store/mockTestSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { formatTime } from '../../utils/formatters';
import { AppLoader } from '../../components/common/AppLoader';
import { QuestionCard } from '../../components/mcq/QuestionCard';

export default function MockTestScreen({ navigation }) {
  const dispatch = useDispatch();
  const { activeTest, answers, timeRemaining, status, startedAt } = useSelector((s) => s.mockTest);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  const questions = activeTest?.questions || [];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  // Start countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => dispatch(tickTimer()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeRemaining === 0 && !autoSubmittedRef.current && status === 'in-progress') {
      autoSubmittedRef.current = true;
      clearInterval(timerRef.current);
      handleSubmit(true);
    }
  }, [timeRemaining]);

  // Intercept Android back button
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => handler.remove();
  }, []);

  const confirmExit = () => {
    Alert.alert(
      'Exit Test?',
      'Your progress will be lost. Are you sure you want to exit?',
      [
        { text: 'Continue Test', style: 'cancel' },
        {
          text: 'Exit', style: 'destructive', onPress: () => {
            clearInterval(timerRef.current);
            dispatch(resetMockTest());
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSubmit = async (autoSubmit = false) => {
    const proceed = async () => {
      clearInterval(timerRef.current);
      const timeTaken = activeTest ? Math.max(0, (activeTest.duration * 60) - timeRemaining) : 0;
      // Convert answers object keys to string numbers for backend
      const stringAnswers = {};
      Object.keys(answers).forEach((k) => { stringAnswers[String(k)] = answers[k]; });

      const result = await dispatch(submitMockTest({
        testId: activeTest.id || activeTest._id,
        answers: stringAnswers,
        timeTaken,
      }));

      if (submitMockTest.fulfilled.match(result)) {
        navigation.replace('MockTestResult', {
          test: activeTest,
          result: result.payload,
          questions,
        });
      }
    };

    if (autoSubmit) {
      proceed();
      return;
    }

    Alert.alert(
      'Submit Test?',
      `Answered: ${answeredCount}/${total}\nSkipped: ${total - answeredCount}\n\nAre you sure you want to submit?`,
      [
        { text: 'Review', style: 'cancel' },
        { text: 'Submit', onPress: proceed },
      ]
    );
  };

  if (status === 'loading') return <AppLoader fullScreen />;
  if (!activeTest || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Test not loaded.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.errorLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLowTime = timeRemaining <= 300; // last 5 minutes
  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmExit}>
          <Text style={styles.exitBtn}>✕ Exit</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.testTitle} numberOfLines={1}>{activeTest.title}</Text>
          <Text style={styles.testProgress}>{answeredCount}/{total} answered</Text>
        </View>
        <View style={[styles.timerBox, isLowTime && styles.timerBoxLow]}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          {isLowTime && <Text style={styles.timerWarning}>⚠️</Text>}
        </View>
      </View>

      {/* Question Number Grid */}
      <View style={styles.qGridWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qGrid}>
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isCurrent = currentIndex === i;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.qNum,
                  isCurrent && styles.qNumCurrent,
                  isAnswered && !isCurrent && styles.qNumAnswered,
                ]}
                onPress={() => setCurrentIndex(i)}
              >
                <Text style={[
                  styles.qNumText,
                  (isCurrent || isAnswered) && styles.qNumTextActive,
                ]}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Question */}
      <ScrollView style={styles.questionArea} showsVerticalScrollIndicator={false}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionLabel}>Question {currentIndex + 1} of {total}</Text>
          {answers[currentIndex] !== undefined && (
            <View style={styles.answeredTag}>
              <Text style={styles.answeredTagText}>✓ Answered</Text>
            </View>
          )}
        </View>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentIndex]}
          onSelect={(optionIndex) =>
            dispatch(selectAnswer({ questionIndex: currentIndex, optionIndex }))
          }
        />
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        {currentIndex === total - 1 ? (
          <TouchableOpacity
            style={[styles.submitBtn, status === 'submitting' && styles.submitBtnDisabled]}
            onPress={() => handleSubmit(false)}
            disabled={status === 'submitting'}
          >
            <Text style={styles.submitBtnText}>
              {status === 'submitting' ? 'Submitting...' : 'Submit Test ✓'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => setCurrentIndex(currentIndex + 1)}
          >
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  exitBtn: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  headerCenter: { flex: 1 },
  testTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.white },
  testProgress: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },
  timerBox: {
    backgroundColor: colors.primaryDark, borderRadius: radius.md,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  timerBoxLow: { backgroundColor: colors.error },
  timerText: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold, color: colors.white },
  timerWarning: { fontSize: 12 },
  qGridWrap: {
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
    maxHeight: 56,
  },
  qGrid: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, gap: 6 },
  qNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.border,
  },
  qNumCurrent: { backgroundColor: colors.primary, borderColor: colors.primary },
  qNumAnswered: { backgroundColor: colors.success, borderColor: colors.success },
  qNumText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.textSecondary },
  qNumTextActive: { color: colors.white },
  questionArea: { flex: 1, padding: spacing.md },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  questionLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textSecondary },
  answeredTag: { backgroundColor: colors.successLight, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  answeredTagText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.success },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  navBtn: {
    flex: 1, borderWidth: 2, borderColor: colors.primary,
    borderRadius: radius.md, paddingVertical: 13, alignItems: 'center',
  },
  navBtnDisabled: { borderColor: colors.border },
  navBtnText: { color: colors.primary, fontWeight: typography.weights.bold },
  navBtnTextDisabled: { color: colors.textLight },
  nextBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center' },
  nextBtnText: { color: colors.white, fontWeight: typography.weights.bold },
  submitBtn: { flex: 1, backgroundColor: colors.success, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: colors.white, fontWeight: typography.weights.bold },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: typography.sizes.lg, color: colors.text, marginBottom: spacing.md },
  errorLink: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: typography.weights.bold },
});
