/**
 * Wallet service — data fetching functions for wallet & transactions.
 *
 * Currently returns MOCK DATA. When the backend API is ready,
 * replace the function bodies with real Axios calls.
 *
 * Example swap:
 *   BEFORE: return MOCK_WALLET;
 *   AFTER:  const { data } = await api.get('/wallets/me'); return data;
 */

import type { Wallet, WalletTransaction } from '@/types';
import { MOCK_WALLET, MOCK_WALLET_TRANSACTIONS } from './mock/wallet';
import { mockDelay } from './mock/helpers';

/** Fetches the current user's wallet */
export async function getMyWallet(): Promise<Wallet> {
  await mockDelay();
  return MOCK_WALLET;
}

/** Fetches the current user's wallet transaction history */
export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  await mockDelay();
  return MOCK_WALLET_TRANSACTIONS;
}
