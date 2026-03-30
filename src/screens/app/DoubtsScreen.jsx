import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const SAMPLE_DOUBTS = [
  { id: '1', question: 'How to solve mirror image questions quickly?', subject: 'Mental Ability', answers: 3, time: '2 hours ago' },
  { id: '2', question: 'What is the trick for percentage problems?', subject: 'Arithmetic', answers: 5, time: '5 hours ago' },
  { id: '3', question: 'How to identify the correct pronoun in a sentence?', subject: 'Language', answers: 2, time: '1 day ago' },
  { id: '4', question: 'Tips for completing the test in time?', subject: 'General', answers: 8, time: '2 days ago' },
];

export default function DoubtsScreen({ navigation }) {
  const [question, setQuestion] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doubt Corner 💬</Text>
        <Text style={styles.headerSub}>Ask anything, get expert answers</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={SAMPLE_DOUBTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.askCard}>
              <Text style={styles.askTitle}>Ask Your Doubt</Text>
              <TextInput
                style={styles.askInput}
                placeholder="Type your doubt here... (e.g., How to solve train problems?)"
                placeholderTextColor={colors.textLight}
                value={question}
                onChangeText={setQuestion}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.askBtn, !question.trim() && styles.askBtnDisabled]}
                disabled={!question.trim()}
                onPress={() => setQuestion('')}
              >
                <Text style={styles.askBtnText}>Post Doubt →</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.doubtCard} activeOpacity={0.8}>
              <View style={styles.doubtTop}>
                <View style={[styles.subjectTag, { backgroundColor: getSubjectColor(item.subject) + '20' }]}>
                  <Text style={[styles.subjectTagText, { color: getSubjectColor(item.subject) }]}>{item.subject}</Text>
                </View>
                <Text style={styles.doubtTime}>{item.time}</Text>
              </View>
              <Text style={styles.doubtQuestion}>{item.question}</Text>
              <View style={styles.doubtFooter}>
                <Text style={styles.doubtAnswers}>💬 {item.answers} Answers</Text>
                <Text style={styles.viewAnswers}>View Answers →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getSubjectColor(subject) {
  const map = { 'Mental Ability': colors.primary, Arithmetic: colors.accent, Language: colors.success, General: colors.textSecondary };
  return map[subject] || colors.primary;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  headerSub: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },
  list: { padding: spacing.md },
  askCard: {
    backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  askTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.sm },
  askInput: {
    backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text,
    textAlignVertical: 'top', minHeight: 80, marginBottom: spacing.md,
  },
  askBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  askBtnDisabled: { opacity: 0.5 },
  askBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  doubtCard: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  doubtTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  subjectTag: { borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  subjectTagText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  doubtTime: { fontSize: typography.sizes.xs, color: colors.textLight },
  doubtQuestion: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 22, marginBottom: spacing.sm },
  doubtFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  doubtAnswers: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  viewAnswers: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: typography.weights.semibold },
});
