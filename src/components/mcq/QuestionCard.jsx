import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionCard({ question, selectedAnswer, onSelect, showResult = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      {question.options.map((option, index) => {
        let style = styles.option;
        let textStyle = styles.optionText;
        if (showResult) {
          if (index === question.correctIndex) {
            style = [styles.option, styles.correct];
            textStyle = [styles.optionText, styles.correctText];
          } else if (index === selectedAnswer && index !== question.correctIndex) {
            style = [styles.option, styles.wrong];
            textStyle = [styles.optionText, styles.wrongText];
          }
        } else if (selectedAnswer === index) {
          style = [styles.option, styles.selected];
          textStyle = [styles.optionText, styles.selectedText];
        }
        return (
          <TouchableOpacity
            key={index}
            style={style}
            onPress={() => !showResult && onSelect(index)}
            activeOpacity={0.8}
          >
            <View style={[styles.label, selectedAnswer === index && !showResult && styles.labelSelected]}>
              <Text style={[styles.labelText, selectedAnswer === index && !showResult && styles.labelTextSelected]}>
                {OPTION_LABELS[index]}
              </Text>
            </View>
            <Text style={textStyle}>{option}</Text>
          </TouchableOpacity>
        );
      })}
      {showResult && question.explanation && (
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Explanation</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  questionText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  correct: { borderColor: colors.success, backgroundColor: colors.successLight },
  wrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  label: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  labelSelected: { backgroundColor: colors.primary },
  labelText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textSecondary },
  labelTextSelected: { color: colors.white },
  optionText: { fontSize: typography.sizes.md, color: colors.text, flex: 1 },
  selectedText: { color: colors.primary, fontWeight: typography.weights.semibold },
  correctText: { color: colors.success, fontWeight: typography.weights.semibold },
  wrongText: { color: colors.error, fontWeight: typography.weights.semibold },
  explanation: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  explanationTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary, marginBottom: 4 },
  explanationText: { fontSize: typography.sizes.sm, color: colors.text, lineHeight: 20 },
});
