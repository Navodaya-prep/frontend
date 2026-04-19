import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { resetMockTest } from '../../store/mockTestSlice';
import { mockTestApi } from '../../api/mockTestApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { formatTime, getGrade } from '../../utils/formatters';
import { QuestionCard } from '../../components/mcq/QuestionCard';

export default function MockTestResultScreen({ navigation, route }) {
  const { test, result, fromHistory = false } = route.params || {};
  const dispatch = useDispatch();
  const [reviewMode, setReviewMode] = useState(false);
  const [fullResult, setFullResult] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // When reviewing from history, latestAttempt has no `detailed` — fetch it
  useEffect(() => {
    if (fromHistory && result?._id && !result?.detailed?.length) {
      setLoadingDetails(true);
      mockTestApi.getAttemptDetails(result._id)
        .then((res) => setFullResult(res.data.result))
        .catch(() => Alert.alert('Error', 'Could not load answer details.'))
        .finally(() => setLoadingDetails(false));
    }
  }, []);

  const activeResult = fullResult || result;

  const correct = activeResult?.correct ?? 0;
  const wrong = activeResult?.wrong ?? 0;
  const total = activeResult?.totalMarks ?? 0;
  const skipped = activeResult?.skipped ?? Math.max(0, total - correct - wrong);
  const percent = activeResult?.percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0);
  const timeTaken = activeResult?.timeTaken ?? 0;
  const grade = getGrade(percent);
  const detailedAnswers = activeResult?.detailed || [];

  const handleGoHome = () => {
    dispatch(resetMockTest());
    navigation.navigate('Dashboard');
  };

  const handleRetest = () => {
    dispatch(resetMockTest());
    navigation.navigate('MockTestStart', { test });
  };

  const handleDownloadPDF = async () => {
    if (!detailedAnswers.length) return;
    setGeneratingPdf(true);
    try {
      const html = buildPdfHtml({ test, activeResult, detailedAnswers, grade, percent, correct, wrong, skipped, timeTaken });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      } else {
        Alert.alert('Saved', `PDF saved to: ${uri}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not generate PDF. ' + e.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Result Hero */}
        <View style={styles.hero}>
          <Text style={styles.emoji}>
            {percent >= 80 ? '🏆' : percent >= 60 ? '⭐' : percent >= 40 ? '💪' : '📖'}
          </Text>
          <Text style={styles.testTitle} numberOfLines={2}>{test?.title}</Text>
          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.percentBig}>{percent}%</Text>
          <Text style={styles.scoreDetail}>{correct} correct out of {total}</Text>
          {timeTaken > 0 && (
            <View style={styles.timeTakenBadge}>
              <Text style={styles.timeTakenText}>⏱ Time taken: {formatTime(timeTaken)}</Text>
            </View>
          )}
        </View>

        {/* Score Breakdown */}
        <View style={styles.breakdown}>
          <View style={[styles.breakdownItem, { backgroundColor: colors.successLight }]}>
            <Text style={styles.breakdownNum}>{correct}</Text>
            <Text style={styles.breakdownLabel}>✅ Correct</Text>
          </View>
          <View style={[styles.breakdownItem, { backgroundColor: colors.errorLight }]}>
            <Text style={styles.breakdownNum}>{wrong}</Text>
            <Text style={styles.breakdownLabel}>❌ Wrong</Text>
          </View>
          <View style={[styles.breakdownItem, { backgroundColor: colors.warningLight }]}>
            <Text style={styles.breakdownNum}>{skipped}</Text>
            <Text style={styles.breakdownLabel}>⏭ Skipped</Text>
          </View>
        </View>

        {/* Score Bar */}
        <View style={styles.scoreBarSection}>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${percent}%`, backgroundColor: grade.color }]} />
          </View>
          <View style={styles.scoreBarLabels}>
            <Text style={styles.scoreBarLabel}>0%</Text>
            <Text style={[styles.scoreBarLabel, { color: grade.color, fontWeight: typography.weights.bold }]}>
              {percent}%
            </Text>
            <Text style={styles.scoreBarLabel}>100%</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {loadingDetails ? (
            <View style={[styles.actionBtn, styles.reviewBtn, { flexDirection: 'row', gap: 8 }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.reviewBtnText}>Loading answers...</Text>
            </View>
          ) : detailedAnswers.length > 0 ? (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, styles.reviewBtn]}
                onPress={() => setReviewMode(!reviewMode)}
              >
                <Text style={styles.reviewBtnText}>
                  {reviewMode ? '▲ Hide Review' : '🔍 Review Answers'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.pdfBtn, generatingPdf && styles.btnDisabled]}
                onPress={handleDownloadPDF}
                disabled={generatingPdf}
              >
                <Text style={styles.pdfBtnText}>
                  {generatingPdf ? '⏳ Generating PDF...' : '📄 Download PDF'}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {!fromHistory && (
            <TouchableOpacity style={[styles.actionBtn, styles.retestBtn]} onPress={handleRetest}>
              <Text style={styles.retestBtnText}>🔄 Retest</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.homeBtn]} onPress={handleGoHome}>
            <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Answer Review Section */}
        {reviewMode && detailedAnswers.length > 0 && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Answer Review</Text>
            {detailedAnswers.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.reviewCard,
                  d.isCorrect ? styles.reviewCardCorrect : d.selectedIndex === -1 ? styles.reviewCardSkipped : styles.reviewCardWrong,
                ]}
              >
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                  <View style={[
                    styles.reviewStatusBadge,
                    { backgroundColor: d.isCorrect ? colors.successLight : d.selectedIndex === -1 ? colors.warningLight : colors.errorLight },
                  ]}>
                    <Text style={[
                      styles.reviewStatusText,
                      { color: d.isCorrect ? colors.success : d.selectedIndex === -1 ? colors.warning : colors.error },
                    ]}>
                      {d.isCorrect ? '✓ Correct' : d.selectedIndex === -1 ? 'Skipped' : '✗ Wrong'}
                    </Text>
                  </View>
                </View>
                <QuestionCard
                  question={{
                    text: d.text,
                    imageUrl: d.imageUrl,
                    options: d.options,
                    correctIndex: d.correctIndex,
                    explanation: d.explanation,
                  }}
                  selectedAnswer={d.selectedIndex}
                  showResult
                  onSelect={() => {}}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── PDF HTML builder ────────────────────────────────────────────────────────────
function buildPdfHtml({ test, activeResult, detailedAnswers, grade, percent, correct, wrong, skipped, timeTaken }) {
  const completedAt = activeResult?.completedAt
    ? new Date(activeResult.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const LABELS = ['A', 'B', 'C', 'D'];

  const questionsHtml = detailedAnswers.map((d, i) => {
    const statusColor = d.isCorrect ? '#16a34a' : d.selectedIndex === -1 ? '#d97706' : '#dc2626';
    const statusText = d.isCorrect ? '✓ Correct' : d.selectedIndex === -1 ? 'Skipped' : '✗ Wrong';

    const optionsHtml = (d.options || []).map((opt, idx) => {
      const val = typeof opt === 'string' ? opt : (opt.value || '');
      const isCorrect = idx === d.correctIndex;
      const isSelected = idx === d.selectedIndex;
      const isWrong = isSelected && !isCorrect;

      let bg = '#f9fafb';
      let border = '#e5e7eb';
      let color = '#374151';
      if (isCorrect) { bg = '#dcfce7'; border = '#16a34a'; color = '#166534'; }
      else if (isWrong) { bg = '#fee2e2'; border = '#dc2626'; color = '#991b1b'; }

      return `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:6px;
                    background:${bg};border:2px solid ${border};border-radius:8px;">
          <span style="min-width:28px;height:28px;border-radius:50%;background:${border};color:${isCorrect||isWrong?'#fff':'#6b7280'};
                       display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">
            ${LABELS[idx] || idx + 1}
          </span>
          <span style="color:${color};font-size:14px;">${val}</span>
          ${isCorrect ? '<span style="margin-left:auto;color:#16a34a;font-weight:700;">✓</span>' : ''}
          ${isWrong ? '<span style="margin-left:auto;color:#dc2626;font-weight:700;">✗</span>' : ''}
        </div>`;
    }).join('');

    return `
      <div style="margin-bottom:24px;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="font-size:15px;font-weight:700;color:#1e40af;">Q${i + 1}</span>
          <span style="padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700;
                       color:${statusColor};background:${statusColor}20;">${statusText}</span>
        </div>
        <p style="font-size:15px;color:#111827;margin:0 0 12px 0;line-height:1.6;">${d.text || ''}</p>
        ${optionsHtml}
        ${d.explanation ? `
          <div style="margin-top:10px;padding:12px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:6px;">
            <span style="font-size:12px;font-weight:700;color:#1d4ed8;">💡 Explanation</span>
            <p style="margin:4px 0 0 0;font-size:13px;color:#1e40af;line-height:1.5;">${d.explanation}</p>
          </div>` : ''}
      </div>`;
  }).join('<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; color: #111827; padding: 32px; }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:28px 32px;border-radius:12px;margin-bottom:28px;">
    <h1 style="font-size:22px;font-weight:800;margin-bottom:6px;">${test?.title || 'Mock Test'}</h1>
    <p style="font-size:13px;opacity:0.8;">Completed on ${completedAt}</p>
    <div style="display:flex;gap:24px;margin-top:20px;">
      <div>
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px;">Score</div>
        <div style="font-size:28px;font-weight:800;">${correct}/${activeResult?.totalMarks || 0}</div>
      </div>
      <div>
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px;">Percentage</div>
        <div style="font-size:28px;font-weight:800;">${percent}%</div>
      </div>
      <div>
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px;">Grade</div>
        <div style="font-size:28px;font-weight:800;">${grade.label}</div>
      </div>
      ${timeTaken > 0 ? `
      <div>
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px;">Time Taken</div>
        <div style="font-size:28px;font-weight:800;">${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</div>
      </div>` : ''}
    </div>
  </div>

  <!-- Summary cards -->
  <div style="display:flex;gap:12px;margin-bottom:32px;">
    <div style="flex:1;padding:16px;background:#dcfce7;border-radius:10px;text-align:center;">
      <div style="font-size:28px;font-weight:800;color:#15803d;">${correct}</div>
      <div style="font-size:12px;color:#166534;font-weight:600;">✅ Correct</div>
    </div>
    <div style="flex:1;padding:16px;background:#fee2e2;border-radius:10px;text-align:center;">
      <div style="font-size:28px;font-weight:800;color:#dc2626;">${wrong}</div>
      <div style="font-size:12px;color:#991b1b;font-weight:600;">❌ Wrong</div>
    </div>
    <div style="flex:1;padding:16px;background:#fef3c7;border-radius:10px;text-align:center;">
      <div style="font-size:28px;font-weight:800;color:#d97706;">${skipped}</div>
      <div style="font-size:12px;color:#92400e;font-weight:600;">⏭ Skipped</div>
    </div>
  </div>

  <!-- Questions -->
  <h2 style="font-size:18px;font-weight:800;color:#111827;margin-bottom:20px;">Answer Review</h2>
  ${questionsHtml}
</body>
</html>`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.xl, paddingHorizontal: spacing.md,
  },
  emoji: { fontSize: 64, marginBottom: spacing.sm },
  testTitle: {
    fontSize: typography.sizes.md, color: '#B8D4FF',
    textAlign: 'center', marginBottom: spacing.md, lineHeight: 22,
  },
  gradeLabel: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, marginBottom: spacing.xs },
  percentBig: { fontSize: 72, fontWeight: typography.weights.extrabold, color: colors.white },
  scoreDetail: { fontSize: typography.sizes.md, color: '#B8D4FF', marginTop: spacing.xs },
  timeTakenBadge: {
    marginTop: spacing.md, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  timeTakenText: { color: colors.white, fontSize: typography.sizes.sm },
  breakdown: { flexDirection: 'row', margin: spacing.md, gap: spacing.sm },
  breakdownItem: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  breakdownNum: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text },
  breakdownLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  scoreBarSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  scoreBarBg: { height: 10, backgroundColor: colors.border, borderRadius: radius.full, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: radius.full },
  scoreBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  scoreBarLabel: { fontSize: typography.sizes.xs, color: colors.textLight },
  actions: { paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  actionBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  reviewBtn: { borderWidth: 2, borderColor: colors.primary },
  reviewBtnText: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  pdfBtn: { backgroundColor: '#6366f1' },
  pdfBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  btnDisabled: { opacity: 0.6 },
  retestBtn: { backgroundColor: colors.accent },
  retestBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  homeBtn: { backgroundColor: colors.primary },
  homeBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  reviewSection: { padding: spacing.md, paddingTop: 0 },
  reviewTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.text, marginBottom: spacing.md },
  reviewCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4, borderLeftColor: colors.border,
  },
  reviewCardCorrect: { borderLeftColor: colors.success },
  reviewCardWrong: { borderLeftColor: colors.error },
  reviewCardSkipped: { borderLeftColor: colors.warning },
  reviewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  reviewQNum: { fontSize: typography.sizes.md, fontWeight: typography.weights.extrabold, color: colors.primary },
  reviewStatusBadge: { borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  reviewStatusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
});
