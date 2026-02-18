/**
 * Dashboard-specific aggregate types.
 *
 * These represent pre-computed summaries returned by the dashboard API.
 * In mock mode, the service function computes these from existing mock data.
 * In production, the backend will return them from dedicated endpoints.
 */

import type { AuctionListItem, Bid } from './auction';
import type { BidStatus } from './enums';

/** A bid the current user has placed, enriched with auction context */
export interface MyBidItem {
  /** The auction the user is bidding on */
  auction: AuctionListItem;
  /** The user's most recent bid on this auction */
  myLatestBid: Bid;
  /** Whether the user is currently winning or outbid */
  myBidStatus: BidStatus;
}

/** Summary stats for the quick stats row at the top of the dashboard */
export interface BidderDashboardStats {
  activeBidsCount: number;
  wonCount: number;
  watchingCount: number;
}
