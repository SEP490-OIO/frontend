/**
 * Notification domain types.
 *
 * The platform sends notifications for events like:
 * - Auction updates (outbid, auction ending, won, lost)
 * - Order status changes (payment received, shipped, delivered)
 * - Wallet events (funds added, deposit refunded)
 * - Dispute updates (new message, resolution)
 * - System announcements
 *
 * Notifications can be delivered through multiple channels:
 * in-app, email, SMS, push, SignalR (real-time).
 */

import type { NotificationChannel } from './enums';

// ─── Notification ───────────────────────────────────────────────────

/**
 * A single notification shown in the user's notification center.
 * The `referenceType` + `referenceId` fields link the notification
 * to the relevant entity (e.g., auction, order, dispute) so the
 * UI can create a clickable link.
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  /** Groups notifications: 'auction', 'payment', 'order', 'dispute', 'system' */
  category: string;
  /** What entity this notification is about (e.g., 'auction', 'order') */
  referenceType: string | null;
  /** ID of the referenced entity (for building navigation links) */
  referenceId: string | null;
  /** Direct link URL (e.g., '/auction/abc-123') */
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// ─── Notification Settings ──────────────────────────────────────────

/**
 * User's notification preferences per category.
 * Each category (auction, payment, order, etc.) can have
 * different channel preferences enabled/disabled.
 */
export interface NotificationSetting {
  id: string;
  userId: string;
  /** The notification category this setting applies to */
  category: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

/**
 * Available notification channels for display in the settings UI.
 * Maps a channel to a human-readable label.
 */
export interface NotificationChannelOption {
  channel: NotificationChannel;
  label: string;
  description: string;
}
