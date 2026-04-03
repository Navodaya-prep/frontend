import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as settingsApi from '../api/settingsApi';

export const fetchSettings = createAsyncThunk(
  'settings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsApi.getSettings();
      console.log('Settings API response:', data);
      return data;
    } catch (err) {
      console.error('Settings fetch error:', err);
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch settings' });
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    examDate: null,
    examName: 'JNVST 2026',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Settings payload:', action.payload);
        state.examDate = action.payload.settings?.examDate || null;
        state.examName = action.payload.settings?.examName || 'JNVST 2026';
        console.log('Updated state:', { examDate: state.examDate, examName: state.examName });
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load settings';
      });
  },
});

export default settingsSlice.reducer;
