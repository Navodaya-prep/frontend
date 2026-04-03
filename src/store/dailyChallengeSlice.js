import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dailyChallengeApi } from '../api/dailyChallengeApi';

export const fetchTodayChallenge = createAsyncThunk(
  'dailyChallenge/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeApi.getToday();
      return res.data.challenge;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load challenge');
    }
  }
);

export const submitChallenge = createAsyncThunk(
  'dailyChallenge/submit',
  async ({ selectedIndex, timeTakenMs }, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeApi.submit(selectedIndex, timeTakenMs);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to submit');
    }
  }
);

export const revealChallenge = createAsyncThunk(
  'dailyChallenge/reveal',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeApi.reveal();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to reveal');
    }
  }
);

export const fetchChallengeLeaderboard = createAsyncThunk(
  'dailyChallenge/fetchLeaderboard',
  async (period = 'today', { rejectWithValue }) => {
    try {
      const res = await dailyChallengeApi.getLeaderboard(period);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load leaderboard');
    }
  }
);

export const fetchChallengePractice = createAsyncThunk(
  'dailyChallenge/fetchPractice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dailyChallengeApi.getPractice();
      return res.data.challenges;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load practice');
    }
  }
);

const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState: {
    // Today's challenge
    challenge: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,

    // Submission
    submitStatus: 'idle',

    // Leaderboard
    leaderboard: [],
    userRank: null,
    leaderboardPeriod: 'today',
    leaderboardStatus: 'idle',

    // Practice (past challenges)
    pastChallenges: [],
    practiceStatus: 'idle',
  },
  reducers: {
    resetChallenge: (state) => {
      state.challenge = null;
      state.status = 'idle';
      state.submitStatus = 'idle';
    },
    setLeaderboardPeriod: (state, action) => {
      state.leaderboardPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch today
      .addCase(fetchTodayChallenge.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodayChallenge.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.challenge = action.payload;
      })
      .addCase(fetchTodayChallenge.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Submit
      .addCase(submitChallenge.pending, (state) => {
        state.submitStatus = 'loading';
      })
      .addCase(submitChallenge.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        // Merge submission result into challenge
        if (state.challenge) {
          state.challenge.attempt = {
            ...(state.challenge.attempt || {}),
            selectedIndex: action.meta.arg.selectedIndex,
            isCorrect: action.payload.isCorrect,
            points: action.payload.points,
            attempts: action.payload.attempts,
          };
          if (action.payload.correctIndex !== undefined) {
            state.challenge.correctIndex = action.payload.correctIndex;
            state.challenge.explanation = action.payload.explanation;
          }
        }
      })
      .addCase(submitChallenge.rejected, (state) => {
        state.submitStatus = 'failed';
      })

      // Reveal
      .addCase(revealChallenge.fulfilled, (state, action) => {
        if (state.challenge) {
          state.challenge.attempt = {
            ...(state.challenge.attempt || {}),
            revealed: true,
            points: 0,
          };
          state.challenge.correctIndex = action.payload.correctIndex;
          state.challenge.explanation = action.payload.explanation;
        }
      })

      // Leaderboard
      .addCase(fetchChallengeLeaderboard.pending, (state) => {
        state.leaderboardStatus = 'loading';
      })
      .addCase(fetchChallengeLeaderboard.fulfilled, (state, action) => {
        state.leaderboardStatus = 'succeeded';
        state.leaderboard = action.payload.leaderboard || [];
        state.userRank = action.payload.userRank || null;
        state.leaderboardPeriod = action.payload.period || 'today';
      })
      .addCase(fetchChallengeLeaderboard.rejected, (state) => {
        state.leaderboardStatus = 'failed';
      })

      // Practice
      .addCase(fetchChallengePractice.pending, (state) => {
        state.practiceStatus = 'loading';
      })
      .addCase(fetchChallengePractice.fulfilled, (state, action) => {
        state.practiceStatus = 'succeeded';
        state.pastChallenges = action.payload || [];
      })
      .addCase(fetchChallengePractice.rejected, (state) => {
        state.practiceStatus = 'failed';
      });
  },
});

export const { resetChallenge, setLeaderboardPeriod } = dailyChallengeSlice.actions;
export default dailyChallengeSlice.reducer;
