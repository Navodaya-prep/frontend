import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function Footer({ navigation }) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerLogoRow}>
        <Image source={require('../../../assets/logo.jpg')} style={styles.footerLogoImg} />
        <Text style={styles.footerLogo}>NavodayaSarthi</Text>
      </View>
      <Text style={styles.footerTagline}>India's JNVST Preparation Platform</Text>
      <View style={styles.divider} />
      <Text style={styles.footerContact}>📧 navodayasarthi.help@gmail.com</Text>
      <Text style={styles.footerContact}>📞 +91 81759 47318</Text>
      <Text style={styles.footerContact}>💬 WhatsApp Support Available</Text>
      <View style={styles.divider} />
      {navigation && (
        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.legalSep}>·</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.footerCopyright}>© 2026 NavodayaSarthi. All rights reserved.</Text>
      <Text style={styles.footerMadeWith}>Made with ❤️ in India for Indian Students</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1A1A2E',
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  footerLogoImg: { width: 40, height: 40, borderRadius: 8, resizeMode: 'contain' },
  footerLogo: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  footerTagline: {
    fontSize: typography.sizes.sm,
    color: '#B8B8C7',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: '#2A2A3E',
    marginVertical: spacing.md,
  },
  footerContact: {
    fontSize: typography.sizes.sm,
    color: '#B8B8C7',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  legalLink: {
    fontSize: typography.sizes.xs,
    color: '#7B9FE0',
    textDecorationLine: 'underline',
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
  },
  legalSep: {
    fontSize: typography.sizes.xs,
    color: '#B8B8C7',
    marginHorizontal: 4,
  },
  footerCopyright: {
    fontSize: typography.sizes.xs,
    color: '#B8B8C7',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  footerMadeWith: {
    fontSize: typography.sizes.xs,
    color: '#B8B8C7',
    textAlign: 'center',
  },
});
