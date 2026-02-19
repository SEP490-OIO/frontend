/**
 * Bidding mutation hooks — TanStack Query wrappers for write operations.
 *
 * This is the project's first use of useMutation. Each hook:
 * 1. Calls the corresponding service function (mock for now)
 * 2. Invalidates relevant query caches on success so the UI refreshes
 *
 * Read queries live in useAuctions.ts; write mutations live here.
 * This separation keeps the hooks organized by concern.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  joinAuction,
  placeBid,
  submitSealedBid,
  buyNow,
  toggleWatch,
} from '@/services/auctionService';

/**
 * Mutation: Join auction qualification by paying deposit.
 * On success, refreshes auction detail (shows new deposit status)
 * and wallet (shows reduced available balance).
 */
export function useJoinAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: string) => joinAuction(auctionId),
    onSuccess: (_data, auctionId) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
    },
  });
}

/**
 * Mutation: Place a bid on an open auction.
 * On success, refreshes both auction detail and bid history.
 */
export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, amount }: { auctionId: string; amount: number }) =>
      placeBid(auctionId, amount),
    onSuccess: (_data, { auctionId }) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctionBids', auctionId] });
    },
  });
}

/**
 * Mutation: Submit a sealed bid (one-time, irreversible).
 * Only invalidates auction detail (no bid history visible for sealed).
 */
export function useSubmitSealedBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, amount }: { auctionId: string; amount: number }) =>
      submitSealedBid(auctionId, amount),
    onSuccess: (_data, { auctionId }) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    },
  });
}

/**
 * Mutation: Buy-now — instant purchase at buyNowPrice.
 * Refreshes auction detail and wallet balance.
 */
export function useBuyNow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: string) => buyNow(auctionId),
    onSuccess: (_data, auctionId) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
    },
  });
}

/**
 * Mutation: Toggle watch/unwatch for an auction.
 * Only invalidates auction detail (updates isWatching + watchCount).
 */
export function useToggleWatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      auctionId,
      currentlyWatching,
    }: {
      auctionId: string;
      currentlyWatching: boolean;
    }) => toggleWatch(auctionId, currentlyWatching),
    onSuccess: (_data, { auctionId }) => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
    },
  });
}
