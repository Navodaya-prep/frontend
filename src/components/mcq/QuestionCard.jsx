import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { API_BASE_URL } from '../../config';

const API_BASE = API_BASE_URL.replace('/api', '');
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function getFullImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

export function QuestionCard({ question, selectedAnswer, onSelect, showResult = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      {question.imageUrl ? (
        <Image
          source={{ uri: getFullImageUrl(question.imageUrl) }}
          style={styles.questionImage}
          resizeMode="contain"
        />
      ) : null}
      {question.options.map((option, index) => {
        // Support both legacy string options and new {type, value} options
        const optType = typeof option === 'string' ? 'text' : (option.type || 'text');
        const optValue = typeof option === 'string' ? option : (option.value || '');

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
            {optType === 'image' ? (
              <Image
                source={{ uri: getFullImageUrl(optValue) }}
                style={styles.optionImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={textStyle}>{optValue}</Text>
            )}
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
    marginBottom: spacing.md,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.border,
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
  optionImage: {
    width: 140,
    height: 80,
    borderRadius: radius.sm,
    flex: 1,
  },
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
