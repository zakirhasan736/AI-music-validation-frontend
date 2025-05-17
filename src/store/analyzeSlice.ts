import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyzeState {
  result: string | number | null;
}

const initialState: AnalyzeState = {
  result: null,
};

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<string | number | null>) => {
      state.result = action.payload;
    },
    clearResult: state => {
      state.result = null;
    },
  },
});

export const { setResult, clearResult } = resultSlice.actions;
export default resultSlice.reducer;
