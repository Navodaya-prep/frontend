import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'np_auth_token';
const USER_KEY = 'np_user';
const COURSES_CACHE_KEY = 'np_courses_cache';
const MOCK_TEST_STATE_KEY = 'np_mock_test_state';

export const storage = {
  async setToken(token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
  async setUser(user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  async getUser() {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },
  async setCoursesCache(data) {
    await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  },
  async getCoursesCache(maxAgeMs = 3600000) {
    const raw = await AsyncStorage.getItem(COURSES_CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAgeMs) return null;
    return data;
  },
  async saveMockTestState(state) {
    await AsyncStorage.setItem(MOCK_TEST_STATE_KEY, JSON.stringify(state));
  },
  async getMockTestState() {
    const raw = await AsyncStorage.getItem(MOCK_TEST_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async clearMockTestState() {
    await AsyncStorage.removeItem(MOCK_TEST_STATE_KEY);
  },
  async clear() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, COURSES_CACHE_KEY, MOCK_TEST_STATE_KEY]);
  },
};
