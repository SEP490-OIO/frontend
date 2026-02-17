/**
 * Mock category data — product categories for the auction platform.
 *
 * TEMPORARY: Will be replaced by GET /categories API endpoint.
 *
 * Categories are everyday consumer goods only:
 * Electronics, Fashion, Collectibles, Home & Lifestyle, Sports & Hobbies
 */

import type { Category } from '@/types';
import { mockId } from './helpers';

export const MOCK_CATEGORIES: Category[] = [
  // ─── Electronics ──────────────────────────────────────────────
  {
    id: mockId('cat', 1),
    parentId: null,
    name: 'Điện tử',
    slug: 'dien-tu',
    description: 'Điện thoại, laptop, máy ảnh, âm thanh, gaming',
    iconUrl: null,
    isActive: true,
    sortOrder: 1,
    children: [
      {
        id: mockId('cat', 11),
        parentId: mockId('cat', 1),
        name: 'Điện thoại',
        slug: 'dien-thoai',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: mockId('cat', 12),
        parentId: mockId('cat', 1),
        name: 'Laptop & Máy tính',
        slug: 'laptop-may-tinh',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: mockId('cat', 13),
        parentId: mockId('cat', 1),
        name: 'Máy ảnh',
        slug: 'may-anh',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 3,
      },
      {
        id: mockId('cat', 14),
        parentId: mockId('cat', 1),
        name: 'Âm thanh',
        slug: 'am-thanh',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 4,
      },
      {
        id: mockId('cat', 15),
        parentId: mockId('cat', 1),
        name: 'Gaming',
        slug: 'gaming',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 5,
      },
    ],
  },

  // ─── Fashion & Accessories ────────────────────────────────────
  {
    id: mockId('cat', 2),
    parentId: null,
    name: 'Thời trang',
    slug: 'thoi-trang',
    description: 'Đồng hồ, giày dép, túi xách, quần áo',
    iconUrl: null,
    isActive: true,
    sortOrder: 2,
    children: [
      {
        id: mockId('cat', 21),
        parentId: mockId('cat', 2),
        name: 'Đồng hồ',
        slug: 'dong-ho',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: mockId('cat', 22),
        parentId: mockId('cat', 2),
        name: 'Giày dép',
        slug: 'giay-dep',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: mockId('cat', 23),
        parentId: mockId('cat', 2),
        name: 'Túi xách',
        slug: 'tui-xach',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 3,
      },
    ],
  },

  // ─── Collectibles ─────────────────────────────────────────────
  {
    id: mockId('cat', 3),
    parentId: null,
    name: 'Sưu tầm',
    slug: 'suu-tam',
    description: 'Mô hình, thẻ bài, đĩa nhạc, tranh in',
    iconUrl: null,
    isActive: true,
    sortOrder: 3,
    children: [
      {
        id: mockId('cat', 31),
        parentId: mockId('cat', 3),
        name: 'Mô hình & Figure',
        slug: 'mo-hinh-figure',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: mockId('cat', 32),
        parentId: mockId('cat', 3),
        name: 'Thẻ bài sưu tầm',
        slug: 'the-bai-suu-tam',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: mockId('cat', 33),
        parentId: mockId('cat', 3),
        name: 'Đĩa nhạc Vinyl',
        slug: 'dia-nhac-vinyl',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 3,
      },
    ],
  },

  // ─── Home & Lifestyle ─────────────────────────────────────────
  {
    id: mockId('cat', 4),
    parentId: null,
    name: 'Nhà cửa & Đời sống',
    slug: 'nha-cua-doi-song',
    description: 'Loa, đồ gia dụng, nội thất nhỏ',
    iconUrl: null,
    isActive: true,
    sortOrder: 4,
    children: [
      {
        id: mockId('cat', 41),
        parentId: mockId('cat', 4),
        name: 'Loa & Thiết bị âm thanh',
        slug: 'loa-thiet-bi-am-thanh',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: mockId('cat', 42),
        parentId: mockId('cat', 4),
        name: 'Đồ gia dụng',
        slug: 'do-gia-dung',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },

  // ─── Sports & Hobbies ─────────────────────────────────────────
  {
    id: mockId('cat', 5),
    parentId: null,
    name: 'Thể thao & Sở thích',
    slug: 'the-thao-so-thich',
    description: 'Xe đạp, nhạc cụ, dụng cụ thể thao',
    iconUrl: null,
    isActive: true,
    sortOrder: 5,
    children: [
      {
        id: mockId('cat', 51),
        parentId: mockId('cat', 5),
        name: 'Xe đạp',
        slug: 'xe-dap',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: mockId('cat', 52),
        parentId: mockId('cat', 5),
        name: 'Nhạc cụ',
        slug: 'nhac-cu',
        description: null,
        iconUrl: null,
        isActive: true,
        sortOrder: 2,
      },
    ],
  },
];

/**
 * Flat list of all categories (parents + children) for lookups.
 * Useful for filter dropdowns and category name resolution.
 */
export const MOCK_CATEGORIES_FLAT: Category[] = MOCK_CATEGORIES.flatMap(
  (parent) => [parent, ...(parent.children ?? [])]
);

/** Quick lookup: category ID → category name */
export function getCategoryName(categoryId: string): string | null {
  return MOCK_CATEGORIES_FLAT.find((c) => c.id === categoryId)?.name ?? null;
}
