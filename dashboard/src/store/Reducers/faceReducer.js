// src/reducers/faceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action bất đồng bộ để gửi yêu cầu nhận diện khuôn mặt
export const compareFaces = createAsyncThunk(
  'face/compareFaces',
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/face/compare', imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const faceSlice = createSlice({
  name: 'face',
  initialState: {
    isMatching: false,
    matchResult: null,
    error: null,
  },
  reducers: {
    resetMatchResult: (state) => {
      state.matchResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(compareFaces.pending, (state) => {
        state.isMatching = true;
        state.matchResult = null;
        state.error = null;
      })
      .addCase(compareFaces.fulfilled, (state, action) => {
        state.isMatching = false;
        state.matchResult = action.payload;
      })
      .addCase(compareFaces.rejected, (state, action) => {
        state.isMatching = false;
        state.error = action.payload;
      });
  },
});

// Export reducer và các action
export const { resetMatchResult } = faceSlice.actions;
export default faceSlice.reducer;
