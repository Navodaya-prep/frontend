import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function QuizPopup({ question, onSubmit, onDismiss }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(question.timerSeconds);
  const startTime = useRef(Date.now());
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100 }).start();
  }, []);

  useEffect(() => {
    if (question.isReadOnly) return;
    if (timeLeft <= 0) {
      onDismiss();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, question.isReadOnly]);

  function handleSubmit() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    onSubmit({ selectedIndex: selected, timeTaken });
  }

  const timerColor = timeLeft <= 10 ? colors.error : timeLeft <= 20 ? '#f59e0b' : colors.success;
  const progress = timeLeft / question.timerSeconds;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>
              {question.isReadOnly ? '📢 Announcement' : '❓ Quiz Question'}
            </Text>
            {!question.isReadOnly && (
              <View style={styles.timerContainer}>
                <Text style={[styles.timer, { color: timerColor }]}>{timeLeft}s</Text>
                <View style={styles.timerBar}>
                  <View style={[styles.timerFill, { width: `${progress * 100}%`, backgroundColor: timerColor }]} />
                </View>
              </View>
            )}
          </View>

          {/* Question */}
          <Text style={styles.question}>{question.text}</Text>

          {/* Options */}
          {!question.isReadOnly && question.options?.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => !submitted && setSelected(i)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionBadge, isSelected && styles.optionBadgeSelected]}>
                  <Text style={[styles.optionBadgeText, isSelected && { color: '#fff' }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Actions */}
          <View style={styles.actions}>
            {question.isReadOnly ? (
              <TouchableOpacity style={styles.btnPrimary} onPress={onDismiss}>
                <Text style={styles.btnPrimaryText}>Got it</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btnPrimary, (selected === null || submitted) && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={selected === null || submitted}
              >
                <Text style={styles.btnPrimaryText}>
                  {submitted ? 'Submitted ✓' : 'Submit Answer'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  timerContainer: { alignItems: 'flex-end', gap: 4 },
  timer: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  timerBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerFill: { height: '100%', borderRadius: 2 },
  question: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: spacing.xs,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  optionBadge: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBadgeSelected: { backgroundColor: colors.primary },
  optionBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textLight,
  },
  optionText: { fontSize: typography.sizes.sm, color: colors.text, flex: 1 },
  optionTextSelected: { color: colors.primary, fontWeight: typography.weights.semibold },
  actions: { marginTop: spacing.md },
  btnPrimary: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
});
