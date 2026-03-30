import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { practiceApi } from '../api/practiceApi';

export const fetchPracticeQuestions = createAsyncThunk(
  'practice/fetchQuestions',
  async (chapterId, { rejectWithValue }) => {
    try {
      const res = await practiceApi.getQuestions(chapterId);
      return res.data.questions;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load questions');
    }
  }
);

export const submitPractice = createAsyncThunk(
  'practice/submit',
  async ({ chapterId, answers }, { rejectWithValue }) => {
    try {
      const res = await practiceApi.submitAnswers(chapterId, answers);
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Submission failed');
    }
  }
);

const practiceSlice = createSlice({
  name: 'practice',
  initialState: {
    questions: [],
    selectedAnswers: {},
    result: null,
    submitted: false,
    currentIndex: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    selectAnswer: (state, action) => {
      const { questionIndex, optionIndex } = action.payload;
      state.selectedAnswers[questionIndex] = optionIndex;
    },
    setCurrentIndex: (state, action) => { state.currentIndex = action.payload; },
    resetPractice: (state) => {
      state.questions = [];
      state.selectedAnswers = {};
      state.result = null;
      state.submitted = false;
      state.currentIndex = 0;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeQuestions.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPracticeQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchPracticeQuestions.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(submitPractice.fulfilled, (state, action) => {
        state.result = action.payload;
        state.submitted = true;
      });
  },
});

export const { selectAnswer, setCurrentIndex, resetPractice } = practiceSlice.actions;
export default practiceSlice.reducer;
