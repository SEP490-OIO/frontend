/**
 * Redux Store Configuration.
 *
 * Central store for the entire application. Uses Redux Toolkit's
 * configureStore which includes:
 * - Redux DevTools integration (for debugging in browser)
 * - Thunk middleware (for async actions)
 * - Serializable check middleware (catches common mistakes)
 *
 * New slices are added here as features are built:
 * - authSlice (Phase 1) — login/logout/user state
 * - walletSlice (Phase 2) — wallet balances
 * - auctionSlice (Phase 2) — auction state during bidding
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Future slices will be added here:
    // wallet: walletReducer,
    // auction: auctionReducer,
  },
});

// Infer types from the store itself — this ensures type safety
// when using useAppDispatch and useAppSelector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
