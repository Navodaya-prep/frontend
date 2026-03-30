import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMockTests, fetchUserAttempts } from '../../store/mockTestSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { formatTime, formatPercent, getGrade } from '../../utils/formatters';
import { AppLoader } from '../../components/common/AppLoader';

const TABS = ['Available', 'Completed'];

const SUBJECT_COLOR = {
  mental_ability: colors.primary,
  arithmetic: colors.accent,
  language: colors.success,
  full: '#6C63FF',
};

const SUBJECT_LABEL = {
  mental_ability: '🧠 Mental Ability',
  arithmetic: '➕ Arithmetic',
  language: '📝 Language',
  full: '📋 Full Test',
};

export default function MockTestListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tests, status } = useSelector((s) => s.mockTest);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const displayTests = tests;

  const availableTests = displayTests.filter((t) => !t.latestAttempt);
  const completedTests = displayTests.filter((t) => !!t.latestAttempt);
  const currentList = activeTab === 0 ? availableTests : completedTests;

  useEffect(() => {
    dispatch(fetchMockTests());
    dispatch(fetchUserAttempts());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([dispatch(fetchMockTests()), dispatch(fetchUserAttempts())]);
    setRefreshing(false);
  };

  const renderAvailableCard = (test) => {
    const subjectColor = SUBJECT_COLOR[test.subject] || colors.primary;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MockTestStart', { test })}
        activeOpacity={0.85}
      >
        <View style={[styles.cardAccent, { backgroundColor: subjectColor }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '20' }]}>
              <Text style={[styles.subjectBadgeText, { color: subjectColor }]}>
                {SUBJECT_LABEL[test.subject] || test.subject}
              </Text>
            </View>
            {test.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle}>{test.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.metaItem}>📝 {test.questionCount || '—'} Questions</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaItem}>⏱ {test.duration} mins</Text>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: subjectColor }]}
              onPress={() => navigation.navigate('MockTestStart', { test })}
            >
              <Text style={styles.startBtnText}>Start Test →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCompletedCard = (test) => {
    const attempt = test.latestAttempt;
    const percent = attempt?.percent ? Math.round(attempt.percent) : Math.round((attempt.score / attempt.totalMarks) * 100);
    const grade = getGrade(percent);
    const subjectColor = SUBJECT_COLOR[test.subject] || colors.primary;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MockTestResult', {
          test,
          result: attempt,
          fromHistory: true,
        })}
        activeOpacity={0.85}
      >
        <View style={[styles.cardAccent, { backgroundColor: grade.color }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '20' }]}>
              <Text style={[styles.subjectBadgeText, { color: subjectColor }]}>
                {SUBJECT_LABEL[test.subject] || test.subject}
              </Text>
            </View>
            <View style={[styles.gradeBadge, { backgroundColor: grade.color + '20' }]}>
              <Text style={[styles.gradeBadgeText, { color: grade.color }]}>{grade.label}</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>{test.title}</Text>

          {/* Score bar */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>
              {attempt.score}/{attempt.totalMarks}
            </Text>
            <Text style={[styles.percentText, { color: grade.color }]}>{percent}%</Text>
          </View>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${percent}%`, backgroundColor: grade.color }]} />
          </View>

          <Text style={styles.attemptDate}>
            Completed {new Date(attempt.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={() => navigation.navigate('MockTestResult', { test, result: attempt, fromHistory: true })}
            >
              <Text style={styles.reviewBtnText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retestBtn}
              onPress={() => navigation.navigate('MockTestStart', { test })}
            >
              <Text style={styles.retestBtnText}>🔄 Retest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mock Tests</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab}
              {i === 0 && availableTests.length > 0 && (
                <Text style={styles.tabCount}> ({availableTests.length})</Text>
              )}
              {i === 1 && completedTests.length > 0 && (
                <Text style={styles.tabCount}> ({completedTests.length})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {status === 'loading' && tests.length === 0 ? (
        <AppLoader />
      ) : currentList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{activeTab === 0 ? '🎉' : '📋'}</Text>
          <Text style={styles.emptyTitle}>
            {activeTab === 0 ? 'All tests completed!' : 'No completed tests yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 0
              ? 'You have completed all available tests. Check the Completed tab.'
              : 'Start a test from the Available tab to see your results here.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentList}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) =>
            activeTab === 0 ? renderAvailableCard(item) : renderCompletedCard(item)
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  back: { color: colors.white, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  headerTitle: { color: colors.white, fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flex: 1, paddingVertical: spacing.md, alignItems: 'center',
    borderBottomWidth: 3, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  tabCount: { fontSize: typography.sizes.sm, color: colors.textLight },
  list: { padding: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white, borderRadius: radius.lg,
    marginBottom: spacing.md, overflow: 'hidden',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  cardAccent: { width: 6 },
  cardBody: { flex: 1, padding: spacing.md },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  subjectBadge: { borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  subjectBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  premiumBadge: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  premiumBadgeText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.extrabold },
  gradeBadge: { borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  gradeBadgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  cardTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  metaItem: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  metaDot: { marginHorizontal: spacing.sm, color: colors.textLight },
  cardFooter: { flexDirection: 'row', gap: spacing.sm },
  startBtn: { flex: 1, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center' },
  startBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  // Completed card
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  scoreText: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  percentText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold },
  scoreBarBg: { height: 6, backgroundColor: colors.border, borderRadius: radius.full, marginBottom: spacing.sm },
  scoreBarFill: { height: '100%', borderRadius: radius.full },
  attemptDate: { fontSize: typography.sizes.xs, color: colors.textLight, marginBottom: spacing.md },
  reviewBtn: {
    flex: 1, borderWidth: 2, borderColor: colors.primary,
    borderRadius: radius.md, paddingVertical: 10, alignItems: 'center',
  },
  reviewBtnText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  retestBtn: {
    flex: 1, backgroundColor: colors.accent,
    borderRadius: radius.md, paddingVertical: 10, alignItems: 'center',
  },
  retestBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.sm },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  emptySubtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
