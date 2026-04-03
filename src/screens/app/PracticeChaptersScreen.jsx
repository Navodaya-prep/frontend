import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjectChapters, clearChapters } from '../../store/practiceHubSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

const DIFF_COLORS = { easy: colors.success, medium: colors.warning, hard: colors.error };

export default function PracticeChaptersScreen({ route, navigation }) {
  const { subject } = route.params;
  const dispatch = useDispatch();
  const { chapters, loading, error } = useSelector((s) => s.practiceHub);

  useEffect(() => {
    dispatch(fetchSubjectChapters(subject.id));
    return () => dispatch(clearChapters());
  }, [subject.id]);

  function renderItem({ item }) {
    const solved = item.solvedCount ?? 0;
    const total = item.questionCount ?? 0;
    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
    const isComplete = total > 0 && solved >= total;

    return (
      <TouchableOpacity
        style={[styles.card, isComplete && styles.cardComplete]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PracticeChapterDetail', { chapter: item, subject })}
      >
        <View style={styles.cardTop}>
          <Text style={styles.chapterTitle} numberOfLines={2}>{item.title}</Text>
          {isComplete && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>✓ Done</Text>
            </View>
          )}
        </View>

        {item.description ? (
          <Text style={styles.chapterDesc} numberOfLines={1}>{item.description}</Text>
        ) : null}

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrap}>
            <View style={[styles.progressBar, {
              width: `${pct}%`,
              backgroundColor: isComplete ? colors.success : colors.primary,
            }]} />
          </View>
          <Text style={styles.progressText}>{solved}/{total}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.metaText}>{total} questions</Text>
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>★ Premium</Text>
            </View>
          )}
          <Text style={styles.startText}>Practice →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const subjectColor = subject.color || colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: subjectColor + '40' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: subjectColor }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.subjectIcon}>{subject.icon || '📚'}</Text>
          <View>
            <Text style={styles.title}>{subject.name}</Text>
            <Text style={styles.subtitle}>{chapters.length} chapters</Text>
          </View>
        </View>
      </View>

      {loading && chapters.length === 0 && <AppLoader />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchSubjectChapters(subject.id))}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📖</Text>
              <Text style={styles.emptyTitle}>No chapters yet</Text>
              <Text style={styles.emptySub}>Content is being added soon</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 2,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  subjectIcon: { fontSize: 28 },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  cardComplete: { borderColor: colors.success + '60' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  chapterTitle: { flex: 1, fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  completeBadge: {
    backgroundColor: colors.successLight, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2, marginLeft: spacing.sm,
  },
  completeBadgeText: { fontSize: typography.sizes.xs, color: colors.success, fontWeight: typography.weights.semibold },
  chapterDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  progressBarWrap: {
    flex: 1, height: 6, backgroundColor: colors.border,
    borderRadius: radius.full, overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: radius.full },
  progressText: { fontSize: typography.sizes.xs, color: colors.textSecondary, minWidth: 36, textAlign: 'right' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaText: { fontSize: typography.sizes.xs, color: colors.textLight, flex: 1 },
  premiumBadge: {
    backgroundColor: '#fef3c7', borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  premiumText: { fontSize: typography.sizes.xs, color: '#92400e', fontWeight: typography.weights.semibold },
  startText: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: typography.weights.semibold },
  error: { color: colors.error, textAlign: 'center', padding: spacing.md },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },
});
