import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, setFilter } from '../../store/leaderboardSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';
import { getRankSuffix } from '../../utils/formatters';

const SAMPLE_LEADERBOARD = [
  { _id: '1', name: 'Priya Sharma', state: 'UP', score: 94, avatar: 'P' },
  { _id: '2', name: 'Arjun Patel', state: 'MP', score: 91, avatar: 'A' },
  { _id: '3', name: 'Sunita Yadav', state: 'Bihar', score: 88, avatar: 'S' },
  { _id: '4', name: 'Ravi Kumar', state: 'Rajasthan', score: 85, avatar: 'R' },
  { _id: '5', name: 'Meena Devi', state: 'UP', score: 82, avatar: 'M' },
  { _id: '6', name: 'Amit Singh', state: 'Punjab', score: 80, avatar: 'A' },
  { _id: '7', name: 'Pooja Gupta', state: 'Gujarat', score: 78, avatar: 'P' },
  { _id: '8', name: 'Suresh Nair', state: 'Kerala', score: 75, avatar: 'S' },
];

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const MEDAL_COLORS = { 1: colors.gold, 2: colors.silver, 3: colors.bronze };

export default function LeaderboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { entries, userRank, status } = useSelector((s) => s.leaderboard);
  const list = entries.length > 0 ? entries : SAMPLE_LEADERBOARD;

  useEffect(() => { dispatch(fetchLeaderboard()); }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Top 3 Podium */}
      {list.length >= 3 && (
        <View style={styles.podium}>
          {/* 2nd */}
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <View style={[styles.podiumAvatar, { backgroundColor: colors.silver }]}>
              <Text style={styles.podiumAvatarText}>{list[1]?.avatar}</Text>
            </View>
            <Text style={styles.podiumMedal}>🥈</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{list[1]?.name?.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{list[1]?.score}%</Text>
          </View>
          {/* 1st */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <View style={[styles.podiumAvatar, styles.podiumAvatarLarge, { backgroundColor: colors.gold }]}>
              <Text style={styles.podiumAvatarText}>{list[0]?.avatar}</Text>
            </View>
            <Text style={styles.podiumMedal}>🥇</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{list[0]?.name?.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{list[0]?.score}%</Text>
          </View>
          {/* 3rd */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <View style={[styles.podiumAvatar, { backgroundColor: colors.bronze }]}>
              <Text style={styles.podiumAvatarText}>{list[2]?.avatar}</Text>
            </View>
            <Text style={styles.podiumMedal}>🥉</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{list[2]?.name?.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{list[2]?.score}%</Text>
          </View>
        </View>
      )}

      {status === 'loading' && entries.length === 0
        ? <AppLoader />
        : <FlatList
            data={list.slice(3)}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const rank = index + 4;
              return (
                <View style={styles.row}>
                  <Text style={styles.rank}>{getRankSuffix(rank)}</Text>
                  <View style={styles.rowAvatar}>
                    <Text style={styles.rowAvatarText}>{item.avatar}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowState}>{item.state}</Text>
                  </View>
                  <Text style={styles.rowScore}>{item.score}%</Text>
                </View>
              );
            }}
          />
      }
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
  podium: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',
    backgroundColor: colors.primary, paddingBottom: spacing.xl, paddingHorizontal: spacing.md,
  },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: { marginBottom: 0 },
  podiumSecond: { marginBottom: -spacing.md },
  podiumThird: { marginBottom: -spacing.md },
  podiumAvatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs,
  },
  podiumAvatarLarge: { width: 64, height: 64, borderRadius: 32 },
  podiumAvatarText: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  podiumMedal: { fontSize: 24, marginBottom: 2 },
  podiumName: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.white, textAlign: 'center' },
  podiumScore: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold, color: colors.accent },
  list: { padding: spacing.md },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  rank: { width: 36, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.textSecondary },
  rowAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  rowAvatarText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.primary },
  rowInfo: { flex: 1 },
  rowName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text },
  rowState: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  rowScore: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.primary },
});
