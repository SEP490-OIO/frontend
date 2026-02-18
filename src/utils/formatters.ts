/**
 * Display formatting utilities — currency, time, and label helpers.
 *
 * These are used by UI components across the app (AuctionCard,
 * Wallet page, Order page, etc.) to ensure consistent formatting.
 */

import type { ItemCondition, AuctionStatus } from '@/types';

// ─── Currency ───────────────────────────────────────────────────────

/**
 * Formats a number as Vietnamese Dong.
 * Uses the standard Vietnamese number format (dots as thousands separator).
 *
 * Example: formatVND(24500000) → "24.500.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Time ───────────────────────────────────────────────────────────

/**
 * Calculates and formats the time remaining until an auction ends.
 * Returns a human-readable string in the current language.
 *
 * Examples:
 *   formatCountdown('2026-02-20T10:00:00Z', t) → "2 ngày 5 giờ" (vi)
 *   formatCountdown('2026-02-17T14:30:00Z', t) → "3 giờ 12 phút" (vi)
 *   formatCountdown('2026-02-17T11:00:00Z', t) → t('auction.ended') (past)
 */
export function formatCountdown(
  endTimeIso: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const ms = new Date(endTimeIso).getTime() - Date.now();

  if (ms <= 0) return t('auction.statusEnded');

  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return t('auction.countdownDaysHours', { days, hours });
  if (hours > 0) return t('auction.countdownHoursMinutes', { hours, minutes });
  return t('auction.countdownMinutes', { minutes });
}

/**
 * Formats an ISO datetime as a relative time string (e.g., "2 giờ trước").
 * Used in bid history lists to show when each bid was placed.
 */
export function formatRelativeTime(
  isoString: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const ms = Date.now() - new Date(isoString).getTime();
  const totalMinutes = Math.floor(ms / 60_000);

  if (totalMinutes < 1) return t('auctionDetail.timeAgo.now');
  if (totalMinutes < 60) return t('auctionDetail.timeAgo.minutes', { count: totalMinutes });

  const hours = Math.floor(totalMinutes / 60);
  if (hours < 24) return t('auctionDetail.timeAgo.hours', { count: hours });

  const days = Math.floor(hours / 24);
  return t('auctionDetail.timeAgo.days', { count: days });
}

// ─── Labels ─────────────────────────────────────────────────────────

/**
 * Maps item condition enum values to i18n keys.
 * Components call: t(CONDITION_KEYS[condition])
 */
export const CONDITION_KEYS: Record<ItemCondition, string> = {
  new: 'auction.conditionNew',
  like_new: 'auction.conditionLikeNew',
  very_good: 'auction.conditionVeryGood',
  good: 'auction.conditionGood',
  acceptable: 'auction.conditionAcceptable',
};

/**
 * Maps auction status to i18n keys for display labels.
 */
export const STATUS_KEYS: Record<AuctionStatus, string> = {
  draft: 'auction.statusDraft',
  pending: 'auction.statusPending',
  qualifying: 'auction.statusQualifying',
  active: 'auction.statusActive',
  ended: 'auction.statusEnded',
  sold: 'auction.statusSold',
  cancelled: 'auction.statusCancelled',
  failed: 'auction.statusFailed',
  emergency_stopped: 'auction.statusEmergencyStopped',
};

/**
 * Maps auction status to Ant Design Tag color.
 */
export const STATUS_COLORS: Record<AuctionStatus, string> = {
  draft: 'default',
  pending: 'processing',
  qualifying: 'orange',
  active: 'green',
  ended: 'default',
  sold: 'blue',
  cancelled: 'default',
  failed: 'red',
  emergency_stopped: 'red',
};
