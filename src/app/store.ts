import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import themeReducer from "../app/features/theme/theme-slice";


export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
