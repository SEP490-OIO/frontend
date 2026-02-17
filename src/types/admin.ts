/**
 * Admin & Staff domain types — for staff portals and admin dashboard.
 *
 * These types are minimal placeholders for now. They will be expanded
 * when we reach the staff portal implementation phase (weeks 4-5).
 *
 * Included early because some types (like PlatformSetting) are
 * referenced by other domains (e.g., auction deposit percentage
 * comes from platform settings).
 */

import type {
  AuditAction,
  PromotionType,
  PromotionStatus,
} from './enums';

// ─── Platform Settings ──────────────────────────────────────────────

/**
 * Admin-configurable system parameter.
 * All business rules (deposit %, commission %, return window, etc.)
 * are stored as platform settings so Admin can adjust them without
 * code changes.
 *
 * Categories: 'auction', 'payment', 'shipping', 'verification', 'promotion'
 */
export interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  /** How to interpret the value: 'string', 'integer', 'decimal', 'boolean', 'json' */
  dataType: string;
  category: string;
  description: string | null;
  isActive: boolean;
  modifiedBy: string | null;
  createdAt: string;
  modifiedAt: string;
}

// ─── Audit Log ──────────────────────────────────────────────────────

/**
 * Append-only audit trail. Every significant action in the system
 * is logged here for accountability and compliance.
 */
export interface AuditLog {
  id: string;
  actorUserId: string | null;
  actorDisplayName: string | null;
  actorEmail: string | null;
  targetUserId: string | null;
  targetDisplayName: string | null;
  targetEmail: string | null;
  action: AuditAction;
  entityType: string | null;
  entityId: string | null;
  ip: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ─── Promotion ──────────────────────────────────────────────────────

/**
 * Seller-purchased visibility promotion.
 * Sellers can buy featured placement for their auctions.
 * Marketing staff manages campaigns and reviews analytics.
 */
export interface Promotion {
  id: string;
  auctionId: string;
  sellerId: string;
  type: PromotionType;
  status: PromotionStatus;
  amountPaid: number;
  currency: string;
  startDate: string;
  endDate: string;
  /** Number of times the promoted auction was shown */
  impressions: number;
  /** Number of times users clicked on the promotion */
  clicks: number;
  createdAt: string;
  modifiedAt: string;
}
