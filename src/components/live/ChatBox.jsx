import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function ChatBox({ messages, onSend, currentUserId }) {
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  function handleSend() {
    const msg = text.trim();
    if (!msg) return;
    onSend(msg);
    setText('');
  }

  function renderMessage({ item }) {
    const isOwn = item.userId === currentUserId;
    return (
      <View style={[styles.msgRow, isOwn && styles.msgRowOwn]}>
        {!isOwn && <Text style={styles.msgName}>{item.userName}</Text>}
        <View style={[styles.bubble, isOwn && styles.bubbleOwn]}>
          <Text style={[styles.msgText, isOwn && styles.msgTextOwn]}>{item.message}</Text>
        </View>
        <Text style={styles.msgTime}>
          {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={120}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No messages yet. Say hello! 👋</Text>
        }
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          multiline={false}
          maxLength={300}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.sm, gap: spacing.xs },
  empty: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: spacing.xl,
    fontSize: typography.sizes.sm,
  },
  msgRow: { marginBottom: spacing.xs, maxWidth: '80%' },
  msgRowOwn: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgName: {
    fontSize: typography.sizes.xs,
    color: colors.textLight,
    marginBottom: 2,
    marginLeft: spacing.xs,
  },
  bubble: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderTopLeftRadius: 4,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: 4,
  },
  msgText: { fontSize: typography.sizes.sm, color: colors.text },
  msgTextOwn: { color: '#fff' },
  msgTime: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
    marginHorizontal: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.text,
    backgroundColor: colors.background,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: typography.weights.semibold, fontSize: typography.sizes.sm },
});
