import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../store/authSlice';
import { isValidName } from '../../utils/validators';
import { INDIA_STATES, CLASS_OPTIONS } from '../../utils/constants';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppButton } from '../../components/common/AppButton';

export default function SignupScreen({ navigation, route }) {
  const { phone } = route.params || {};
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [state, setState] = useState('');
  const [showStateModal, setShowStateModal] = useState(false);
  const dispatch = useDispatch();
  const { status, error, tempToken } = useSelector((s) => s.auth);

  const handleSignup = () => {
    if (!isValidName(name)) return;
    if (!classLevel) return;
    if (!state) return;
    dispatch(clearError());
    dispatch(signup({ name: name.trim(), phone, classLevel, state, tempToken }));
  };

  const isValid = isValidName(name) && classLevel && state;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.emoji}>🎓</Text>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Almost there! Fill in your details to get started.</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <View style={[styles.input, styles.readOnly]}>
            <Text style={styles.readOnlyText}>+91 {phone}</Text>
          </View>

          <Text style={styles.label}>Select Class</Text>
          <View style={styles.classRow}>
            {CLASS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.classBtn, classLevel === opt.value && styles.classBtnSelected]}
                onPress={() => setClassLevel(opt.value)}
              >
                <Text style={[styles.classBtnNum, classLevel === opt.value && styles.classBtnNumSelected]}>
                  Class {opt.value}
                </Text>
                <Text style={[styles.classBtnSub, classLevel === opt.value && styles.classBtnSubSelected]}>
                  {opt.value === '5' ? 'For Class 6 Admission' : 'For Class 9 Admission'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>State</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowStateModal(true)}>
            <Text style={state ? styles.inputText : styles.inputPlaceholder}>
              {state || 'Select your state'}
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <AppButton
            title="Create Account →"
            onPress={handleSignup}
            loading={status === 'loading'}
            disabled={!isValid}
            style={styles.btn}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State Picker Modal */}
      <Modal visible={showStateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select State</Text>
            <TouchableOpacity onPress={() => setShowStateModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={INDIA_STATES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stateItem}
                onPress={() => { setState(item); setShowStateModal(false); }}
              >
                <Text style={styles.stateItemText}>{item}</Text>
                {state === item && <Text style={styles.stateItemCheck}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingTop: spacing.lg },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    padding: spacing.md, fontSize: typography.sizes.md, color: colors.text, marginBottom: spacing.md,
    justifyContent: 'center',
  },
  inputText: { fontSize: typography.sizes.md, color: colors.text },
  inputPlaceholder: { fontSize: typography.sizes.md, color: colors.textLight },
  readOnly: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  readOnlyText: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: typography.weights.semibold },
  classRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  classBtn: {
    width: '48%', borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.white, padding: spacing.md, alignItems: 'center',
  },
  classBtnSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  classBtnNum: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extrabold, color: colors.text },
  classBtnNumSelected: { color: colors.primary },
  classBtnSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  classBtnSubSelected: { color: colors.primary },
  errorText: { color: colors.error, fontSize: typography.sizes.sm, marginBottom: spacing.md },
  btn: { marginTop: spacing.sm, marginBottom: spacing.md },
  terms: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' },
  modalSafe: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  modalTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  modalClose: { fontSize: typography.sizes.lg, color: colors.textSecondary },
  stateItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  stateItemText: { fontSize: typography.sizes.md, color: colors.text },
  stateItemCheck: { color: colors.primary, fontWeight: typography.weights.bold, fontSize: typography.sizes.lg },
});
