import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../store/authSlice';
import { profileApi } from '../../api/profileApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [name, setName] = useState(user?.name || '');
  const [state, setState] = useState(user?.state || '');
  const [saving, setSaving] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await profileApi.updateProfile({ name: name.trim(), state });
      await dispatch(fetchProfile());
      Alert.alert('Saved', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={colors.textLight}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>+91 {user?.phone}</Text>
          </View>
          <Text style={styles.hint}>Phone number cannot be changed</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Class Level</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>Class {user?.classLevel}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowStatePicker(!showStatePicker)}>
            <Text style={[styles.inputText, !state && { color: colors.textLight }]}>
              {state || 'Select your state'}
            </Text>
          </TouchableOpacity>
          {showStatePicker && (
            <ScrollView style={styles.statePicker} nestedScrollEnabled>
              {STATES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.stateOption, state === s && styles.stateOptionSelected]}
                  onPress={() => { setState(s); setShowStatePicker(false); }}
                >
                  <Text style={[styles.stateOptionText, state === s && styles.stateOptionTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs },
  backText: { fontSize: 22, color: colors.white },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extrabold, color: colors.white },
  content: { padding: spacing.md, gap: spacing.md },
  field: { gap: 6 },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.textSecondary },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: typography.sizes.md, color: colors.text,
  },
  inputText: { fontSize: typography.sizes.md, color: colors.text },
  inputDisabled: {
    backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 14,
  },
  inputDisabledText: { fontSize: typography.sizes.md, color: colors.textSecondary },
  hint: { fontSize: typography.sizes.xs, color: colors.textLight },
  statePicker: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: colors.border, maxHeight: 200, marginTop: 4,
  },
  stateOption: { paddingHorizontal: spacing.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  stateOptionSelected: { backgroundColor: colors.primaryLight },
  stateOptionText: { fontSize: typography.sizes.md, color: colors.text },
  stateOptionTextSelected: { color: colors.primary, fontWeight: typography.weights.semibold },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: colors.white, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
});
