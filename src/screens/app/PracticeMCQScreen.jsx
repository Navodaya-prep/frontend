import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnswer, setCurrentIndex, resetPractice, fetchPracticeQuestions, submitPractice } from '../../store/practiceSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';
import { QuestionCard } from '../../components/mcq/QuestionCard';
import { formatTime } from '../../utils/formatters';

// Sample questions for UI demo
const SAMPLE_QUESTIONS = [
  {
    _id: 'q1', text: 'Find the odd one out: 2, 4, 8, 16, 36',
    options: ['8', '16', '36', '4'], correctIndex: 2,
    explanation: '36 is not a power of 2. All others (2, 4, 8, 16) are powers of 2.',
  },
  {
    _id: 'q2', text: 'If BOOK is coded as CPPL, how is GOOD coded?',
    options: ['HPPE', 'IPPF', 'HPPD', 'HQQE'], correctIndex: 0,
    explanation: 'Each letter moves +1 in the alphabet. G→H, O→P, O→P, D→E = HPPE.',
  },
  {
    _id: 'q3', text: 'A train travels 120 km in 2 hours. What is its speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], correctIndex: 1,
    explanation: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/h',
  },
];

export default function PracticeMCQScreen({ navigation, route }) {
  const { chapterId } = route.params || {};
  const dispatch = useDispatch();
  const { questions: apiQuestions, selectedAnswers, currentIndex, status, submitted, result } = useSelector((s) => s.practice);
  const questions = apiQuestions.length > 0 ? apiQuestions : SAMPLE_QUESTIONS;

  useEffect(() => {
    if (chapterId) dispatch(fetchPracticeQuestions(chapterId));
    return () => dispatch(resetPractice());
  }, [chapterId]);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answered = Object.keys(selectedAnswers).length;

  const handleSubmit = () => {
    Alert.alert(
      'Submit Practice',
      `You answered ${answered}/${total} questions. Submit now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => {
          if (chapterId) {
            dispatch(submitPractice({ chapterId, answers: selectedAnswers }));
          } else {
            navigation.navigate('PracticeResult', { questions, selectedAnswers });
          }
        }},
      ]
    );
  };

  if (status === 'loading') return <AppLoader fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert('Exit Practice', 'Progress will be lost. Exit?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }}>
          <Text style={styles.exitBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${((currentIndex + 1) / total) * 100}%` }]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{total}</Text>
      </View>

      {/* Question */}
      <View style={styles.body}>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswers[currentIndex]}
          onSelect={(optionIndex) => dispatch(selectAnswer({ questionIndex: currentIndex, optionIndex }))}
        />
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => dispatch(setCurrentIndex(currentIndex - 1))}
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
              onPress={() => dispatch(setCurrentIndex(currentIndex + 1))}
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
  exitBtn: { fontSize: typography.sizes.lg, color: colors.textSecondary, marginRight: spacing.sm },
  progressBarWrap: {
    flex: 1, height: 8, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  counter: { marginLeft: spacing.sm, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary },
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
});
