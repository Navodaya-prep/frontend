import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Modal, ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoubts, postDoubt, fetchDoubtAnswers, postDoubtAnswer,
  deleteDoubt, clearSelected, resetPostStatus,
} from '../../store/doubtsSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const SUBJECTS = ['General', 'Support', 'Subject'];

const FAQS = [
  { q: 'When is the JNVST exam held?', a: 'JNVST for Class 6 is typically held in November every year. For Class 9, it is held in February. Admit cards are released 2–3 weeks before the exam.' },
  { q: 'What subjects are covered?', a: 'All three JNVST subjects are covered: Mental Ability (40 questions), Arithmetic (20 questions), and Language — Hindi/English (20 questions).' },
  { q: 'How is the mock test structured?', a: 'Our mock tests mirror the actual JNVST format: 80 questions, 2 hours, with a digital OMR sheet interface to help you practice filling circles.' },
  { q: 'Does the app work offline?', a: 'Practice questions and downloaded content are accessible offline. Video streaming requires an internet connection, though we optimise for low-bandwidth usage.' },
  { q: 'How do I delete my doubt?', a: 'Long-press on any doubt you posted to get the option to delete it.' },
  { q: 'Who answers my doubts?', a: 'Our expert teachers and admins review and answer doubts regularly. Other students can also reply to help each other.' },
];

function getSubjectColor(subject) {
  const map = {
    General: colors.textSecondary,
    Support: colors.accent,
    Subject: colors.primary,
  };
  return map[subject] || colors.primary;
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DoubtsScreen() {
  const dispatch = useDispatch();
  const { list, status, postStatus, selectedDoubt, answers, answersStatus } = useSelector((s) => s.doubts);
  const { user } = useSelector((s) => s.auth);

  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('General');
  const [faqOpen, setFaqOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [answerModal, setAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [activeDoubtId, setActiveDoubtId] = useState(null);

  useEffect(() => {
    dispatch(fetchDoubts());
  }, []);

  useEffect(() => {
    if (postStatus === 'succeeded') {
      setQuestion('');
      dispatch(resetPostStatus());
    }
  }, [postStatus]);

  const handlePostDoubt = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    dispatch(postDoubt({ subject, text: trimmed }));
  };

  const openAnswers = useCallback((doubtId) => {
    setActiveDoubtId(doubtId);
    dispatch(fetchDoubtAnswers(doubtId));
    setAnswerModal(true);
  }, [dispatch]);

  const handlePostAnswer = () => {
    const trimmed = answerText.trim();
    if (!trimmed || !activeDoubtId) return;
    dispatch(postDoubtAnswer({ id: activeDoubtId, text: trimmed }));
    setAnswerText('');
  };

  const handleDelete = (doubt) => {
    if (doubt.userId !== user?.id && doubt.userId !== user?._id) return;
    Alert.alert('Delete Doubt', 'Remove this doubt?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteDoubt(doubt.id)) },
    ]);
  };

  const closeModal = () => {
    setAnswerModal(false);
    setAnswerText('');
    dispatch(clearSelected());
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doubt Corner</Text>
        <Text style={styles.headerSub}>Ask anything, get expert answers</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={() => dispatch(fetchDoubts())}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <>
            <View style={styles.askCard}>
              <Text style={styles.askTitle}>Ask Your Doubt</Text>

              {/* Subject picker */}
              <View style={styles.subjectRow}>
                {SUBJECTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.subjectChip, subject === s && { backgroundColor: getSubjectColor(s) }]}
                    onPress={() => setSubject(s)}
                  >
                    <Text style={[styles.subjectChipText, subject === s && { color: colors.white }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.askInput}
                placeholder="Type your doubt here..."
                placeholderTextColor={colors.textLight}
                value={question}
                onChangeText={setQuestion}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.askBtn, (!question.trim() || postStatus === 'loading') && styles.askBtnDisabled]}
                disabled={!question.trim() || postStatus === 'loading'}
                onPress={handlePostDoubt}
              >
                <Text style={styles.askBtnText}>
                  {postStatus === 'loading' ? 'Posting...' : 'Post Doubt →'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FAQ Section */}
            <View style={styles.faqCard}>
              <TouchableOpacity style={styles.faqToggle} onPress={() => { setFaqOpen(!faqOpen); setOpenFaqIndex(null); }} activeOpacity={0.8}>
                <View style={styles.faqToggleLeft}>
                  <Text style={styles.faqToggleIcon}>💡</Text>
                  <View>
                    <Text style={styles.faqToggleTitle}>Quick Answers</Text>
                    <Text style={styles.faqToggleSub}>Common questions answered</Text>
                  </View>
                </View>
                <Text style={styles.faqChevron}>{faqOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {faqOpen && (
                <View style={styles.faqList}>
                  {FAQS.map((faq, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.faqItem, i === FAQS.length - 1 && { borderBottomWidth: 0 }]}
                      onPress={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.faqItemHeader}>
                        <Text style={styles.faqQ} numberOfLines={openFaqIndex === i ? undefined : 2}>{faq.q}</Text>
                        <Text style={styles.faqItemIcon}>{openFaqIndex === i ? '−' : '+'}</Text>
                      </View>
                      {openFaqIndex === i && (
                        <Text style={styles.faqA}>{faq.a}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            </>
          }
          ListEmptyComponent={
            status !== 'loading' && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyTitle}>No doubts yet</Text>
                <Text style={styles.emptySub}>Be the first to ask a question!</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.doubtCard}
              activeOpacity={0.8}
              onPress={() => openAnswers(item.id)}
              onLongPress={() => handleDelete(item)}
            >
              <View style={styles.doubtTop}>
                <View style={[styles.subjectTag, { backgroundColor: getSubjectColor(item.subject) + '20' }]}>
                  <Text style={[styles.subjectTagText, { color: getSubjectColor(item.subject) }]}>{item.subject}</Text>
                </View>
                <Text style={styles.doubtTime}>{formatTime(item.createdAt)}</Text>
              </View>
              <Text style={styles.doubtQuestion}>{item.text}</Text>
              <View style={styles.doubtFooter}>
                <Text style={styles.doubtMeta}>
                  {item.answerCount > 0
                    ? `💬 ${item.answerCount} Answer${item.answerCount > 1 ? 's' : ''}`
                    : '💬 No answers yet'}
                </Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: item.status === 'answered' ? colors.success : colors.accent }]} />
                  <Text style={styles.viewAnswers}>View Answers →</Text>
                </View>
              </View>
              <Text style={styles.doubtBy}>by {item.userName}</Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>

      {/* Answers Modal */}
      <Modal visible={answerModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Answers</Text>
          </View>

          {answersStatus === 'loading' ? (
            <AppLoader />
          ) : (
            <ScrollView contentContainerStyle={styles.answersContent}>
              {selectedDoubt && (
                <View style={styles.questionBlock}>
                  <Text style={styles.questionBlockLabel}>Question</Text>
                  <Text style={styles.questionBlockText}>{selectedDoubt.text}</Text>
                </View>
              )}
              {answers.length === 0 ? (
                <Text style={styles.noAnswers}>No answers yet. Be the first!</Text>
              ) : (
                answers.map((a) => (
                  <View key={a.id} style={[styles.answerCard, a.isAdmin && styles.answerCardAdmin]}>
                    <View style={styles.answerTop}>
                      <Text style={styles.answerAuthor}>
                        {a.isAdmin ? '👑 ' : ''}{a.userName}
                      </Text>
                      <Text style={styles.answerTime}>{formatTime(a.createdAt)}</Text>
                    </View>
                    <Text style={styles.answerText}>{a.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.answerInputRow}>
              <TextInput
                style={styles.answerInput}
                placeholder="Write an answer..."
                placeholderTextColor={colors.textLight}
                value={answerText}
                onChangeText={setAnswerText}
                multiline
              />
              <TouchableOpacity
                style={[styles.answerSendBtn, !answerText.trim() && styles.answerSendBtnDisabled]}
                disabled={!answerText.trim()}
                onPress={handlePostAnswer}
              >
                <Text style={styles.answerSendText}>→</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  headerSub: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },
  list: { padding: spacing.md, paddingBottom: 40 },
  askCard: {
    backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  askTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.sm },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.sm },
  subjectChip: {
    borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background,
  },
  subjectChipText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.textSecondary },
  askInput: {
    backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text,
    textAlignVertical: 'top', minHeight: 80, marginBottom: spacing.md,
  },
  askBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  askBtnDisabled: { opacity: 0.5 },
  askBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  faqCard: {
    backgroundColor: colors.white, borderRadius: radius.xl, marginBottom: spacing.md,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  faqToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faqToggleIcon: { fontSize: 22 },
  faqToggleTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  faqToggleSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 1 },
  faqChevron: { fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: typography.weights.bold },
  faqList: { borderTopWidth: 1, borderTopColor: colors.border },
  faqItem: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  faqItemHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  faqQ: { flex: 1, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, lineHeight: 20 },
  faqItemIcon: { fontSize: typography.sizes.lg, color: colors.primary, fontWeight: typography.weights.bold, lineHeight: 20 },
  faqA: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.xs },
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
  doubtMeta: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  viewAnswers: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: typography.weights.semibold },
  doubtBy: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },
  // Modal
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalClose: { padding: spacing.xs, marginRight: spacing.sm },
  modalCloseText: { fontSize: 18, color: colors.textSecondary },
  modalTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  answersContent: { padding: spacing.md, paddingBottom: 20 },
  questionBlock: {
    backgroundColor: colors.primaryLight + '40', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md,
    borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  questionBlockLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.primary, marginBottom: 4 },
  questionBlockText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 22 },
  noAnswers: { textAlign: 'center', color: colors.textLight, marginTop: 40, fontSize: typography.sizes.md },
  answerCard: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  answerCardAdmin: { borderLeftWidth: 3, borderLeftColor: colors.accent },
  answerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  answerAuthor: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text },
  answerTime: { fontSize: typography.sizes.xs, color: colors.textLight },
  answerText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 22 },
  answerInputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    padding: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border,
  },
  answerInput: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.sm, fontSize: typography.sizes.md, color: colors.text,
    textAlignVertical: 'top', maxHeight: 100,
  },
  answerSendBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
  },
  answerSendBtnDisabled: { backgroundColor: colors.border },
  answerSendText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
});
