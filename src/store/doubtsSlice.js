import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doubtsApi } from '../api/doubtsApi';

export const fetchDoubts = createAsyncThunk(
  'doubts/fetch',
  async (subject, { rejectWithValue }) => {
    try {
      const res = await doubtsApi.list(subject);
      return res.data.doubts;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load doubts');
    }
  }
);

export const postDoubt = createAsyncThunk(
  'doubts/post',
  async ({ subject, text }, { rejectWithValue }) => {
    try {
      const res = await doubtsApi.post(subject, text);
      return res.data.doubt;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to post doubt');
    }
  }
);

export const fetchDoubtAnswers = createAsyncThunk(
  'doubts/fetchAnswers',
  async (id, { rejectWithValue }) => {
    try {
      const res = await doubtsApi.getAnswers(id);
      return { id, doubt: res.data.doubt, answers: res.data.answers };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load answers');
    }
  }
);

export const postDoubtAnswer = createAsyncThunk(
  'doubts/postAnswer',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await doubtsApi.postAnswer(id, text);
      return { id, answer: res.data.answer };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to post answer');
    }
  }
);

export const deleteDoubt = createAsyncThunk(
  'doubts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await doubtsApi.remove(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to delete doubt');
    }
  }
);

const doubtsSlice = createSlice({
  name: 'doubts',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    postStatus: 'idle',
    selectedDoubt: null,
    answers: [],
    answersStatus: 'idle',
  },
  reducers: {
    clearSelected: (state) => {
      state.selectedDoubt = null;
      state.answers = [];
      state.answersStatus = 'idle';
    },
    resetPostStatus: (state) => {
      state.postStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoubts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchDoubts.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload || []; })
      .addCase(fetchDoubts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(postDoubt.pending, (state) => { state.postStatus = 'loading'; })
      .addCase(postDoubt.fulfilled, (state, action) => {
        state.postStatus = 'succeeded';
        state.list.unshift(action.payload);
      })
      .addCase(postDoubt.rejected, (state) => { state.postStatus = 'failed'; })

      .addCase(fetchDoubtAnswers.pending, (state) => { state.answersStatus = 'loading'; })
      .addCase(fetchDoubtAnswers.fulfilled, (state, action) => {
        state.answersStatus = 'succeeded';
        state.selectedDoubt = action.payload.doubt;
        state.answers = action.payload.answers;
      })
      .addCase(fetchDoubtAnswers.rejected, (state) => { state.answersStatus = 'failed'; })

      .addCase(postDoubtAnswer.fulfilled, (state, action) => {
        state.answers.push(action.payload.answer);
        const doubt = state.list.find((d) => d.id === action.payload.id);
        if (doubt) doubt.status = 'answered';
      })

      .addCase(deleteDoubt.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload);
      });
  },
});

export const { clearSelected, resetPostStatus } = doubtsSlice.actions;
export default doubtsSlice.reducer;
