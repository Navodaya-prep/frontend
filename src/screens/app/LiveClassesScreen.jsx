import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveLiveClasses } from '../../store/liveClassSlice';
import { AppLoader } from '../../components/common/AppLoader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function LiveClassesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((s) => s.liveClass);

  useEffect(() => {
    dispatch(fetchActiveLiveClasses());
  }, []);

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('LiveClass', { classData: item })}
      >
        <View style={styles.cardTop}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>LIVE</Text>
          {item.isPremium && <View style={styles.premiumBadge}><Text style={styles.premiumText}>★ Premium</Text></View>}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.subject} · Class {item.classLevel}</Text>
        <Text style={styles.teacher}>👨‍🏫 {item.teacherName}</Text>
        {item.description ? <Text style={styles.desc} numberOfLines={2}>{item.description}</Text> : null}
        <View style={styles.footer}>
          <Text style={styles.duration}>⏱ {item.duration} min</Text>
          <View style={styles.joinBtn}><Text style={styles.joinText}>Join Now →</Text></View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Classes</Text>
      </View>

      {loading && classes.length === 0 && <AppLoader />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchActiveLiveClasses())}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📡</Text>
              <Text style={styles.emptyTitle}>No Live Classes Right Now</Text>
              <Text style={styles.emptySubtitle}>Check back soon or enable notifications to be alerted when a class starts.</Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text },
  list: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  liveLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.error, letterSpacing: 1 },
  premiumBadge: { marginLeft: 'auto', backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  premiumText: { fontSize: typography.sizes.xs, color: '#92400e', fontWeight: typography.weights.semibold },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: 4 },
  meta: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: typography.weights.medium, marginBottom: 4 },
  teacher: { fontSize: typography.sizes.sm, color: colors.textLight, marginBottom: spacing.xs },
  desc: { fontSize: typography.sizes.sm, color: colors.textLight, lineHeight: 20, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  duration: { fontSize: typography.sizes.sm, color: colors.textLight },
  joinBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.md },
  joinText: { color: '#fff', fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  empty: { flex: 1, alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.xs },
  emptySubtitle: { fontSize: typography.sizes.sm, color: colors.textLight, textAlign: 'center', lineHeight: 22 },
  error: { color: colors.error, textAlign: 'center', padding: spacing.md },
});
