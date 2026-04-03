import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterQuestions, clearQuestions } from '../../store/practiceHubSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   bg: colors.successLight, text: colors.success },
  medium: { label: 'Medium', bg: colors.warningLight,  text: '#92400e'     },
  hard:   { label: 'Hard',   bg: colors.errorLight,   text: colors.error   },
};

function DiffBadge({ difficulty }) {
  const cfg = DIFFICULTY_CONFIG[difficulty?.toLowerCase()] || DIFFICULTY_CONFIG.medium;
  return (
    <View style={[styles.diffBadge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.diffText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

export default function PracticeChapterDetailScreen({ route, navigation }) {
  const { chapter, subject } = route.params;
  const dispatch = useDispatch();
  const { questions, solvedIds, loading, error } = useSelector((s) => s.practiceHub);
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'solved'

  useEffect(() => {
    dispatch(fetchChapterQuestions(chapter.id));
    return () => dispatch(clearQuestions());
  }, [chapter.id]);

  const solvedSet = new Set(solvedIds);
  const openQuestions = questions.filter((q) => !solvedSet.has(q.id));
  const solvedQuestions = questions.filter((q) => solvedSet.has(q.id));
  const displayedQuestions = activeTab === 'open' ? openQuestions : solvedQuestions;

  function startPractice(startingQuestions) {
    if (startingQuestions.length === 0) return;
    navigation.navigate('PracticeMCQ', {
      questions: startingQuestions,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
    });
  }

  function renderQuestion({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.questionRow}
        activeOpacity={0.75}
        onPress={() => startPractice([item])}
      >
        <View style={styles.questionNumWrap}>
          <Text style={styles.questionNum}>{index + 1}</Text>
        </View>
        <Text style={styles.questionText} numberOfLines={2}>{item.text}</Text>
        <DiffBadge difficulty={item.difficulty} />
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
          <Text style={styles.subtitle}>{subject?.name}</Text>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{questions.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{openQuestions.length}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.success }]}>{solvedQuestions.length}</Text>
          <Text style={styles.statLabel}>Solved</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'open' && styles.tabActive]}
          onPress={() => setActiveTab('open')}
        >
          <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>
            Open ({openQuestions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'solved' && styles.tabActive]}
          onPress={() => setActiveTab('solved')}
        >
          <Text style={[styles.tabText, activeTab === 'solved' && styles.tabTextActive]}>
            Solved ({solvedQuestions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading && questions.length === 0 && <AppLoader />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={displayedQuestions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestion}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchChapterQuestions(chapter.id))}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>{activeTab === 'solved' ? '🏆' : '📝'}</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'solved' ? 'No solved questions yet' : 'All questions solved!'}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === 'solved'
                  ? 'Start practicing to track your progress'
                  : 'Great work! Switch to Solved tab to review'}
              </Text>
            </View>
          )
        }
      />

      {/* Practice CTA */}
      {displayedQuestions.length > 0 && (
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[styles.ctaBtn, displayedQuestions.length === 0 && styles.ctaBtnDisabled]}
            onPress={() => startPractice(displayedQuestions)}
            disabled={displayedQuestions.length === 0}
          >
            <Text style={styles.ctaBtnText}>
              {activeTab === 'open'
                ? `Practice ${openQuestions.length} Open Questions`
                : `Review ${solvedQuestions.length} Solved Questions`}
            </Text>
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
  questionRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    elevation: 1,
  },
  questionNumWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  questionNum: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.primary },
  questionText: { flex: 1, fontSize: typography.sizes.sm, color: colors.text, lineHeight: 20 },
  diffBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  diffText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
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
  ctaBtnDisabled: { backgroundColor: colors.border },
  ctaBtnText: { color: '#fff', fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
});
