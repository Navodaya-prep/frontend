import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { profileApi } from '../api/profileApi';
import { storage } from '../utils/storage';

export const sendOtp = createAsyncThunk('auth/sendOtp', async (phone, { rejectWithValue }) => {
  try {
    const res = await authApi.sendOtp(phone);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const res = await authApi.verifyOtp(phone, otp);
    if (res.data.token) {
      await storage.setToken(res.data.token);
      await storage.setUser(res.data.user);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
  }
});

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.signup(payload);
    await storage.setToken(res.data.token);
    await storage.setUser(res.data.user);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const loadStoredAuth = createAsyncThunk('auth/loadStored', async () => {
  const [token, user] = await Promise.all([storage.getToken(), storage.getUser()]);
  return { token, user };
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await profileApi.getProfile();
    await storage.setUser(res.data.user);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    tempToken: null,
    isNewUser: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(sendOtp.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.isNewUser) {
          state.tempToken = action.payload.tempToken;
          state.isNewUser = true;
        } else {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(signup.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tempToken = null;
        state.isNewUser = false;
      })
      .addCase(signup.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        if (action.payload.token && action.payload.user) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.tempToken = null;
        state.isNewUser = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
