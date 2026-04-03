import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { practiceHubApi } from '../api/practiceHubApi';

export const fetchSubjects = createAsyncThunk(
  'practiceHub/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await practiceHubApi.getSubjects();
      return res.data.subjects;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load subjects');
    }
  }
);

export const fetchSubjectChapters = createAsyncThunk(
  'practiceHub/fetchSubjectChapters',
  async (subjectId, { rejectWithValue }) => {
    try {
      const res = await practiceHubApi.getSubjectChapters(subjectId);
      return res.data.chapters;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load chapters');
    }
  }
);

export const fetchChapterQuestions = createAsyncThunk(
  'practiceHub/fetchChapterQuestions',
  async (chapterId, { rejectWithValue }) => {
    try {
      const res = await practiceHubApi.getChapterQuestions(chapterId);
      return { questions: res.data.questions, solvedIds: res.data.solvedIds };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load questions');
    }
  }
);

export const submitChapterPractice = createAsyncThunk(
  'practiceHub/submitChapterPractice',
  async ({ chapterId, answers }, { rejectWithValue }) => {
    try {
      const res = await practiceHubApi.submitChapterPractice(chapterId, answers);
      return res.data.result;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Submission failed');
    }
  }
);

const practiceHubSlice = createSlice({
  name: 'practiceHub',
  initialState: {
    subjects: [],
    chapters: [],       // chapters for the currently selected subject
    questions: [],      // all questions for selected chapter
    solvedIds: [],      // question IDs the user has solved
    selectedAnswers: {}, // questionId → selectedIndex (during active session)
    result: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    selectAnswer(state, action) {
      const { questionId, selectedIndex } = action.payload;
      state.selectedAnswers[questionId] = selectedIndex;
    },
    clearSession(state) {
      state.selectedAnswers = {};
      state.result = null;
      state.submitting = false;
    },
    clearChapters(state) {
      state.chapters = [];
    },
    clearQuestions(state) {
      state.questions = [];
      state.solvedIds = [];
      state.selectedAnswers = {};
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };
    const failed = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchSubjects.pending, loading)
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload || [];
      })
      .addCase(fetchSubjects.rejected, failed)

      .addCase(fetchSubjectChapters.pending, loading)
      .addCase(fetchSubjectChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload || [];
      })
      .addCase(fetchSubjectChapters.rejected, failed)

      .addCase(fetchChapterQuestions.pending, loading)
      .addCase(fetchChapterQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions || [];
        state.solvedIds = action.payload.solvedIds || [];
      })
      .addCase(fetchChapterQuestions.rejected, failed)

      .addCase(submitChapterPractice.pending, (state) => { state.submitting = true; })
      .addCase(submitChapterPractice.fulfilled, (state, action) => {
        state.submitting = false;
        state.result = action.payload;
        // Merge newly solved IDs into local state so UI updates immediately
        if (action.payload?.detailed) {
          const newlySolved = action.payload.detailed.map((d) => d.questionId);
          const merged = new Set([...state.solvedIds, ...newlySolved]);
          state.solvedIds = Array.from(merged);
        }
      })
      .addCase(submitChapterPractice.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { selectAnswer, clearSession, clearChapters, clearQuestions } = practiceHubSlice.actions;
export default practiceHubSlice.reducer;
