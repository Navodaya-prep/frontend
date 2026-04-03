import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterLessons, clearChapterData } from '../../store/recordedSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

const TYPE_CONFIG = {
  video: { icon: '🎥', label: 'Video', color: colors.primary },
  note:  { icon: '📝', label: 'Note',  color: colors.accent  },
};

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.video;
  return (
    <View style={[styles.typeBadge, { backgroundColor: cfg.color + '15' }]}>
      <Text style={styles.typeBadgeIcon}>{cfg.icon}</Text>
      <Text style={[styles.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

export default function ChapterLessonsScreen({ route, navigation }) {
  const { chapter, course } = route.params;
  const dispatch = useDispatch();
  const { lessons, completedIds, loading, error } = useSelector((s) => s.recorded);
  const [activeTab, setActiveTab] = useState('unwatched');

  useEffect(() => {
    dispatch(fetchChapterLessons(chapter.id));
    return () => dispatch(clearChapterData());
  }, [chapter.id]);

  const completedSet = new Set(completedIds);
  const unwatched = lessons.filter((l) => !completedSet.has(l.id));
  const watched   = lessons.filter((l) => completedSet.has(l.id));
  const displayed = activeTab === 'unwatched' ? unwatched : watched;

  function openLesson(lesson) {
    navigation.navigate('LessonPlayer', { lesson, chapter, course });
  }

  function renderLesson({ item, index }) {
    const isWatched = completedSet.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.lessonRow, isWatched && styles.lessonRowWatched]}
        activeOpacity={0.75}
        onPress={() => openLesson(item)}
      >
        {/* Left: index or check */}
        <View style={[styles.lessonIndex, isWatched && styles.lessonIndexDone]}>
          {isWatched
            ? <Text style={styles.lessonIndexDoneText}>✓</Text>
            : <Text style={styles.lessonIndexText}>{index + 1}</Text>
          }
        </View>

        {/* Content */}
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.lessonMeta}>
            <TypeBadge type={item.type} />
            {item.durationMins > 0 && (
              <Text style={styles.duration}>⏱ {item.durationMins} min</Text>
            )}
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>★ Pro</Text>
              </View>
            )}
          </View>
          {item.description ? (
            <Text style={styles.lessonDesc} numberOfLines={1}>{item.description}</Text>
          ) : null}
        </View>

        <Text style={styles.lessonArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{chapter.title}</Text>
          <Text style={styles.subtitle}>{course?.title}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{lessons.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{unwatched.length}</Text>
          <Text style={styles.statLabel}>Unwatched</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.success }]}>{watched.length}</Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unwatched' && styles.tabActive]}
          onPress={() => setActiveTab('unwatched')}
        >
          <Text style={[styles.tabText, activeTab === 'unwatched' && styles.tabTextActive]}>
            Unwatched ({unwatched.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'watched' && styles.tabActive]}
          onPress={() => setActiveTab('watched')}
        >
          <Text style={[styles.tabText, activeTab === 'watched' && styles.tabTextActive]}>
            Watched ({watched.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading && lessons.length === 0 && <AppLoader />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchChapterLessons(chapter.id))}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>{activeTab === 'watched' ? '🏆' : '▶️'}</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'watched' ? 'Nothing watched yet' : 'All lessons watched!'}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === 'watched'
                  ? 'Start watching to track your progress'
                  : 'Switch to Watched to review completed lessons'}
              </Text>
            </View>
          )
        }
      />

      {/* Start CTA */}
      {displayed.length > 0 && activeTab === 'unwatched' && (
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => openLesson(unwatched[0])}
          >
            <Text style={styles.ctaBtnText}>▶ Continue Watching</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.primary },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  statsBar: {
    flexDirection: 'row', backgroundColor: colors.white,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flex: 1, paddingVertical: spacing.sm + 2,
    alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: 100 },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    elevation: 1,
  },
  lessonRowWatched: { borderColor: colors.success + '40', backgroundColor: colors.successLight + '30' },
  lessonIndex: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  lessonIndexDone: { backgroundColor: colors.success },
  lessonIndexText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary },
  lessonIndexDoneText: { fontSize: 16, color: '#fff', fontWeight: typography.weights.bold },
  lessonContent: { flex: 1 },
  lessonTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 6 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  typeBadgeIcon: { fontSize: 11 },
  typeBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  duration: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  premiumBadge: {
    backgroundColor: '#fef3c7', borderRadius: radius.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  premiumText: { fontSize: typography.sizes.xs, color: '#92400e', fontWeight: typography.weights.semibold },
  lessonDesc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4 },
  lessonArrow: { fontSize: 22, color: colors.textLight },
  error: { color: colors.error, textAlign: 'center', padding: spacing.md },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, textAlign: 'center', marginTop: 4, lineHeight: 20 },
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.md, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  ctaBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
});
