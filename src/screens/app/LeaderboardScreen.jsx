import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChallengeLeaderboard, setLeaderboardPeriod,
} from '../../store/dailyChallengeSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';

function formatTime(ms) {
  if (!ms) return '—';
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function LeaderboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const {
    leaderboard, userRank, leaderboardPeriod, leaderboardStatus,
  } = useSelector((s) => s.dailyChallenge);

  useEffect(() => {
    dispatch(fetchChallengeLeaderboard(leaderboardPeriod));
  }, []);

  const switchPeriod = useCallback((period) => {
    dispatch(setLeaderboardPeriod(period));
    dispatch(fetchChallengeLeaderboard(period));
  }, [dispatch]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Period Toggle */}
      <View style={styles.periodWrap}>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodBtn, leaderboardPeriod === 'today' && styles.periodBtnActive]}
            onPress={() => switchPeriod('today')}
          >
            <Text style={[styles.periodText, leaderboardPeriod === 'today' && styles.periodTextActive]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodBtn, leaderboardPeriod === 'month' && styles.periodBtnActive]}
            onPress={() => switchPeriod('month')}
          >
            <Text style={[styles.periodText, leaderboardPeriod === 'month' && styles.periodTextActive]}>This Month</Text>
          </TouchableOpacity>
        </View>
      </View>

      {leaderboardStatus === 'loading' ? (
        <AppLoader />
      ) : leaderboard.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={styles.emptyTitle}>No Rankings Yet</Text>
          <Text style={styles.emptySub}>Be the first to solve today's challenge!</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => dispatch(fetchChallengeLeaderboard(leaderboardPeriod))}>
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rest}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View>
              {/* Podium — show even with 1-2 users */}
              <View style={styles.podium}>
                {/* 2nd */}
                <View style={[styles.podiumSlot, { marginTop: 24 }]}>
                  {top3[1] ? (
                    <>
                      <View style={[styles.podiumAvatar, { backgroundColor: colors.silver }]}>
                        <Text style={styles.podiumAvatarText}>{top3[1].avatar}</Text>
                      </View>
                      <Text style={styles.podiumMedal}>🥈</Text>
                      <Text style={styles.podiumName} numberOfLines={1}>{top3[1].name?.split(' ')[0]}</Text>
                      <Text style={styles.podiumPoints}>{top3[1].totalPoints} pts</Text>
                      <Text style={styles.podiumTime}>{formatTime(top3[1].fastestTime)}</Text>
                    </>
                  ) : (
                    <View style={styles.podiumEmpty}>
                      <Text style={styles.podiumEmptyText}>🥈</Text>
                    </View>
                  )}
                </View>

                {/* 1st */}
                <View style={styles.podiumSlot}>
                  {top3[0] ? (
                    <>
                      <View style={[styles.podiumAvatar, styles.podiumAvatarFirst, { backgroundColor: colors.gold }]}>
                        <Text style={[styles.podiumAvatarText, { fontSize: typography.sizes.xxl }]}>{top3[0].avatar}</Text>
                      </View>
                      <Text style={styles.podiumMedal}>🥇</Text>
                      <Text style={[styles.podiumName, { fontWeight: typography.weights.extrabold }]} numberOfLines={1}>
                        {top3[0].name?.split(' ')[0]}
                      </Text>
                      <Text style={[styles.podiumPoints, { color: colors.gold, fontSize: typography.sizes.lg }]}>
                        {top3[0].totalPoints} pts
                      </Text>
                      <Text style={styles.podiumTime}>{formatTime(top3[0].fastestTime)}</Text>
                    </>
                  ) : null}
                </View>

                {/* 3rd */}
                <View style={[styles.podiumSlot, { marginTop: 24 }]}>
                  {top3[2] ? (
                    <>
                      <View style={[styles.podiumAvatar, { backgroundColor: colors.bronze }]}>
                        <Text style={styles.podiumAvatarText}>{top3[2].avatar}</Text>
                      </View>
                      <Text style={styles.podiumMedal}>🥉</Text>
                      <Text style={styles.podiumName} numberOfLines={1}>{top3[2].name?.split(' ')[0]}</Text>
                      <Text style={styles.podiumPoints}>{top3[2].totalPoints} pts</Text>
                      <Text style={styles.podiumTime}>{formatTime(top3[2].fastestTime)}</Text>
                    </>
                  ) : (
                    <View style={styles.podiumEmpty}>
                      <Text style={styles.podiumEmptyText}>🥉</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Separator */}
              {rest.length > 0 && (
                <Text style={styles.restHeader}>Other Rankings</Text>
              )}
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{item.rank}</Text>
              </View>
              <View style={styles.rowAvatar}>
                <Text style={styles.rowAvatarText}>{item.avatar}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.state}{item.fastestTime ? ` · ${formatTime(item.fastestTime)}` : ''}
                </Text>
              </View>
              <View style={styles.rowPointsWrap}>
                <Text style={styles.rowPoints}>{item.totalPoints}</Text>
                <Text style={styles.rowPtsLabel}>pts</Text>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            userRank && userRank.rank > 10 ? (
              <View style={styles.userRankCard}>
                <Text style={styles.userRankLabel}>YOUR RANK</Text>
                <View style={styles.row}>
                  <View style={[styles.rankBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.rankText, { color: colors.primary }]}>#{userRank.rank}</Text>
                  </View>
                  <View style={[styles.rowAvatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.rowAvatarText, { color: colors.primary }]}>{userRank.avatar}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{userRank.name} (You)</Text>
                    <Text style={styles.rowMeta}>{userRank.state}</Text>
                  </View>
                  <View style={styles.rowPointsWrap}>
                    <Text style={[styles.rowPoints, { color: colors.primary }]}>{userRank.totalPoints}</Text>
                    <Text style={styles.rowPtsLabel}>pts</Text>
                  </View>
                </View>
              </View>
            ) : null
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  back: { color: colors.white, fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
  headerTitle: { color: colors.white, fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold },

  // Period toggle
  periodWrap: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.white },
  periodToggle: {
    flexDirection: 'row', backgroundColor: '#f0f0f0',
    borderRadius: radius.md, padding: 3,
  },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.sm },
  periodBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1,
  },
  periodText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.textLight },
  periodTextActive: { color: colors.primary },

  // Podium
  podium: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',
    paddingVertical: spacing.lg, paddingHorizontal: spacing.md,
    backgroundColor: colors.white, marginBottom: spacing.sm,
  },
  podiumSlot: { alignItems: 'center', flex: 1 },
  podiumAvatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs,
  },
  podiumAvatarFirst: { width: 68, height: 68, borderRadius: 34 },
  podiumAvatarText: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  podiumMedal: { fontSize: 24, marginBottom: 2 },
  podiumName: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.bold,
    color: colors.text, textAlign: 'center',
  },
  podiumPoints: {
    fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold, color: colors.accent, marginTop: 2,
  },
  podiumTime: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 1 },
  podiumEmpty: { alignItems: 'center', opacity: 0.3, paddingVertical: spacing.md },
  podiumEmptyText: { fontSize: 32 },

  // Rest header
  restHeader: {
    fontSize: typography.sizes.sm, fontWeight: typography.weights.bold,
    color: colors.textSecondary, marginBottom: spacing.sm,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // List
  listContent: { padding: spacing.md },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  rankBadge: {
    width: 36, height: 28, borderRadius: 6,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  rankText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textSecondary },
  rowAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEEEEE',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  rowAvatarText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.textSecondary },
  rowInfo: { flex: 1 },
  rowName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text },
  rowMeta: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  rowPointsWrap: { alignItems: 'flex-end' },
  rowPoints: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.accent },
  rowPtsLabel: { fontSize: typography.sizes.xs, color: colors.textLight },

  // User rank
  userRankCard: {
    marginTop: spacing.md, padding: spacing.sm, paddingTop: spacing.xs,
    backgroundColor: colors.primaryLight, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.primary + '30',
  },
  userRankLabel: {
    fontSize: typography.sizes.xs, fontWeight: typography.weights.bold,
    color: colors.primary, marginLeft: spacing.md, marginTop: spacing.sm, marginBottom: 4,
    letterSpacing: 0.5,
  },

  // Empty
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.md, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  retryBtn: {
    marginTop: spacing.lg, paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: colors.primary, borderRadius: radius.md,
  },
  retryText: { color: colors.white, fontWeight: typography.weights.bold },
});
