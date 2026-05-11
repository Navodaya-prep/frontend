import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../api/courseApi';
import { storage } from '../utils/storage';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (force = false, { rejectWithValue }) => {
  try {
    if (!force) {
      const cached = await storage.getCoursesCache();
      if (cached) return cached;
    }
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

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    currentCourse: null,
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

      .addCase(fetchCourseDetail.fulfilled, (state, action) => { state.currentCourse = action.payload; });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
