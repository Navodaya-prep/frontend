import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardApi } from '../api/leaderboardApi';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async ({ subject, classLevel } = {}, { rejectWithValue }) => {
    try {
      const res = await leaderboardApi.getLeaderboard(subject, classLevel);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    entries: [],
    userRank: null,
    subject: 'all',
    classLevel: 'all',
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.subject = action.payload.subject ?? state.subject;
      state.classLevel = action.payload.classLevel ?? state.classLevel;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = action.payload.leaderboard;
        state.userRank = action.payload.userRank;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { setFilter } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
