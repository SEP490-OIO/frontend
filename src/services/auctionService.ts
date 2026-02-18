/**
 * Auction service — data fetching functions for auctions & bidding.
 *
 * Currently returns MOCK DATA. When the backend API is ready,
 * replace the function bodies with real Axios calls.
 * The function signatures and return types stay the same,
 * so NO changes are needed in the UI components.
 *
 * Example swap:
 *   BEFORE: const data = filterAndPaginate(MOCK_AUCTION_LIST, filters);
 *   AFTER:  const { data } = await api.get('/auctions', { params: filters });
 */

import type {
  Auction,
  AuctionListItem,
  AuctionFilters,
  PaginatedResponse,
  Bid,
  Category,
} from '@/types';
import { MOCK_AUCTION_LIST } from './mock/auctions';
import { getMockAuctionDetail, getMockAuctionBids } from './mock/auctionDetails';
import { MOCK_CATEGORIES, MOCK_CATEGORIES_FLAT } from './mock/categories';
import { mockDelay } from './mock/helpers';

// ─── Auction List (Browse page) ─────────────────────────────────

/**
 * Fetches a paginated, filterable list of auctions.
 * Used by the Browse/Catalog page.
 */
export async function getAuctions(
  filters: AuctionFilters = {}
): Promise<PaginatedResponse<AuctionListItem>> {
  await mockDelay();

  let result = [...MOCK_AUCTION_LIST];

  // ─── Apply filters ────────────────────────────────────────────
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.itemTitle.toLowerCase().includes(q) ||
        (a.sellerName?.toLowerCase().includes(q) ?? false)
    );
  }

  if (filters.categoryId) {
    // Build a set of matching category names.
    // If the selected category is a parent, include all its children.
    const parentCat = MOCK_CATEGORIES.find(
      (c) => c.id === filters.categoryId
    );

    const matchNames = new Set<string>();
    if (parentCat) {
      // Parent selected — match parent name + all child names
      matchNames.add(parentCat.name);
      parentCat.children?.forEach((child) => matchNames.add(child.name));
    } else {
      // Child selected — match only that child's name
      const childCat = MOCK_CATEGORIES_FLAT.find(
        (c) => c.id === filters.categoryId
      );
      if (childCat) matchNames.add(childCat.name);
    }

    if (matchNames.size > 0) {
      result = result.filter((a) => a.categoryName !== null && matchNames.has(a.categoryName));
    }
  }

  if (filters.auctionType) {
    result = result.filter((a) => a.auctionType === filters.auctionType);
  }

  if (filters.status) {
    const statuses = Array.isArray(filters.status)
      ? filters.status
      : [filters.status];
    result = result.filter((a) => statuses.includes(a.status));
  }

  if (filters.verifiedOnly) {
    result = result.filter((a) => a.verificationStatus === 'verified');
  }

  if (filters.buyNowOnly) {
    result = result.filter((a) => a.buyNowPrice !== null);
  }

  if (filters.condition) {
    const conditions = Array.isArray(filters.condition)
      ? filters.condition
      : [filters.condition];
    result = result.filter((a) => conditions.includes(a.itemCondition));
  }

  if (filters.priceMin !== undefined) {
    result = result.filter(
      (a) => (a.currentPrice ?? a.startingPrice) >= filters.priceMin!
    );
  }

  if (filters.priceMax !== undefined) {
    result = result.filter(
      (a) => (a.currentPrice ?? a.startingPrice) <= filters.priceMax!
    );
  }

  // ─── Sort ─────────────────────────────────────────────────────
  const sortBy = filters.sortBy ?? 'endTime';
  const sortOrder = filters.sortOrder ?? 'asc';
  const direction = sortOrder === 'asc' ? 1 : -1;

  result.sort((a, b) => {
    switch (sortBy) {
      case 'currentPrice':
        return (
          ((a.currentPrice ?? a.startingPrice) -
            (b.currentPrice ?? b.startingPrice)) *
          direction
        );
      case 'bidCount':
        return (a.bidCount - b.bidCount) * direction;
      case 'createdAt':
      case 'startTime':
        return (
          (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) *
          direction
        );
      case 'endTime':
      default:
        return (
          (new Date(a.endTime).getTime() - new Date(b.endTime).getTime()) *
          direction
        );
    }
  });

  // ─── Paginate ─────────────────────────────────────────────────
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 8;
  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

// ─── Single Auction Detail ──────────────────────────────────────

/**
 * Fetches a single auction by ID — returns the full Auction type
 * with nested item, seller, bids, and deposit info.
 */
export async function getAuctionById(
  id: string
): Promise<Auction | null> {
  await mockDelay();
  return getMockAuctionDetail(id);
}

// ─── Bid History ────────────────────────────────────────────────

/**
 * Fetches bid history for an auction.
 * For sealed auctions, this returns empty until the auction ends.
 */
export async function getAuctionBids(auctionId: string): Promise<Bid[]> {
  await mockDelay();
  return getMockAuctionBids(auctionId);
}

// ─── Categories ─────────────────────────────────────────────────

/** Fetches the category tree (top-level with nested children) */
export async function getCategories(): Promise<Category[]> {
  await mockDelay(100, 300);
  return MOCK_CATEGORIES;
}

/** Fetches a flat list of all categories */
export async function getCategoriesFlat(): Promise<Category[]> {
  await mockDelay(100, 300);
  return MOCK_CATEGORIES_FLAT;
}
