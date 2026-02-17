/**
 * Auth Slice — manages authentication state.
 *
 * Handles login, logout, and token management.
 * Uses localStorage to persist auth tokens across page refreshes.
 *
 * Why Redux Toolkit here (not TanStack Query)?
 * Auth is "client state" — it affects what the user can see/do across
 * the entire app (routing, sidebar menu, API headers). Redux is the
 * right tool for state that many components need to read synchronously.
 * TanStack Query is better for "server state" (data fetched from API).
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

// ─── State Shape ─────────────────────────────────────────────────────

interface AuthState {
  /** Current logged-in user, or null if not authenticated */
  user: User | null;
  /** JWT access token for API requests */
  accessToken: string | null;
  /** Whether the initial auth check (from localStorage) has completed */
  isInitialized: boolean;
}

// Try to restore tokens from localStorage on app start
const storedToken = localStorage.getItem('accessToken');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  accessToken: storedToken,
  isInitialized: true,
};

// ─── Slice ───────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after successful login or registration.
     * Stores the user and tokens in both Redux state and localStorage.
     */
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;

      // Persist to localStorage so auth survives page refresh
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Called when the user logs out or when a token refresh fails.
     * Clears all auth state and localStorage.
     */
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    /**
     * Updates the stored user data (e.g., after profile edit
     * or when seller permissions are unlocked).
     */
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;
