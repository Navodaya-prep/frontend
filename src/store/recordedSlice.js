import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../api/courseApi';

export const fetchChaptersWithProgress = createAsyncThunk(
  'recorded/fetchChaptersWithProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await courseApi.getChaptersWithProgress(courseId);
      return {
        chapters: res.data.chapters,
        totalLessons: res.data.totalLessons,
        completedCount: res.data.completedCount,
      };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load chapters');
    }
  }
);

export const fetchChapterLessons = createAsyncThunk(
  'recorded/fetchChapterLessons',
  async (chapterId, { rejectWithValue }) => {
    try {
      const res = await courseApi.getChapterLessons(chapterId);
      return { lessons: res.data.lessons, completedIds: res.data.completedIds };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load lessons');
    }
  }
);

export const markLessonComplete = createAsyncThunk(
  'recorded/markLessonComplete',
  async (lessonId, { rejectWithValue }) => {
    try {
      await courseApi.markLessonComplete(lessonId);
      return lessonId;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to mark complete');
    }
  }
);

const recordedSlice = createSlice({
  name: 'recorded',
  initialState: {
    chapters: [],         // chapters for the current course (with progress)
    totalLessons: 0,
    completedCount: 0,
    lessons: [],          // lessons for the current chapter
    completedIds: [],     // lesson IDs the user has completed
    loading: false,
    error: null,
  },
  reducers: {
    clearChapterData(state) {
      state.lessons = [];
      state.completedIds = [];
    },
    clearCourseData(state) {
      state.chapters = [];
      state.totalLessons = 0;
      state.completedCount = 0;
    },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };
    const failed = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchChaptersWithProgress.pending, loading)
      .addCase(fetchChaptersWithProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload.chapters || [];
        state.totalLessons = action.payload.totalLessons || 0;
        state.completedCount = action.payload.completedCount || 0;
      })
      .addCase(fetchChaptersWithProgress.rejected, failed)

      .addCase(fetchChapterLessons.pending, loading)
      .addCase(fetchChapterLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.lessons || [];
        state.completedIds = action.payload.completedIds || [];
      })
      .addCase(fetchChapterLessons.rejected, failed)

      .addCase(markLessonComplete.fulfilled, (state, action) => {
        // Optimistically add to completedIds so UI updates immediately
        const lessonId = action.payload;
        if (!state.completedIds.includes(lessonId)) {
          state.completedIds = [...state.completedIds, lessonId];
          state.completedCount += 1;
        }
        // Also update chapter's completedCount if we can find the lesson
        const lesson = state.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          const chapter = state.chapters.find((ch) => ch.id === lesson.chapterId);
          if (chapter) chapter.completedCount = (chapter.completedCount || 0) + 1;
        }
      });
  },
});

export const { clearChapterData, clearCourseData } = recordedSlice.actions;
export default recordedSlice.reducer;
