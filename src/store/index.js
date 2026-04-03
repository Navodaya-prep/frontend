import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';
import practiceReducer from './practiceSlice';
import practiceHubReducer from './practiceHubSlice';
import recordedReducer from './recordedSlice';
import mockTestReducer from './mockTestSlice';
import leaderboardReducer from './leaderboardSlice';
import liveClassReducer from './liveClassSlice';
import settingsReducer from './settingsSlice';
import dailyChallengeReducer from './dailyChallengeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    practice: practiceReducer,
    practiceHub: practiceHubReducer,
    recorded: recordedReducer,
    mockTest: mockTestReducer,
    leaderboard: leaderboardReducer,
    liveClass: liveClassReducer,
    settings: settingsReducer,
    dailyChallenge: dailyChallengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
