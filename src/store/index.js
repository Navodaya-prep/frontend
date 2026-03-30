import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';
import practiceReducer from './practiceSlice';
import mockTestReducer from './mockTestSlice';
import leaderboardReducer from './leaderboardSlice';
import liveClassReducer from './liveClassSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    practice: practiceReducer,
    mockTest: mockTestReducer,
    leaderboard: leaderboardReducer,
    liveClass: liveClassReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
