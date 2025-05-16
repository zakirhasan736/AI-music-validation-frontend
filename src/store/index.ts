'use client'
import { configureStore } from '@reduxjs/toolkit';
import feedbackReducer from './feedbackSlice';
import resultReducer from './analyzeSlice';

export const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    result: resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
