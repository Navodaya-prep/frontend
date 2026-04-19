import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Modal,
  ScrollView, RefreshControl, Animated, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoubts, postDoubt, updateDoubt, deleteDoubt,
  fetchDoubtAnswers, postDoubtAnswer,
  clearSelected, resetPostStatus, resetUpdateStatus,
} from '../../store/doubtsSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const SUBJECTS = ['General', 'Mental Ability', 'Arithmetic', 'Language'];

const SUBJECT_COLORS = {
  'Mental Ability': { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  Arithmetic:       { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  Language:         { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  General:          { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' },
};

function subjectStyle(subject) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.General;
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

function isOwner(doubt, user) {
  if (!doubt || !user) return false;
  return doubt.userId === (user.id || user._id);
}

// ── Subject Chips (reused in post + edit forms) ───────────────────────────────
function SubjectPicker({ value, onChange }) {
  return (
    <View style={styles.subjectRow}>
      {SUBJECTS.map((s) => {
        const sc = subjectStyle(s);
        const active = value === s;
        return (
          <TouchableOpacity
            key={s}
            style={[
              styles.subjectChip,
              active && { backgroundColor: sc.dot, borderColor: sc.dot },
            ]}
            onPress={() => onChange(s)}
            activeOpacity={0.75}
          >
            <Text style={[styles.subjectChipText, active && { color: '#fff' }]}>{s}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Answer card ───────────────────────────────────────────────────────────────
function AnswerCard({ answer }) {
  return (
    <View style={[styles.answerCard, answer.isAdmin && styles.answerCardAdmin]}>
      <View style={styles.answerTop}>
        <View style={styles.answerAuthorRow}>
          {answer.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
          <Text style={[styles.answerAuthor, answer.isAdmin && { color: '#B45309' }]}>
            {answer.userName}
          </Text>
        </View>
        <Text style={styles.answerTime}>{formatTime(answer.createdAt)}</Text>
      </View>
      <Text style={styles.answerText}>{answer.text}</Text>
    </View>
  );
}

// ── Doubt card ────────────────────────────────────────────────────────────────
function DoubtCard({ item, isOwn, onViewAnswers, onEdit, onDelete }) {
  const sc = subjectStyle(item.subject);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.doubtCard, { transform: [{ scale: scaleAnim }] }]}>
      {/* Top row: subject tag + time + owner actions */}
      <View style={styles.doubtTop}>
        <View style={[styles.subjectTag, { backgroundColor: sc.bg }]}>
          <View style={[styles.subjectDot, { backgroundColor: sc.dot }]} />
          <Text style={[styles.subjectTagText, { color: sc.text }]}>{item.subject}</Text>
        </View>
        <View style={styles.doubtTopRight}>
          <Text style={styles.doubtTime}>{formatTime(item.createdAt)}</Text>
          {isOwn && (
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onEdit}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.actionBtnEdit}>✏</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.actionBtnDelete}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Question text */}
      <Pressable
        onPress={onViewAnswers}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.doubtQuestion}>{item.text}</Text>

        {/* Footer */}
        <View style={styles.doubtFooter}>
          <View style={styles.answerCountRow}>
            <Text style={styles.answerCountText}>
              {item.answerCount > 0
                ? `💬 ${item.answerCount} Answer${item.answerCount > 1 ? 's' : ''}`
                : '💬 No answers yet'}
            </Text>
            {item.status === 'answered' && (
              <View style={styles.resolvedBadge}>
                <Text style={styles.resolvedBadgeText}>Resolved</Text>
              </View>
            )}
          </View>
          <Text style={styles.viewAnswers}>View →</Text>
        </View>
      </Pressable>

      {/* Author */}
      <Text style={styles.doubtBy}>
        {isOwn ? 'Your doubt' : `by ${item.userName}`}
      </Text>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DoubtsScreen() {
  const dispatch = useDispatch();
  const { list, status, postStatus, updateStatus, selectedDoubt, answers, answersStatus } = useSelector((s) => s.doubts);
  const { user } = useSelector((s) => s.auth);

  // Post form state
  const [postText, setPostText] = useState('');
  const [postSubject, setPostSubject] = useState('General');

  // Answers modal
  const [answerModal, setAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [activeDoubtId, setActiveDoubtId] = useState(null);

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSubject, setEditSubject] = useState('General');

  useEffect(() => {
    dispatch(fetchDoubts());
  }, []);

  // Clear post form after successful post
  useEffect(() => {
    if (postStatus === 'succeeded') {
      setPostText('');
      dispatch(resetPostStatus());
    }
  }, [postStatus]);

  // Close edit modal after successful update
  useEffect(() => {
    if (updateStatus === 'succeeded') {
      setEditModal(false);
      setEditingDoubt(null);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePostDoubt = () => {
    const trimmed = postText.trim();
    if (!trimmed) return;
    dispatch(postDoubt({ subject: postSubject, text: trimmed }));
  };

  const openAnswers = useCallback((doubtId) => {
    setActiveDoubtId(doubtId);
    dispatch(fetchDoubtAnswers(doubtId));
    setAnswerModal(true);
  }, [dispatch]);

  const closeAnswerModal = () => {
    setAnswerModal(false);
    setAnswerText('');
    dispatch(clearSelected());
  };

  const handlePostAnswer = () => {
    const trimmed = answerText.trim();
    if (!trimmed || !activeDoubtId) return;
    dispatch(postDoubtAnswer({ id: activeDoubtId, text: trimmed }));
    setAnswerText('');
  };

  const openEdit = (doubt) => {
    setEditingDoubt(doubt);
    setEditText(doubt.text);
    setEditSubject(doubt.subject);
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed || !editingDoubt) return;
    dispatch(updateDoubt({ id: editingDoubt.id, subject: editSubject, text: trimmed }));
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditingDoubt(null);
    dispatch(resetUpdateStatus());
  };

  const handleDelete = (doubt) => {
    Alert.alert(
      'Delete Doubt',
      'This will permanently remove your doubt and all answers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteDoubt(doubt.id)),
        },
      ]
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doubt Corner</Text>
        <Text style={styles.headerSub}>Ask anything · get expert answers</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={() => dispatch(fetchDoubts())}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.askCard}>
              <Text style={styles.askTitle}>Ask a Doubt</Text>
              <SubjectPicker value={postSubject} onChange={setPostSubject} />
              <TextInput
                style={styles.askInput}
                placeholder="Describe your doubt clearly..."
                placeholderTextColor={colors.textLight}
                value={postText}
                onChangeText={setPostText}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.askBtn, (!postText.trim() || postStatus === 'loading') && styles.askBtnDisabled]}
                disabled={!postText.trim() || postStatus === 'loading'}
                onPress={handlePostDoubt}
                activeOpacity={0.85}
              >
                <Text style={styles.askBtnText}>
                  {postStatus === 'loading' ? 'Posting...' : 'Post Doubt'}
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            status !== 'loading' && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyTitle}>No doubts yet</Text>
                <Text style={styles.emptySub}>Be the first to ask!</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <DoubtCard
              item={item}
              isOwn={isOwner(item, user)}
              onViewAnswers={() => openAnswers(item.id)}
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      </KeyboardAvoidingView>

      {/* ── Answers Modal ─────────────────────────────────────────────────────── */}
      <Modal
        visible={answerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAnswerModal}
      >
        <SafeAreaView style={styles.modalSafe}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeAnswerModal} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Answers</Text>
            {selectedDoubt && (
              <View style={[styles.modalSubjectTag, { backgroundColor: subjectStyle(selectedDoubt.subject).bg }]}>
                <Text style={[styles.modalSubjectText, { color: subjectStyle(selectedDoubt.subject).text }]}>
                  {selectedDoubt.subject}
                </Text>
              </View>
            )}
          </View>

          {answersStatus === 'loading' ? (
            <AppLoader />
          ) : (
            <ScrollView
              contentContainerStyle={styles.answersContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Original question */}
              {selectedDoubt && (
                <View style={styles.questionBlock}>
                  <Text style={styles.questionBlockLabel}>QUESTION</Text>
                  <Text style={styles.questionBlockText}>{selectedDoubt.text}</Text>
                </View>
              )}

              {/* Answers */}
              {answers.length === 0 ? (
                <View style={styles.noAnswersWrap}>
                  <Text style={styles.noAnswersIcon}>🤔</Text>
                  <Text style={styles.noAnswersText}>No answers yet</Text>
                  <Text style={styles.noAnswersSub}>Be the first to help!</Text>
                </View>
              ) : (
                answers.map((a) => <AnswerCard key={a.id} answer={a} />)
              )}
            </ScrollView>
          )}

          {/* Answer input */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.answerInputRow}>
              <TextInput
                style={styles.answerInput}
                placeholder="Write an answer..."
                placeholderTextColor={colors.textLight}
                value={answerText}
                onChangeText={setAnswerText}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.sendBtn, !answerText.trim() && styles.sendBtnDisabled]}
                disabled={!answerText.trim()}
                onPress={handlePostAnswer}
                activeOpacity={0.85}
              >
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      <Modal
        visible={editModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditModal}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeEditModal} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Doubt</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.editContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.editFieldLabel}>Subject</Text>
            <SubjectPicker value={editSubject} onChange={setEditSubject} />

            <Text style={[styles.editFieldLabel, { marginTop: spacing.md }]}>Your Doubt</Text>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              textAlignVertical="top"
              autoFocus
              placeholder="Describe your doubt clearly..."
              placeholderTextColor={colors.textLight}
            />
            <Text style={styles.charCount}>{editText.length} characters</Text>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                (!editText.trim() || updateStatus === 'loading') && styles.saveBtnDisabled,
              ]}
              disabled={!editText.trim() || updateStatus === 'loading'}
              onPress={handleSaveEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={closeEditModal}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: '#fff' },
  headerSub: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginTop: 2 },

  // List
  list: { padding: spacing.md, paddingBottom: 40 },

  // Ask card
  askCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  askTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  subjectChip: {
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.background,
  },
  subjectChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  askInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.sizes.md, color: colors.text,
    minHeight: 90, marginBottom: spacing.sm,
  },
  askBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  askBtnDisabled: { opacity: 0.45 },
  askBtnText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.md },

  // Doubt card
  doubtCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  doubtTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  subjectTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  subjectDot: { width: 6, height: 6, borderRadius: 3 },
  subjectTagText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  doubtTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  doubtTime: { fontSize: typography.sizes.xs, color: colors.textLight },

  // Owner action buttons
  ownerActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background,
  },
  actionBtnEdit: { fontSize: 14 },
  actionBtnDelete: { fontSize: 14 },

  doubtQuestion: {
    fontSize: typography.sizes.md, color: colors.text,
    lineHeight: 22, marginBottom: spacing.sm,
  },
  doubtFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  answerCountRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answerCountText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  resolvedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  resolvedBadgeText: { fontSize: 10, fontWeight: typography.weights.bold, color: '#15803D' },
  viewAnswers: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: typography.weights.semibold },
  doubtBy: { fontSize: typography.sizes.xs, color: colors.textLight },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },

  // Modal shared
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalCloseBtn: { padding: spacing.xs },
  modalCloseText: { fontSize: 18, color: colors.textSecondary },
  modalTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  modalSubjectTag: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  modalSubjectText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },

  // Answers modal content
  answersContent: { padding: spacing.md, paddingBottom: 20 },
  questionBlock: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4, borderLeftColor: colors.primary,
  },
  questionBlockLabel: {
    fontSize: 10, fontWeight: typography.weights.extrabold,
    color: colors.primary, letterSpacing: 0.8, marginBottom: 4,
  },
  questionBlockText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 22 },
  noAnswersWrap: { alignItems: 'center', paddingTop: 50 },
  noAnswersIcon: { fontSize: 44, marginBottom: spacing.sm },
  noAnswersText: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  noAnswersSub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },

  // Answer cards
  answerCard: {
    backgroundColor: '#fff', borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  answerCardAdmin: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1, borderColor: '#FCD34D',
  },
  answerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adminBadge: {
    backgroundColor: '#FCD34D',
    borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  adminBadgeText: { fontSize: 9, fontWeight: typography.weights.extrabold, color: '#92400E', letterSpacing: 0.5 },
  answerAuthor: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text },
  answerTime: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  answerText: { fontSize: typography.sizes.md, color: colors.text, lineHeight: 22 },

  // Answer input row
  answerInputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border,
  },
  answerInput: {
    flex: 1, backgroundColor: colors.background,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.sm, fontSize: typography.sizes.md, color: colors.text,
    textAlignVertical: 'top', maxHeight: 100, minHeight: 42,
  },
  sendBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'flex-end',
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },

  // Edit modal
  editContent: { padding: spacing.md, gap: 4 },
  editFieldLabel: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold,
    color: colors.textSecondary, marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#fff',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text,
    minHeight: 140, marginBottom: 4,
  },
  charCount: { fontSize: typography.sizes.xs, color: colors.textLight, textAlign: 'right', marginBottom: spacing.md },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center', marginBottom: spacing.sm,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  cancelBtn: {
    borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
  },
  cancelBtnText: { color: colors.textSecondary, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
});
