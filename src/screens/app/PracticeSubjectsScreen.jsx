import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects } from '../../store/practiceHubSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function PracticeSubjectsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { subjects, loading, error } = useSelector((s) => s.practiceHub);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, []);

  function renderItem({ item }) {
    const bg = item.color || colors.primary;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PracticeChapters', { subject: item })}
      >
        <View style={[styles.iconWrap, { backgroundColor: bg + '20' }]}>
          <Text style={styles.icon}>{item.icon || '📚'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
          ) : null}
          <Text style={styles.meta}>{item.chapterCount ?? 0} chapters</Text>
        </View>
        <View style={[styles.arrow, { backgroundColor: bg }]}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Practice Hub</Text>
          <Text style={styles.subtitle}>Select a subject to practice</Text>
        </View>
      </View>

      {loading && subjects.length === 0 && <AppLoader />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchSubjects())}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No subjects yet</Text>
              <Text style={styles.emptySub}>Check back soon!</Text>
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
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.primary },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  info: { flex: 1 },
  name: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  desc: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  meta: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 4 },
  arrow: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  arrowText: { color: '#fff', fontWeight: typography.weights.bold },
  error: { color: colors.error, textAlign: 'center', padding: spacing.md },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, marginTop: 4 },
});
