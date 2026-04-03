import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChaptersWithProgress, clearCourseData } from '../../store/recordedSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

const SUBJECT_COLORS = {
  mental_ability: colors.primary,
  arithmetic:     colors.accent,
  language:       colors.success,
  science:        '#8B5CF6',
  social_science: '#EF4444',
  gk:             '#F59E0B',
};

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const dispatch = useDispatch();
  const { chapters, totalLessons, completedCount, loading, error } = useSelector((s) => s.recorded);

  useEffect(() => {
    dispatch(fetchChaptersWithProgress(course.id));
    return () => dispatch(clearCourseData());
  }, [course.id]);

  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const subjectColor = SUBJECT_COLORS[course.subject] || colors.primary;

  function renderChapter({ item, index }) {
    const total = item.lessonCount ?? 0;
    const done = item.completedCount ?? 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const isComplete = total > 0 && done >= total;

    return (
      <TouchableOpacity
        style={[styles.chapterCard, isComplete && styles.chapterCardComplete]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ChapterLessons', { chapter: item, course })}
      >
        <View style={[styles.chapterNum, { backgroundColor: subjectColor + '20' }]}>
          <Text style={[styles.chapterNumText, { color: subjectColor }]}>{index + 1}</Text>
        </View>
        <View style={styles.chapterInfo}>
          <View style={styles.chapterTop}>
            <Text style={styles.chapterTitle} numberOfLines={2}>{item.title}</Text>
            {isComplete && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>✓</Text>
              </View>
            )}
          </View>
          {item.description ? (
            <Text style={styles.chapterDesc} numberOfLines={1}>{item.description}</Text>
          ) : null}
          <View style={styles.chapterFooter}>
            <View style={styles.progressBarWrap}>
              <View style={[styles.progressBar, {
                width: `${pct}%`,
                backgroundColor: isComplete ? colors.success : subjectColor,
              }]} />
            </View>
            <Text style={styles.progressText}>{done}/{total}</Text>
          </View>
        </View>
        <Text style={[styles.chapterArrow, { color: subjectColor }]}>›</Text>
      </TouchableOpacity>
    );
  }

  const header = (
    <>
      {/* Course banner */}
      <View style={[styles.banner, { backgroundColor: subjectColor }]}>
        <Text style={styles.bannerEmoji}>{course.thumbnail || '🎥'}</Text>
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle}>{course.title}</Text>
          <View style={styles.bannerMeta}>
            {course.classLevel ? (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>Class {course.classLevel}</Text>
              </View>
            ) : null}
            {course.isPremium ? (
              <View style={[styles.metaBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.metaBadgeText}>★ Premium</Text>
              </View>
            ) : null}
          </View>
          {course.description ? (
            <Text style={styles.bannerDesc} numberOfLines={2}>{course.description}</Text>
          ) : null}
        </View>
      </View>

      {/* Progress summary */}
      <View style={styles.progressCard}>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{chapters.length}</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{totalLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.success }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Watched</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: subjectColor }]}>{overallPct}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
        <View style={styles.overallBarWrap}>
          <View style={[styles.overallBar, { width: `${overallPct}%`, backgroundColor: subjectColor }]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Chapters</Text>
    </>
  );

  if (loading && chapters.length === 0) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {renderHeader(course, subjectColor, navigation)}
      <AppLoader />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: subjectColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{course.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchChaptersWithProgress(course.id))}
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

function renderHeader(course, color, navigation) {
  return (
    <View style={[styles.topBar]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backText, { color }]}>←</Text>
      </TouchableOpacity>
      <Text style={styles.topBarTitle} numberOfLines={1}>{course.title}</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 36, padding: spacing.xs },
  backText: { fontSize: 22 },
  topBarTitle: {
    flex: 1, textAlign: 'center',
    fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text,
  },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg,
  },
  bannerEmoji: { fontSize: 52 },
  bannerInfo: { flex: 1 },
  bannerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: '#fff' },
  bannerMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.xs },
  metaBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  metaBadgeText: { fontSize: typography.sizes.xs, color: '#fff', fontWeight: typography.weights.semibold },
  bannerDesc: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  progressCard: {
    backgroundColor: colors.white, padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  progressStats: { flexDirection: 'row', marginBottom: spacing.sm },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  overallBarWrap: {
    height: 6, backgroundColor: colors.border,
    borderRadius: radius.full, overflow: 'hidden',
  },
  overallBar: { height: '100%', borderRadius: radius.full },
  sectionTitle: {
    fontSize: typography.sizes.md, fontWeight: typography.weights.bold,
    color: colors.text, paddingHorizontal: spacing.md,
    paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  chapterCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  chapterCardComplete: { borderColor: colors.success + '60' },
  chapterNum: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  chapterNumText: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold },
  chapterInfo: { flex: 1 },
  chapterTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  chapterTitle: { flex: 1, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text },
  completeBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.xs,
  },
  completeBadgeText: { color: '#fff', fontSize: 11, fontWeight: typography.weights.bold },
  chapterDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: 6 },
  chapterFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressBarWrap: {
    flex: 1, height: 4, backgroundColor: colors.border,
    borderRadius: radius.full, overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: radius.full },
  progressText: { fontSize: typography.sizes.xs, color: colors.textSecondary, minWidth: 28, textAlign: 'right' },
  chapterArrow: { fontSize: 24, fontWeight: typography.weights.bold },
  error: { color: colors.error, textAlign: 'center', padding: spacing.md },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },
});
