/**
 * Order & Payment domain types.
 *
 * An order is created after an auction ends with a winner:
 * 1. Auction ends → winner determined
 * 2. Order created (pending_payment)
 * 3. Winner pays from wallet within 48h (paid)
 * 4. Seller ships within 3 business days (shipped)
 * 5. System auto-tracks delivery (delivered)
 * 6. 7-day return window → no return request → payment released (completed)
 *
 * Escrow: Payment is held in wallet (Held for Delivery) until
 * delivery is confirmed and the return window expires.
 */

import type {
  OrderStatus,
  TransactionType,
  TransactionStatus,
  PaymentMethodType,
  EscrowStatus,
  InvoiceStatus,
} from './enums';
import type { ItemSummary } from './item';
import type { SellerSummary, UserAddress } from './user';

// ─── Order ──────────────────────────────────────────────────────────

/**
 * Full order detail — returned by GET /orders/:id.
 * Includes nested item, seller, and address info.
 */
export interface Order {
  id: string;
  orderNumber: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  // ─── Pricing breakdown ────────────────────────────────────────
  /** The winning bid amount */
  itemPrice: number;
  shippingFee: number;
  /** Platform commission (default 5% of item price) */
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  // ─── Status & Timeline ────────────────────────────────────────
  status: OrderStatus;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  notes: string | null;
  // ─── Nested data (populated by API) ───────────────────────────
  item: ItemSummary | null;
  seller: SellerSummary | null;
  shippingAddress: UserAddress | null;
  billingAddress: UserAddress | null;
  /** Escrow record for this order (null before payment) */
  escrow: Escrow | null;
  createdAt: string;
  modifiedAt: string;
}

/**
 * Lightweight order summary for the My Orders list page.
 */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  auctionId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  itemTitle: string;
  primaryImageUrl: string | null;
  sellerName: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

// ─── Transaction ────────────────────────────────────────────────────

/**
 * A payment-level transaction — tracks money flowing through
 * the payment gateway (VNPay, MoMo, bank transfer).
 * Different from WalletTransaction which tracks wallet-internal movements.
 */
export interface Transaction {
  id: string;
  transactionNumber: string | null;
  orderId: string | null;
  userId: string;
  paymentMethodId: string | null;
  type: TransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: TransactionStatus;
  gatewayProvider: string | null;
  description: string | null;
  processedAt: string | null;
  createdAt: string;
}

// ─── Payment Method ─────────────────────────────────────────────────

/** A saved payment method (credit card, bank account, e-wallet) */
export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  /** e.g., "visa", "mastercard", "momo", "vnpay" */
  provider: string | null;
  /** Last 4 digits for display (e.g., "4242") */
  lastFour: string | null;
  holderName: string | null;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

// ─── Escrow ─────────────────────────────────────────────────────────

/**
 * Escrow holds the buyer's payment until delivery is confirmed.
 * This is the mechanism that protects both buyer and seller:
 * - Buyer knows their money is safe until they receive the item
 * - Seller knows the money is committed and will be released
 */
export interface Escrow {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  heldAt: string | null;
  releasedAt: string | null;
}

// ─── Invoice ────────────────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string | null;
  dueDate: string | null;
  paidAt: string | null;
}
