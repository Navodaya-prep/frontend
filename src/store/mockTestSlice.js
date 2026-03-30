import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockTestApi } from '../api/mockTestApi';
import { storage } from '../utils/storage';

export const fetchMockTests = createAsyncThunk('mockTest/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await mockTestApi.getTests();
    return res.data.tests;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load tests');
  }
});

export const fetchUserAttempts = createAsyncThunk('mockTest/fetchAttempts', async (_, { rejectWithValue }) => {
  try {
    const res = await mockTestApi.getUserAttempts();
    return res.data.attempts;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load attempts');
  }
});

export const startMockTest = createAsyncThunk('mockTest/start', async (testId, { rejectWithValue }) => {
  try {
    const res = await mockTestApi.getTest(testId);
    return res.data.test;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load test');
  }
});

export const submitMockTest = createAsyncThunk('mockTest/submit', async ({ testId, answers, timeTaken }, { rejectWithValue }) => {
  try {
    const res = await mockTestApi.submitTest(testId, answers, timeTaken);
    await storage.clearMockTestState();
    return res.data.result;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Submission failed');
  }
});

const mockTestSlice = createSlice({
  name: 'mockTest',
  initialState: {
    tests: [],
    attempts: [],
    activeTest: null,
    answers: {},
    timeRemaining: 0,
    startedAt: null,
    status: 'idle',
    result: null,
    error: null,
  },
  reducers: {
    selectAnswer: (state, action) => {
      const { questionIndex, optionIndex } = action.payload;
      state.answers[questionIndex] = optionIndex;
      storage.saveMockTestState({
        testId: state.activeTest?.id,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        startedAt: state.startedAt,
      });
    },
    tickTimer: (state) => {
      if (state.timeRemaining > 0) state.timeRemaining -= 1;
    },
    resetMockTest: (state) => {
      state.activeTest = null;
      state.answers = {};
      state.timeRemaining = 0;
      state.startedAt = null;
      state.status = 'idle';
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockTests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMockTests.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tests = action.payload || [];
      })
      .addCase(fetchMockTests.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })

      .addCase(fetchUserAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload || [];
      })

      .addCase(startMockTest.pending, (state) => { state.status = 'loading'; })
      .addCase(startMockTest.fulfilled, (state, action) => {
        state.activeTest = action.payload;
        state.timeRemaining = action.payload.duration * 60;
        state.startedAt = Date.now();
        state.answers = {};
        state.status = 'in-progress';
      })
      .addCase(startMockTest.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })

      .addCase(submitMockTest.pending, (state) => { state.status = 'submitting'; })
      .addCase(submitMockTest.fulfilled, (state, action) => {
        state.result = action.payload;
        state.status = 'submitted';
      })
      .addCase(submitMockTest.rejected, (state, action) => {
        state.status = 'in-progress';
        state.error = action.payload;
      });
  },
});

export const { selectAnswer, tickTimer, resetMockTest } = mockTestSlice.actions;
export default mockTestSlice.reducer;
