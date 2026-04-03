import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { markLessonComplete } from '../../store/recordedSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function LessonPlayerScreen({ route, navigation }) {
  const { lesson, chapter, course } = route.params;
  const dispatch = useDispatch();
  const { completedIds } = useSelector((s) => s.recorded);
  const [marking, setMarking] = useState(false);

  const isCompleted = completedIds.includes(lesson.id);

  async function handleMarkComplete() {
    if (isCompleted || marking) return;
    setMarking(true);
    try {
      await dispatch(markLessonComplete(lesson.id)).unwrap();
    } catch {
      Alert.alert('Error', 'Could not save progress. Try again.');
    } finally {
      setMarking(false);
    }
  }

  const isVideo = lesson.type === 'video';
  const youtubeUri = isVideo && lesson.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{lesson.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{chapter?.title} · {course?.title}</Text>
        </View>
        {isCompleted && (
          <View style={styles.watchedBadge}>
            <Text style={styles.watchedBadgeText}>✓ Watched</Text>
          </View>
        )}
      </View>

      {/* Video Player */}
      {isVideo && youtubeUri ? (
        <View style={styles.playerWrap}>
          <WebView
            source={{ uri: youtubeUri }}
            style={{ flex: 1 }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          />
        </View>
      ) : isVideo ? (
        <View style={[styles.playerWrap, styles.playerPlaceholder]}>
          <Text style={styles.placeholderText}>🎥</Text>
          <Text style={styles.placeholderSub}>No video URL configured</Text>
        </View>
      ) : null}

      {/* Lesson details + notes content */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={[styles.typeBadge,
            { backgroundColor: (lesson.type === 'video' ? colors.primary : colors.accent) + '15' }]}>
            <Text style={[styles.typeBadgeText,
              { color: lesson.type === 'video' ? colors.primary : colors.accent }]}>
              {lesson.type === 'video' ? '🎥 Video' : '📝 Note'}
            </Text>
          </View>
          {lesson.durationMins > 0 && (
            <Text style={styles.duration}>⏱ {lesson.durationMins} min</Text>
          )}
          {lesson.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>★ Premium</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {lesson.description ? (
          <>
            <Text style={styles.sectionLabel}>About this lesson</Text>
            <Text style={styles.description}>{lesson.description}</Text>
          </>
        ) : null}

        {/* Note content (for note-type lessons) */}
        {lesson.type === 'note' && lesson.noteContent ? (
          <>
            <Text style={styles.sectionLabel}>Notes</Text>
            <View style={styles.noteCard}>
              <Text style={styles.noteContent}>{lesson.noteContent}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Footer: Mark Complete / Next */}
      <View style={styles.footer}>
        {isCompleted ? (
          <View style={styles.completedRow}>
            <View style={styles.completedIndicator}>
              <Text style={styles.completedText}>✓ Lesson Completed</Text>
            </View>
            <TouchableOpacity
              style={styles.backToCourseBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backToCourseBtnText}>← Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.markBtn, marking && styles.markBtnDisabled]}
            onPress={handleMarkComplete}
            disabled={marking}
          >
            <Text style={styles.markBtnText}>
              {marking ? 'Saving…' : '✓ Mark as Watched'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.primary },
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  watchedBadge: {
    backgroundColor: colors.successLight, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3, flexShrink: 0,
  },
  watchedBadgeText: { fontSize: typography.sizes.xs, color: colors.success, fontWeight: typography.weights.semibold },
  playerWrap: { height: 220, backgroundColor: '#000' },
  playerPlaceholder: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
  placeholderText: { fontSize: 48, marginBottom: spacing.sm },
  placeholderSub: { fontSize: typography.sizes.sm, color: '#888' },
  body: { flex: 1 },
  bodyContent: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  typeBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  typeBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  duration: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  premiumBadge: {
    backgroundColor: '#fef3c7', borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  premiumText: { fontSize: typography.sizes.xs, color: '#92400e', fontWeight: typography.weights.semibold },
  sectionLabel: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.bold,
    color: colors.text, marginBottom: spacing.xs,
  },
  description: { fontSize: typography.sizes.sm, color: colors.textSecondary, lineHeight: 22 },
  noteCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.accent,
    elevation: 1,
  },
  noteContent: { fontSize: typography.sizes.sm, color: colors.text, lineHeight: 24 },
  footer: {
    backgroundColor: colors.white, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  markBtn: {
    backgroundColor: colors.success, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  markBtnDisabled: { backgroundColor: colors.border },
  markBtnText: { color: '#fff', fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  completedIndicator: {
    flex: 1, backgroundColor: colors.successLight, borderRadius: radius.lg,
    paddingVertical: 12, alignItems: 'center',
  },
  completedText: { color: colors.success, fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  backToCourseBtn: {
    backgroundColor: colors.primaryLight, borderRadius: radius.lg,
    paddingVertical: 12, paddingHorizontal: spacing.md, alignItems: 'center',
  },
  backToCourseBtnText: { color: colors.primary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
});
