import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedbackState {
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: FeedbackState = {
  loading: false,
  success: false,
  error: '',
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    submitStart: state => {
      state.loading = true;
      state.success = false;
      state.error = '';
    },
    submitSuccess: state => {
      state.loading = false;
      state.success = true;
      state.error = '';
    },
    submitFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetFeedback: () => initialState,
  },
});

export const { submitStart, submitSuccess, submitFail, resetFeedback } =
  feedbackSlice.actions;
export default feedbackSlice.reducer;
