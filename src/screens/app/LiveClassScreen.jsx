import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import ChatBox from '../../components/live/ChatBox';
import QuizPopup from '../../components/live/QuizPopup';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

const WS_BASE = 'ws://localhost:8080';
const { height } = Dimensions.get('window');

export default function LiveClassScreen({ route, navigation }) {
  const { classData } = route.params;
  const { user, token } = useSelector((s) => s.auth);

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [leaderboardEntry, setLeaderboardEntry] = useState(null); // user's result after quiz
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    const name = encodeURIComponent(user?.name || 'Student');
    const url = `${WS_BASE}/ws/live/${classData.id}?token=${token}&name=${name}`;
    const socket = new WebSocket(url);

    socket.onopen = () => setConnected(true);

    socket.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3s
      setTimeout(connect, 3000);
    };

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        handleEvent(msg);
      } catch {}
    };

    wsRef.current = socket;
  }, [classData.id, token, user]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
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
        // Find user's rank in leaderboard
        const entry = msg.payload.leaderboard?.find((e) => e.userId === user?.id);
        if (entry) setLeaderboardEntry(entry);
        // Clear result after 5s
        setTimeout(() => setLeaderboardEntry(null), 5000);
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

  const youtubeUri = `https://www.youtube.com/watch?v=${classData.youtubeVideoId}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.classTitle} numberOfLines={1}>{classData.title}</Text>
          <Text style={styles.classMeta}>{classData.subject} · {classData.teacherName}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: connected ? colors.success : colors.error }]} />
      </View>

      {/* YouTube Player */}
      <View style={styles.player}>
        <WebView
          source={{ uri: youtubeUri }}
          style={{ flex: 1 }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        />
      </View>

      {/* Chat */}
      <View style={styles.chatContainer}>
        <ChatBox
          messages={messages}
          onSend={sendChat}
          currentUserId={user?.id}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.primary },
  classTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  classMeta: { fontSize: typography.sizes.xs, color: colors.textLight },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  player: { height: height * 0.28 },
  chatContainer: { flex: 1, borderTopWidth: 1, borderTopColor: colors.border },
  resultBanner: {
    position: 'absolute',
    bottom: 80,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  resultText: { color: '#fff', fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
});
