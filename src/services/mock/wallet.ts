/**
 * Mock wallet data — a sample wallet with transaction history.
 *
 * TEMPORARY: Will be replaced by GET /wallets/me API endpoint.
 *
 * Shows the 4 balance types and a realistic transaction history
 * including deposits, payments, holds, and refunds.
 */

import type { Wallet, WalletTransaction } from '@/types';
import { mockId, mockDate } from './helpers';

/** Mock wallet for the currently logged-in user */
export const MOCK_WALLET: Wallet = {
  id: mockId('wallet', 1),
  userId: mockId('user', 100), // The "current user"
  availableBalance: 48_000_000,
  lockedBalance: 5_000_000,
  heldBalance: 0,
  refundBalance: 3_200_000,
  currency: 'VND',
  isActive: true,
  createdAt: mockDate(-720), // ~30 days ago
  modifiedAt: mockDate(-1),
};

/** Recent wallet transactions for the current user */
export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: mockId('wtx', 1),
    walletId: mockId('wallet', 1),
    transactionId: mockId('tx', 1),
    type: 'hold',
    amount: 5_000_000,
    balanceBefore: 53_000_000,
    balanceAfter: 48_000_000,
    description: 'Đặt cọc phiên đấu giá - iPhone 15 Pro Max 256GB',
    createdAt: mockDate(-6),
  },
  {
    id: mockId('wtx', 2),
    walletId: mockId('wallet', 1),
    transactionId: mockId('tx', 2),
    type: 'release',
    amount: 3_200_000,
    balanceBefore: 0,
    balanceAfter: 3_200_000,
    description: 'Hoàn cọc - PS5 Slim (bạn không thắng)',
    createdAt: mockDate(-48),
  },
  {
    id: mockId('wtx', 3),
    walletId: mockId('wallet', 1),
    transactionId: null,
    type: 'credit',
    amount: 20_000_000,
    balanceBefore: 33_000_000,
    balanceAfter: 53_000_000,
    description: 'Nạp tiền qua VNPay',
    createdAt: mockDate(-72),
  },
  {
    id: mockId('wtx', 4),
    walletId: mockId('wallet', 1),
    transactionId: mockId('tx', 3),
    type: 'debit',
    amount: 7_500_000,
    balanceBefore: 40_500_000,
    balanceAfter: 33_000_000,
    description: 'Thanh toán đơn hàng - Xe đạp Giant Escape 3',
    createdAt: mockDate(-96),
  },
  {
    id: mockId('wtx', 5),
    walletId: mockId('wallet', 1),
    transactionId: null,
    type: 'credit',
    amount: 30_000_000,
    balanceBefore: 10_500_000,
    balanceAfter: 40_500_000,
    description: 'Nạp tiền qua MoMo',
    createdAt: mockDate(-168),
  },
];
