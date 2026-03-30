import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { loadStoredAuth } from '../store/authSlice';
import { AppLoader } from '../components/common/AppLoader';

// Pre-auth screens
import LandingScreen from '../screens/pre-auth/LandingScreen';
import AboutScreen from '../screens/pre-auth/AboutScreen';
import FAQScreen from '../screens/pre-auth/FAQScreen';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// App screens
import BottomTabNavigator from './BottomTabNavigator';
import PracticeMCQScreen from '../screens/app/PracticeMCQScreen';
import MockTestListScreen from '../screens/app/MockTestListScreen';
import MockTestStartScreen from '../screens/app/MockTestStartScreen';
import MockTestScreen from '../screens/app/MockTestScreen';
import MockTestResultScreen from '../screens/app/MockTestResultScreen';
import LeaderboardScreen from '../screens/app/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    dispatch(loadStoredAuth()).finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLoader fullScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="FAQ" component={FAQScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={BottomTabNavigator} />

            {/* Practice */}
            <Stack.Screen
              name="PracticeMCQ"
              component={PracticeMCQScreen}
              options={{ presentation: 'modal' }}
            />

            {/* Mock Test flow: List → Start → Take → Result */}
            <Stack.Screen name="MockTestList" component={MockTestListScreen} />
            <Stack.Screen name="MockTestStart" component={MockTestStartScreen} />
            <Stack.Screen
              name="MockTestTake"
              component={MockTestScreen}
              options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
            />
            <Stack.Screen
              name="MockTestResult"
              component={MockTestResultScreen}
            />

            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
