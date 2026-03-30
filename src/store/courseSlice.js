import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../api/courseApi';
import { storage } from '../utils/storage';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const cached = await storage.getCoursesCache();
    if (cached) return cached;
    const res = await courseApi.getCourses();
    await storage.setCoursesCache(res.data.courses);
    return res.data.courses;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load courses');
  }
});

export const fetchCourseDetail = createAsyncThunk('courses/fetchDetail', async (courseId, { rejectWithValue }) => {
  try {
    const res = await courseApi.getCourseById(courseId);
    return res.data.course;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load course');
  }
});

export const fetchChapterContent = createAsyncThunk('courses/fetchContent', async ({ chapterId, type }, { rejectWithValue }) => {
  try {
    const res = type === 'video'
      ? await courseApi.getVideos(chapterId)
      : await courseApi.getPDFs(chapterId);
    return { chapterId, type, items: res.data.items };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load content');
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    currentCourse: null,
    chapterContent: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => { state.currentCourse = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
      .addCase(fetchCourses.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchCourseDetail.fulfilled, (state, action) => { state.currentCourse = action.payload; })

      .addCase(fetchChapterContent.fulfilled, (state, action) => {
        const { chapterId, type, items } = action.payload;
        state.chapterContent[`${chapterId}_${type}`] = items;
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
