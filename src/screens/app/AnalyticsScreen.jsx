import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/analyticsSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const SUBJECT_META = {
  mental_ability: { label: 'Mental Ability', icon: '🧠' },
  arithmetic:     { label: 'Arithmetic',     icon: '➕' },
  language:       { label: 'Language',       icon: '📝' },
};

function gradeColor(pct) {
  if (pct >= 75) return colors.success;
  if (pct >= 50) return colors.accent;
  return colors.error;
}

function gradeBg(pct) {
  if (pct >= 75) return colors.successLight;
  if (pct >= 50) return '#FFF3E0';
  return colors.errorLight;
}

function gradeLabel(pct) {
  if (pct >= 80) return 'Excellent';
  if (pct >= 65) return 'Good';
  if (pct >= 50) return 'Average';
  return 'Needs Work';
}

// ── Circular progress ring (pure RN, no SVG) ─────────────────────────────────
function ProgressRing({ pct = 0, size = 120, stroke = 10 }) {
  const color = gradeColor(pct);
  const segments = 20;
  const filled = Math.round((pct / 100) * segments);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: size / 2,
        borderWidth: stroke, borderColor: colors.border,
      }} />
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: size / 2,
        borderWidth: stroke,
        borderColor: color,
        borderTopColor: filled >= 1 ? color : 'transparent',
        borderRightColor: filled >= 6 ? color : 'transparent',
        borderBottomColor: filled >= 11 ? color : 'transparent',
        borderLeftColor: filled >= 16 ? color : 'transparent',
        transform: [{ rotate: '-90deg' }],
        opacity: 0.9,
      }} />
      <Text style={{ fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color }}>
        {pct.toFixed(0)}%
      </Text>
      <Text style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>
        {gradeLabel(pct)}
      </Text>
    </View>
  );
}

// ── Subject accuracy card ─────────────────────────────────────────────────────
function SubjectCard({ subject, accuracy, correct, total }) {
  const meta = SUBJECT_META[subject] || { label: subject, icon: '📚' };
  const pct = Math.min(Math.max(accuracy || 0, 0), 100);
  const color = gradeColor(pct);
  const bg = gradeBg(pct);
  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectTop}>
        <View style={[styles.subjectIconWrap, { backgroundColor: bg }]}>
          <Text style={styles.subjectIcon}>{meta.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectName}>{meta.label}</Text>
          <Text style={styles.subjectStats}>{correct} correct out of {total}</Text>
        </View>
        <View style={[styles.subjectPctBadge, { backgroundColor: bg }]}>
          <Text style={[styles.subjectPct, { color }]}>{pct.toFixed(0)}%</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ── Score trend bars ──────────────────────────────────────────────────────────
function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>No mock tests attempted yet</Text>
        <Text style={styles.emptySub}>Complete a mock test to see your score trend</Text>
      </View>
    );
  }
  const chartH = 100;
  return (
    <View style={styles.trendWrap}>
      {data.map((item, i) => {
        const pct = item.percent || 0;
        const barH = Math.max((pct / 100) * chartH, 4);
        const color = gradeColor(pct);
        return (
          <View key={i} style={styles.trendBar}>
            <Text style={[styles.trendPct, { color }]}>{pct.toFixed(0)}%</Text>
            <View style={styles.trendBarTrack}>
              <View style={[styles.trendBarFill, { height: barH, backgroundColor: color }]} />
            </View>
            <Text style={styles.trendLabel} numberOfLines={1}>
              {item.testTitle ? item.testTitle.replace(/mock\s*test\s*/i, '').trim() || `#${i + 1}` : `#${i + 1}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AnalyticsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { subjectAccuracy, scoreTrend, weakAreas, summary, status } = useSelector((s) => s.analytics);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => { dispatch(fetchAnalytics()); }, []);

  if (status === 'loading' && !summary) return <AppLoader fullScreen />;

  const overallPct = summary?.overallAccuracy || 0;
  const bestPct = summary?.bestPercent || 0;
  const streak = user?.streak || 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => dispatch(fetchAnalytics())}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Hero card ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreeting}>Overall Accuracy</Text>
            <ProgressRing pct={overallPct} size={130} stroke={12} />
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{summary?.totalAttempts ?? 0}</Text>
              <Text style={styles.heroStatLabel}>Tests Done</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{bestPct.toFixed(0)}%</Text>
              <Text style={styles.heroStatLabel}>Best Score</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{summary?.chaptersAttempted ?? 0}</Text>
              <Text style={styles.heroStatLabel}>Chapters Practiced</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: colors.accent }]}>🔥 {streak}</Text>
              <Text style={styles.heroStatLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* ── Focus Areas ── */}
        {weakAreas.length > 0 ? (
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <Text style={styles.focusTitle}>⚠️ Focus Areas</Text>
              <Text style={styles.focusSub}>Subjects below 60% accuracy</Text>
            </View>
            <View style={styles.focusChips}>
              {weakAreas.map((area) => {
                const meta = SUBJECT_META[area] || { label: area, icon: '📚' };
                return (
                  <View key={area} style={styles.focusChip}>
                    <Text style={styles.focusChipIcon}>{meta.icon}</Text>
                    <Text style={styles.focusChipText}>{meta.label}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.focusTip}>💡 Practice more questions in these subjects to improve</Text>
          </View>
        ) : summary?.totalAttempts > 0 ? (
          <View style={[styles.focusCard, { backgroundColor: colors.successLight }]}>
            <Text style={styles.focusTitle}>🎉 Great Performance!</Text>
            <Text style={[styles.focusTip, { marginTop: 4 }]}>You're scoring above 60% in all subjects. Keep it up!</Text>
          </View>
        ) : null}

        {/* ── Subject-wise accuracy ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject-wise Accuracy</Text>
          <Text style={styles.sectionSub}>Based on your mock test answers</Text>
          {subjectAccuracy.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyText}>No data yet</Text>
              <Text style={styles.emptySub}>Attempt mock tests to see subject breakdown</Text>
            </View>
          ) : (
            subjectAccuracy.map((item) => (
              <SubjectCard
                key={item.subject}
                subject={item.subject}
                accuracy={item.accuracy}
                correct={item.correct}
                total={item.total}
              />
            ))
          )}
        </View>

        {/* ── Score trend ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mock Test Score Trend</Text>
          <Text style={styles.sectionSub}>Last {scoreTrend.length || 0} attempts</Text>
          <TrendChart data={scoreTrend} />
        </View>

        {/* ── Score legend ── */}
        <View style={styles.legendRow}>
          {[['≥75%', colors.success, 'Excellent'], ['50–74%', colors.accent, 'Average'], ['<50%', colors.error, 'Needs Work']].map(([range, color, label]) => (
            <View key={range} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{range} {label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  backBtn: { width: 36 },
  backText: { fontSize: 22, color: colors.white },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },

  // Hero card
  heroCard: {
    backgroundColor: colors.primary, borderRadius: radius.xl,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  heroLeft: { alignItems: 'center', gap: spacing.xs },
  heroGreeting: { fontSize: typography.sizes.xs, color: '#B8D4FF', marginBottom: spacing.xs },
  heroRight: { flex: 1, gap: spacing.sm },
  heroStat: { alignItems: 'flex-start' },
  heroStatNum: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  heroStatLabel: { fontSize: typography.sizes.xs, color: '#B8D4FF' },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },

  // Focus areas
  focusCard: {
    backgroundColor: '#FFF8E1', borderRadius: radius.xl, padding: spacing.md,
    borderLeftWidth: 4, borderLeftColor: colors.accent,
  },
  focusHeader: { marginBottom: spacing.sm },
  focusTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  focusSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  focusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  focusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.white, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 5,
    borderWidth: 1, borderColor: colors.accent + '60',
  },
  focusChipIcon: { fontSize: 14 },
  focusChipText: { fontSize: typography.sizes.sm, color: colors.text, fontWeight: typography.weights.semibold },
  focusTip: { fontSize: typography.sizes.xs, color: colors.textSecondary, lineHeight: 18 },

  // Section
  section: {
    backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.md,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    gap: spacing.xs,
  },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  sectionSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.xs },

  // Subject card
  subjectCard: {
    borderRadius: radius.lg, backgroundColor: colors.background,
    padding: spacing.sm, marginTop: spacing.xs,
  },
  subjectTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 8 },
  subjectIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  subjectIcon: { fontSize: 20 },
  subjectName: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text },
  subjectStats: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  subjectPctBadge: { borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  subjectPct: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold },
  barTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  // Trend chart
  trendWrap: {
    flexDirection: 'row', alignItems: 'flex-end',
    gap: 6, height: 150, paddingTop: 24, marginTop: spacing.xs,
  },
  trendBar: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  trendPct: { fontSize: 9, fontWeight: '700' },
  trendBarTrack: { width: '100%', height: 100, justifyContent: 'flex-end' },
  trendBarFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  trendLabel: { fontSize: 9, color: colors.textSecondary, textAlign: 'center', maxWidth: 40 },

  // Empty state
  emptyBox: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },

  // Legend
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: typography.sizes.xs, color: colors.textSecondary },
});
