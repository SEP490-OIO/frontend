/**
 * Mock user & seller data — realistic Vietnamese profiles.
 *
 * TEMPORARY: Will be replaced by real API endpoints.
 *
 * Includes a few mock sellers with varying trust scores and ratings
 * to demonstrate the 3-layer verification system on auction cards.
 */

import type { SellerSummary } from '@/types';
import { mockId } from './helpers';

/** Mock sellers that appear on auction cards and detail pages */
export const MOCK_SELLERS: SellerSummary[] = [
  {
    userId: mockId('user', 1),
    storeName: 'TechViet Store',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=TV',
    ratingAverage: 4.8,
    ratingCount: 156,
    trustScore: 92.5,
    status: 'verified',
  },
  {
    userId: mockId('user', 2),
    storeName: 'Sneaker Sài Gòn',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=SS',
    ratingAverage: 4.5,
    ratingCount: 89,
    trustScore: 85.0,
    status: 'verified',
  },
  {
    userId: mockId('user', 3),
    storeName: 'Collector Hà Nội',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=CH',
    ratingAverage: 4.9,
    ratingCount: 234,
    trustScore: 96.0,
    status: 'verified',
  },
  {
    userId: mockId('user', 4),
    storeName: 'Đồ Cũ Đà Nẵng',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=DD',
    ratingAverage: 3.8,
    ratingCount: 23,
    trustScore: 62.0,
    status: 'pending',
  },
  {
    userId: mockId('user', 5),
    storeName: 'Audio Passion',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AP',
    ratingAverage: 4.7,
    ratingCount: 67,
    trustScore: 88.5,
    status: 'verified',
  },
];

/** Get a seller by user ID */
export function getMockSeller(userId: string): SellerSummary | null {
  return MOCK_SELLERS.find((s) => s.userId === userId) ?? null;
}
