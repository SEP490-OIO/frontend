/**
 * Dashboard service — data fetching functions for the dashboard page.
 *
 * Currently returns MOCK DATA. When the backend API is ready,
 * replace the function bodies with real Axios calls.
 *
 * Future API endpoints these map to:
 *   GET /dashboard/stats      → getDashboardStats()
 *   GET /dashboard/my-bids    → getMyActiveBids()
 *   GET /dashboard/recent     → getRecentlyEndedBids()
 *   GET /dashboard/featured   → getFeaturedAuctions()
 */

import type { MyBidItem, BidderDashboardStats, AuctionListItem } from '@/types';
import {
  MOCK_MY_ACTIVE_BIDS,
  MOCK_RECENTLY_ENDED,
  MOCK_DASHBOARD_STATS,
  MOCK_FEATURED_FOR_DASHBOARD,
} from './mock/dashboard';
import { mockDelay } from './mock/helpers';

/** Dashboard quick stats (bid counts, won count, watching count) */
export async function getDashboardStats(): Promise<BidderDashboardStats> {
  await mockDelay(200, 500);
  return MOCK_DASHBOARD_STATS;
}

/** Auctions where the current user has active/winning bids */
export async function getMyActiveBids(): Promise<MyBidItem[]> {
  await mockDelay();
  return MOCK_MY_ACTIVE_BIDS;
}

/** Auctions the user participated in that recently ended */
export async function getRecentlyEndedBids(): Promise<MyBidItem[]> {
  await mockDelay();
  return MOCK_RECENTLY_ENDED;
}

/** Featured/recommended auctions for the dashboard */
export async function getFeaturedAuctions(): Promise<AuctionListItem[]> {
  await mockDelay(200, 400);
  return MOCK_FEATURED_FOR_DASHBOARD;
}
