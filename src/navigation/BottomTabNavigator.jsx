import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [styles.tabBar, { height: 60 + insets.bottom, paddingBottom: insets.bottom + 8 }],
        tabBarLabelStyle: styles.tabLabel,
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
