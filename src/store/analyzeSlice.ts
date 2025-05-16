import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  result: null,
};

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<any>) => {
      state.result = action.payload;
    },
    clearResult: state => {
      state.result = null;
    },
  },
});

export const { setResult, clearResult } = resultSlice.actions;
export default resultSlice.reducer;
