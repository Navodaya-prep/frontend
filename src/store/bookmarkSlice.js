import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookmarkApi } from '../api/bookmarkApi';

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookmarkApi.list();
      return res.data.bookmarks;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load bookmarks');
    }
  }
);

export const addBookmark = createAsyncThunk(
  'bookmarks/add',
  async ({ questionId, source }, { rejectWithValue }) => {
    try {
      await bookmarkApi.add(questionId, source);
      return questionId;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to bookmark');
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmarks/remove',
  async (questionId, { rejectWithValue }) => {
    try {
      await bookmarkApi.remove(questionId);
      return questionId;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to remove bookmark');
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    list: [],
    bookmarkedIds: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload || [];
        state.bookmarkedIds = (action.payload || []).map((b) => b.question?._id || b.question?.id).filter(Boolean);
      })
      .addCase(fetchBookmarks.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(addBookmark.fulfilled, (state, action) => {
        if (!state.bookmarkedIds.includes(action.payload)) {
          state.bookmarkedIds.push(action.payload);
        }
      })

      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarkedIds = state.bookmarkedIds.filter((id) => id !== action.payload);
        state.list = state.list.filter((b) => (b.question?._id || b.question?.id) !== action.payload);
      });
  },
});

export default bookmarkSlice.reducer;
