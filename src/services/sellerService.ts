/**
 * Seller service — data fetching for the Seller Profile page.
 *
 * TEMPORARY: Returns mock data. When the real API is ready,
 * only the function bodies change — hooks and pages stay the same.
 *
 * Endpoints this will map to:
 * - GET /sellers/:userId        → getSellerProfile
 * - GET /sellers/:userId/auctions → getSellerAuctions
 * - GET /sellers/:userId/reviews  → getSellerReviews
 */

import type { SellerProfileDetail, SellerReview, AuctionListItem } from '@/types';
import { mockDelay } from './mock/helpers';
import { getMockSellerProfile, getMockSellerReviews, getMockSellerAuctions } from './mock/sellers';

/** Fetch a seller's full profile (profile + rating summary) */
export async function getSellerProfile(userId: string): Promise<SellerProfileDetail | null> {
  await mockDelay();
  return getMockSellerProfile(userId);
}

/** Fetch a seller's auction listings */
export async function getSellerAuctions(userId: string): Promise<AuctionListItem[]> {
  await mockDelay();
  return getMockSellerAuctions(userId);
}

/** Fetch reviews left by buyers about a seller */
export async function getSellerReviews(userId: string): Promise<SellerReview[]> {
  await mockDelay();
  return getMockSellerReviews(userId);
}
