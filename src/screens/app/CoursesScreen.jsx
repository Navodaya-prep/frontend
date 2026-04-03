import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/courseSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppLoader } from '../../components/common/AppLoader';

const SUBJECT_FILTERS = [
  { label: 'All', value: 'all' },
  { label: '🧠 Mental Ability', value: 'mental_ability' },
  { label: '➕ Arithmetic', value: 'arithmetic' },
  { label: '📝 Language', value: 'language' },
];

// Sample data for UI when API isn't connected
const SAMPLE_COURSES = [
  { _id: '1', title: 'Mental Ability Masterclass', subject: 'mental_ability', thumbnail: '🧠', chaptersCount: 12, videosCount: 48, isPremium: false },
  { _id: '2', title: 'Arithmetic for JNVST', subject: 'arithmetic', thumbnail: '➕', chaptersCount: 8, videosCount: 32, isPremium: false },
  { _id: '3', title: 'Language & Comprehension', subject: 'language', thumbnail: '📝', chaptersCount: 6, videosCount: 24, isPremium: true },
  { _id: '4', title: 'Previous Year Papers', subject: 'mental_ability', thumbnail: '📚', chaptersCount: 10, videosCount: 0, isPremium: true },
];

export default function CoursesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.courses);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchCourses()); }, []);

  const courses = (list.length > 0 ? list : SAMPLE_COURSES).filter(
    (c) => filter === 'all' || c.subject === filter
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersWrap}>
        <FlatList
          data={SUBJECT_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterTab, filter === item.value && styles.filterTabActive]}
              onPress={() => setFilter(item.value)}
            >
              <Text style={[styles.filterTabText, filter === item.value && styles.filterTabTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {status === 'loading' && list.length === 0
        ? <AppLoader />
        : <FlatList
            data={courses}
            keyExtractor={(item) => item.id || item._id}
            contentContainerStyle={styles.list}
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
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  filtersWrap: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  filterTab: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium },
  filterTabTextActive: { color: colors.white, fontWeight: typography.weights.bold },
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
});
