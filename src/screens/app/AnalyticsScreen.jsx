import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/analyticsSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

function AccuracyBar({ subject, accuracy, correct, total }) {
  const pct = Math.min(Math.max(accuracy || 0, 0), 100);
  const color = pct >= 75 ? colors.success : pct >= 50 ? colors.accent : colors.error;
  return (
    <View style={styles.barRow}>
      <Text style={styles.barSubject} numberOfLines={1}>{subject}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barPct, { color }]}>{pct.toFixed(0)}%</Text>
      <Text style={styles.barDetail}>{correct}/{total}</Text>
    </View>
  );
}

function ScoreTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <Text style={styles.noData}>No test attempts yet</Text>;
  }
  const maxPct = 100;
  const chartH = 120;
  return (
    <View style={styles.chart}>
      {data.map((item, i) => {
        const pct = item.percent || 0;
        const barH = Math.max((pct / maxPct) * chartH, 4);
        const color = pct >= 75 ? colors.success : pct >= 50 ? colors.accent : colors.error;
        return (
          <View key={i} style={styles.chartBar}>
            <Text style={styles.chartPct}>{pct.toFixed(0)}%</Text>
            <View style={[styles.chartBarFill, { height: barH, backgroundColor: color }]} />
            <Text style={styles.chartLabel} numberOfLines={1}>
              {item.testTitle ? item.testTitle.split(' ')[0] : `#${i + 1}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function AnalyticsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { subjectAccuracy, scoreTrend, weakAreas, summary, status } = useSelector((s) => s.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, []);

  if (status === 'loading' && !summary) return <AppLoader fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => dispatch(fetchAnalytics())}
            colors={[colors.primary]}
          />
        }
      >
        {/* Summary cards */}
        {summary && (
          <View style={styles.summaryRow}>
            {[
              ['Tests Done', summary.totalAttempts],
              ['Overall Accuracy', `${(summary.overallAccuracy || 0).toFixed(0)}%`],
              ['Best Score', `${(summary.bestPercent || 0).toFixed(0)}%`],
            ].map(([label, val]) => (
              <View key={label} style={styles.summaryCard}>
                <Text style={styles.summaryVal}>{val}</Text>
                <Text style={styles.summaryLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas to Improve</Text>
            <View style={styles.weakRow}>
              {weakAreas.map((area) => (
                <View key={area} style={styles.weakChip}>
                  <Text style={styles.weakChipText}>{area}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Subject-wise accuracy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject-wise Accuracy</Text>
          {subjectAccuracy.length === 0
            ? <Text style={styles.noData}>Complete mock tests to see subject breakdown</Text>
            : subjectAccuracy.map((item) => (
              <AccuracyBar
                key={item.subject}
                subject={item.subject}
                accuracy={item.accuracy}
                correct={item.correct}
                total={item.total}
              />
            ))}
        </View>

        {/* Score trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mock Test Score Trend</Text>
          <Text style={styles.sectionSub}>Last {scoreTrend.length} attempts</Text>
          <ScoreTrendChart data={scoreTrend} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.white },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: spacing.sm },
  summaryCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.xl,
    alignItems: 'center', paddingVertical: spacing.md,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  summaryVal: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.primary },
  summaryLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  section: {
    backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.md,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.sm },
  sectionSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: -4 },
  noData: { color: colors.textLight, textAlign: 'center', paddingVertical: spacing.md, fontSize: typography.sizes.sm },
  weakRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  weakChip: {
    backgroundColor: colors.errorLight, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  weakChipText: { fontSize: typography.sizes.sm, color: colors.error, fontWeight: typography.weights.semibold },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  barSubject: { width: 90, fontSize: typography.sizes.xs, color: colors.text },
  barTrack: { flex: 1, height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barPct: { width: 36, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, textAlign: 'right' },
  barDetail: { width: 36, fontSize: typography.sizes.xs, color: colors.textLight, textAlign: 'right' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 20 },
  chartBar: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  chartPct: { fontSize: 9, color: colors.textSecondary },
  chartBarFill: { width: '80%', borderRadius: 4, minHeight: 4 },
  chartLabel: { fontSize: 9, color: colors.textSecondary, textAlign: 'center' },
});
