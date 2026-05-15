import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/courseSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';

export default function CoursesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.courses);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { dispatch(fetchCourses()); }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await dispatch(fetchCourses(true));
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Recorded Classes</Text>
          <Text style={styles.headerSub}>Select a course to start</Text>
        </View>
      </View>

      {status === 'loading' && list.length === 0
        ? <AppLoader />
        : <FlatList
            data={list}
            keyExtractor={(item) => item.id || item._id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              status !== 'loading' && (
                <View style={styles.empty}>
                  <Text style={styles.emptyIcon}>📚</Text>
                  <Text style={styles.emptyTitle}>No Courses Available</Text>
                  <Text style={styles.emptySub}>Pull down to refresh or check back later</Text>
                </View>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.courseCard}
                onPress={() => navigation.navigate('CourseDetail', { course: item })}
                activeOpacity={0.8}
              >
                <View style={styles.courseThumb}>
                  <Text style={styles.courseThumbEmoji}>{item.thumbnail}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <View style={styles.courseTopRow}>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    {item.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.courseMeta}>
                    {item.chaptersCount} Chapters · {item.videosCount} Videos
                  </Text>
                  <View style={[styles.subjectTag, { backgroundColor: getSubjectColor(item.subject) + '20' }]}>
                    <Text style={[styles.subjectTagText, { color: getSubjectColor(item.subject) }]}>
                      {item.subject.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
      }
    </SafeAreaView>
  );
}

function getSubjectColor(subject) {
  const map = { mental_ability: colors.primary, arithmetic: colors.accent, language: colors.success };
  return map[subject] || colors.primary;
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
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text },
  headerSub: { fontSize: typography.sizes.xs, color: colors.textLight, marginTop: 2 },
  list: { padding: spacing.md },
  courseCard: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg,
    marginBottom: spacing.md, overflow: 'hidden', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  courseThumb: {
    width: 80, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  courseThumbEmoji: { fontSize: 32 },
  courseInfo: { flex: 1, padding: spacing.md },
  courseTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  courseTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, flex: 1, marginRight: spacing.sm },
  premiumBadge: {
    backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2,
  },
  premiumText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.extrabold },
  courseMeta: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xs },
  subjectTag: { alignSelf: 'flex-start', borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  subjectTagText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  emptySub: { fontSize: typography.sizes.sm, color: colors.textLight, textAlign: 'center', marginTop: 4 },
});
