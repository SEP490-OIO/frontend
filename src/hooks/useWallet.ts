/**
 * TanStack Query hooks for the Wallet page.
 *
 * useWalletData() shares the same ['wallet', 'me'] cache key as
 * useDashboardWallet() — navigating between Dashboard and Wallet
 * won't trigger a redundant fetch if data is still fresh.
 *
 * When the backend API is ready, only the service functions change.
 */

import { useQuery } from '@tanstack/react-query';
import { getMyWallet, getWalletTransactions } from '@/services/walletService';

/** Current user's wallet — balance breakdown */
export function useWalletData() {
  return useQuery({
    queryKey: ['wallet', 'me'],
    queryFn: getMyWallet,
    staleTime: 2 * 60 * 1000, // 2 minutes — matches dashboard
  });
}

/** Full transaction history for the wallet page */
export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: getWalletTransactions,
  });
}
