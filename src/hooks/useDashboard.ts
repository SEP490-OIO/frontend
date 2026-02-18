/**
 * TanStack Query hooks for the dashboard page.
 *
 * Follows the same pattern as useAuctions.ts:
 *   1. Wrap a service function with useQuery
 *   2. Descriptive queryKey array
 *   3. Named export
 *
 * All five queries run in parallel on page mount — no sequential deps.
 * When the backend API is ready, only the service functions change.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getMyActiveBids,
  getRecentlyEndedBids,
  getFeaturedAuctions,
} from '@/services/dashboardService';
import { getMyWallet } from '@/services/walletService';

/** Quick stats: active bids count, won count, watching count */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
}

/**
 * Current user's wallet.
 * Uses ['wallet', 'me'] queryKey so the cache is shared with the
 * future Wallet page — no duplicate fetch when navigating between them.
 */
export function useDashboardWallet() {
  return useQuery({
    queryKey: ['wallet', 'me'],
    queryFn: getMyWallet,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/** Auctions the user is actively bidding on */
export function useMyActiveBids() {
  return useQuery({
    queryKey: ['dashboard', 'myActiveBids'],
    queryFn: getMyActiveBids,
  });
}

/** Recently ended auctions the user participated in */
export function useRecentlyEnded() {
  return useQuery({
    queryKey: ['dashboard', 'recentlyEnded'],
    queryFn: getRecentlyEndedBids,
  });
}

/** Featured auctions for the recommendations section */
export function useFeaturedForDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'featured'],
    queryFn: getFeaturedAuctions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
