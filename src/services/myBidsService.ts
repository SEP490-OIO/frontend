/**
 * My Bids service — data fetching for the My Bids page.
 *
 * Currently returns MOCK DATA. When the backend API is ready,
 * replace the function bodies with real Axios calls.
 *
 * Future API endpoints:
 *   GET /my-bids?status=active    → getMyActiveBidsFull()
 *   GET /my-bids?status=ended     → getMyEndedBids()
 *   GET /my-bids/watching         → getMyWatchedAuctions()
 */

import type { MyBidItem, AuctionListItem } from '@/types';
import {
  MOCK_MY_ACTIVE_BIDS_FULL,
  MOCK_MY_ENDED_BIDS,
  MOCK_MY_WATCHED_AUCTIONS,
} from './mock/myBids';
import { mockDelay } from './mock/helpers';

/** All auctions where user has deposit or active bid */
export async function getMyActiveBidsFull(): Promise<MyBidItem[]> {
  await mockDelay();
  return MOCK_MY_ACTIVE_BIDS_FULL;
}

/** Ended auctions where user participated */
export async function getMyEndedBids(): Promise<MyBidItem[]> {
  await mockDelay();
  return MOCK_MY_ENDED_BIDS;
}

/** Auctions user is watching (heart only, no deposit) */
export async function getMyWatchedAuctions(): Promise<AuctionListItem[]> {
  await mockDelay(200, 400);
  return MOCK_MY_WATCHED_AUCTIONS;
}
