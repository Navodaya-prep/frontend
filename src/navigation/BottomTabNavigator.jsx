import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import DashboardScreen from '../screens/app/DashboardScreen';
import DoubtsScreen from '../screens/app/DoubtsScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import LiveClassesScreen from '../screens/app/LiveClassesScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { active: '🏠', inactive: '🏡' },
  Live: { active: '🔴', inactive: '🎥' },
  Doubts: { active: '💬', inactive: '💭' },
  Profile: { active: '👤', inactive: '👥' },
};

const TAB_LABEL_KEYS = {
  Home: 'tabs.home',
  Live: 'tabs.live',
  Doubts: 'tabs.doubts',
  Profile: 'tabs.profile',
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [styles.tabBar, { height: 60 + insets.bottom, paddingBottom: insets.bottom + 8 }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarLabel: t(TAB_LABEL_KEYS[route.name] || route.name),
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 22 }}>
            {focused ? TAB_ICONS[route.name]?.active : TAB_ICONS[route.name]?.inactive}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Live" component={LiveClassesScreen} />
      <Tab.Screen name="Doubts" component={DoubtsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
