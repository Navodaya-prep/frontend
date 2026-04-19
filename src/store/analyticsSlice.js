import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsApi } from '../api/analyticsApi';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await analyticsApi.get();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    subjectAccuracy: [],
    scoreTrend: [],
    weakAreas: [],
    summary: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subjectAccuracy = action.payload.subjectAccuracy || [];
        state.scoreTrend = action.payload.scoreTrend || [];
        state.weakAreas = action.payload.weakAreas || [];
        state.summary = action.payload.summary || null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export default analyticsSlice.reducer;
