import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: '',
  history: [],
  isLoading: false,
  error: null,
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
      state.history.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    undo: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
        state.content = state.history[state.history.length - 1];
      }
    },
  },
});

export const { setContent, setLoading, setError, undo } = documentSlice.actions;

export default documentSlice.reducer; 