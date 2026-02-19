/**
 * TanStack Query hooks for the My Bids page.
 *
 * Uses separate query keys from the dashboard hooks because
 * My Bids returns a larger dataset (e.g., includes sealed auctions
 * in active bids that dashboard omits). Both cached independently.
 *
 * Pattern follows useDashboard.ts exactly.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getMyActiveBidsFull,
  getMyEndedBids,
  getMyWatchedAuctions,
} from '@/services/myBidsService';

/** All auctions where user has deposit or active bid */
export function useMyActiveBidsFull() {
  return useQuery({
    queryKey: ['myBids', 'active'],
    queryFn: getMyActiveBidsFull,
  });
}

/** Ended auctions the user participated in */
export function useMyEndedBids() {
  return useQuery({
    queryKey: ['myBids', 'ended'],
    queryFn: getMyEndedBids,
  });
}

/** Auctions user is watching (heart only, no deposit) */
export function useMyWatchedAuctions() {
  return useQuery({
    queryKey: ['myBids', 'watching'],
    queryFn: getMyWatchedAuctions,
  });
}
