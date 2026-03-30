import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { liveClassApi } from '../api/liveClassApi';

export const fetchActiveLiveClasses = createAsyncThunk(
  'liveClass/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await liveClassApi.getActiveLiveClasses();
      return res.data.classes;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch live classes');
    }
  }
);

const liveClassSlice = createSlice({
  name: 'liveClass',
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveLiveClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload || [];
      })
      .addCase(fetchActiveLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default liveClassSlice.reducer;
