/**
 * Wallet domain types — the financial heart of the platform.
 *
 * The wallet serves as J Ho's escrow mechanism. Every user has one wallet
 * with 4 balance types that reflect different states of their money:
 *
 * - Available Funds:     Money freely usable for deposits and payments
 * - Locked for Auctions: Deposit amounts held for active auction participation
 * - Held for Delivery:   Escrow — payment held until delivery is confirmed
 * - Refund Balance:      Returned deposits from lost auctions, ready to withdraw
 *
 * Flow example:
 * 1. User adds 50M VND → Available: 50M
 * 2. Joins auction (5M deposit) → Available: 45M, Locked: 5M
 * 3. Wins auction (45M payment) → Available: 0, Locked: 5M, Held: 45M
 * 4. Delivery confirmed → Held released to seller → Available: 0, Locked: 0
 * 5. Deposit applied to order → final settlement
 */

import type {
  WalletTransactionType,
  WithdrawalRequestStatus,
} from './enums';

// ─── Wallet ─────────────────────────────────────────────────────────

/**
 * User's wallet — returned by GET /wallets/me.
 * Each user has exactly one wallet, created on registration.
 */
export interface Wallet {
  id: string;
  userId: string;
  /** Money the user can freely use for deposits, payments, and purchases */
  availableBalance: number;
  /** Deposit amounts currently locked for active auction participation */
  lockedBalance: number;
  /** Escrow — payment held until delivery is confirmed by buyer */
  heldBalance: number;
  /** Returned deposits from lost auctions, ready to withdraw */
  refundBalance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

// ─── Wallet Transaction ─────────────────────────────────────────────

/**
 * A single wallet-level transaction — every movement of money
 * in or out of the wallet creates one of these records.
 *
 * Types:
 * - credit:  Money added (deposit refund, add funds, seller payout)
 * - debit:   Money removed (auction deposit payment, order payment)
 * - hold:    Money moved from Available → Locked or Held
 * - release: Money moved from Locked/Held → Available or Refund
 */
export interface WalletTransaction {
  id: string;
  walletId: string;
  transactionId: string | null;
  type: WalletTransactionType;
  amount: number;
  /** Balance before this transaction */
  balanceBefore: number;
  /** Balance after this transaction */
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

// ─── Withdrawal Request ─────────────────────────────────────────────

/**
 * When a user wants to move money OUT of the platform to their
 * bank account. Only Refund Balance can be withdrawn.
 */
export interface WithdrawalRequest {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  fee: number;
  /** Amount after platform withdrawal fee */
  netAmount: number;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  status: WithdrawalRequestStatus;
  processedBy: string | null;
  processedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

// ─── Add Funds Request ──────────────────────────────────────────────

/**
 * Request shape for adding money to the wallet.
 * The actual payment goes through VNPay/MoMo/bank transfer.
 */
export interface AddFundsRequest {
  amount: number;
  /** Payment method: 'vnpay' | 'momo' | 'bank_transfer' */
  paymentMethod: string;
}

/** Request shape for withdrawing refund balance */
export interface WithdrawRequest {
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}
