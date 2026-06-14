import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import ChatBox from '../../components/live/ChatBox';
import QuizPopup from '../../components/live/QuizPopup';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { pickLocalized } from '../../utils/localize';
import { WS_BASE_URL } from '../../config';

const { height } = Dimensions.get('window');

export default function LiveClassScreen({ route, navigation }) {
  const { classData } = route.params;
  const { user, token } = useSelector((s) => s.auth);

  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [leaderboardEntry, setLeaderboardEntry] = useState(null);

  const connect = useCallback(() => {
    const name = encodeURIComponent(user?.name || 'Student');
    const url = `${WS_BASE_URL}/ws/live/${classData.id}?token=${token}&name=${name}`;
    const socket = new WebSocket(url);

    socket.onopen = () => setConnected(true);
    socket.onclose = () => {
      setConnected(false);
      setTimeout(connect, 3000);
    };
    socket.onmessage = (e) => {
      try { handleEvent(JSON.parse(e.data)); } catch {}
    };
    wsRef.current = socket;
  }, [classData.id, token, user]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  function handleEvent(msg) {
    switch (msg.type) {
      case 'chat_message':
        setMessages((prev) => [...prev.slice(-100), msg.payload]);
        break;
      case 'quiz_start':
        setActiveQuiz(msg.payload);
        setLeaderboardEntry(null);
        break;
      case 'quiz_end': {
        setActiveQuiz(null);
        const entry = msg.payload.leaderboard?.find((e) => e.userId === user?.id);
        if (entry) {
          setLeaderboardEntry(entry);
          setTimeout(() => setLeaderboardEntry(null), 5000);
        }
        break;
      }
      case 'class_end':
        navigation.goBack();
        break;
    }
  }

  function sendChat(text) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'chat_message', payload: { message: text } }));
  }

  function handleQuizSubmit({ selectedIndex, timeTaken }) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: 'quiz_answer',
      payload: { questionId: activeQuiz.questionId, selectedIndex, timeTaken },
    }));
    setActiveQuiz(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.classTitle} numberOfLines={1}>{pickLocalized(classData, 'title')}</Text>
          <Text style={styles.classMeta}>{classData.subject} · {classData.teacherName}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: connected ? colors.success : colors.error }]} />
          <Text style={styles.statusText}>{connected ? 'Live' : 'Connecting'}</Text>
        </View>
      </View>

      {/* Video placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoIcon}>🎥</Text>
          <Text style={styles.videoPlaceholderText}>Live video coming soon</Text>
        </View>
      </View>

      {/* Chat */}
      <View style={styles.chatContainer}>
        <ChatBox messages={messages} onSend={sendChat} currentUserId={user?.id} />
      </View>

      {/* Quiz Popup */}
      {activeQuiz && (
        <QuizPopup
          question={activeQuiz}
          onSubmit={handleQuizSubmit}
          onDismiss={() => setActiveQuiz(null)}
        />
      )}

      {/* Quiz Result Banner */}
      {leaderboardEntry && (
        <View style={[styles.resultBanner, { backgroundColor: leaderboardEntry.isCorrect ? colors.success : colors.error }]}>
          <Text style={styles.resultText}>
            {leaderboardEntry.isCorrect
              ? `✓ Correct! You ranked #${leaderboardEntry.rank}`
              : '✗ Incorrect — better luck next time!'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.white },
  classTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.white },
  classMeta: { fontSize: typography.sizes.xs, color: '#B8D4FF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: typography.sizes.xs, color: colors.white, fontWeight: typography.weights.semibold },
  videoContainer: { height: height * 0.3, backgroundColor: '#000' },
  videoPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#111', gap: spacing.sm,
  },
  videoIcon: { fontSize: 36 },
  videoPlaceholderText: { color: '#aaa', fontSize: typography.sizes.sm },
  chatContainer: { flex: 1, borderTopWidth: 1, borderTopColor: colors.border },
  resultBanner: {
    position: 'absolute', bottom: 80,
    left: spacing.md, right: spacing.md,
    padding: spacing.md, borderRadius: radius.md, alignItems: 'center',
    elevation: 6,
  },
  resultText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
});
