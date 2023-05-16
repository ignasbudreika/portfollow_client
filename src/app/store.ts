import type { ThunkAction, Action, PayloadAction } from '@reduxjs/toolkit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

const initialState: Tokens = {
  accessToken: localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY) || ""
}

export interface Tokens {
  accessToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<Tokens>) => {
      localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY, action.payload.accessToken);
      state.accessToken = action.payload.accessToken;

      return state;
    },
    logout: (state) => {
      localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
      state.accessToken = "";

      return state;
    }
  }
})

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
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

export const { login, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;