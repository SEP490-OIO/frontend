/**
 * Mock seller profile data — full profiles, reviews, and rating summaries.
 *
 * TEMPORARY: Will be replaced by real API endpoints.
 *
 * Extends the lightweight MOCK_SELLERS (SellerSummary) from users.ts
 * with full SellerProfile data, buyer reviews, and rating breakdowns
 * needed for the Seller Profile page.
 */

import type { SellerProfile, SellerProfileDetail, SellerReview, SellerRatingSummary } from '@/types';
import type { AuctionListItem } from '@/types';
import { mockId, mockDate } from './helpers';
import { MOCK_SELLERS } from './users';
import { MOCK_AUCTION_LIST } from './auctions';

// ─── Full Seller Profiles ────────────────────────────────────────────

/** Full SellerProfile objects matching the 5 sellers from users.ts */
const MOCK_SELLER_PROFILES: SellerProfile[] = [
  {
    id: mockId('seller-profile', 1),
    userId: mockId('user', 1),
    storeName: 'TechViet Store',
    storeDescription:
      'Chuyên cung cấp các sản phẩm công nghệ chính hãng: điện thoại, laptop, tai nghe, gaming. ' +
      'Cam kết hàng chính hãng 100%, bảo hành đầy đủ. Giao hàng nhanh toàn quốc.',
    status: 'verified',
    verifiedAt: mockDate(-720), // ~30 days ago
    city: 'TP. Hồ Chí Minh',
    region: 'Quận 1',
    totalSalesCount: 245,
    totalSalesAmount: 1_850_000_000,
    successfulSalesCount: 238,
    ratingAverage: 4.8,
    ratingCount: 156,
    disputeCount: 3,
    disputeRate: 0.0122,
    responseRate: 0.97,
    trustScore: 92.5,
    trustScoreUpdatedAt: mockDate(-2),
    createdAt: mockDate(-4320), // ~6 months ago
    modifiedAt: mockDate(-2),
  },
  {
    id: mockId('seller-profile', 2),
    userId: mockId('user', 2),
    storeName: 'Sneaker Sài Gòn',
    storeDescription:
      'Chuyên giày thể thao authentic từ các thương hiệu Nike, Adidas, New Balance, Converse. ' +
      'Nhập trực tiếp từ store chính hãng. Hỗ trợ check legit miễn phí.',
    status: 'verified',
    verifiedAt: mockDate(-1440), // ~60 days ago
    city: 'TP. Hồ Chí Minh',
    region: 'Quận 3',
    totalSalesCount: 132,
    totalSalesAmount: 890_000_000,
    successfulSalesCount: 127,
    ratingAverage: 4.5,
    ratingCount: 89,
    disputeCount: 4,
    disputeRate: 0.0303,
    responseRate: 0.92,
    trustScore: 85.0,
    trustScoreUpdatedAt: mockDate(-3),
    createdAt: mockDate(-5040), // ~7 months ago
    modifiedAt: mockDate(-3),
  },
  {
    id: mockId('seller-profile', 3),
    userId: mockId('user', 3),
    storeName: 'Collector Hà Nội',
    storeDescription:
      'Sưu tầm và bán các món đồ collectible: card game, figure, mô hình, đĩa nhạc vinyl. ' +
      'Đóng gói cẩn thận, bảo quản tốt. Hỗ trợ tư vấn cho người mới chơi.',
    status: 'verified',
    verifiedAt: mockDate(-2160), // ~90 days ago
    city: 'Hà Nội',
    region: 'Hoàn Kiếm',
    totalSalesCount: 389,
    totalSalesAmount: 2_340_000_000,
    successfulSalesCount: 385,
    ratingAverage: 4.9,
    ratingCount: 234,
    disputeCount: 2,
    disputeRate: 0.0051,
    responseRate: 0.99,
    trustScore: 96.0,
    trustScoreUpdatedAt: mockDate(-1),
    createdAt: mockDate(-8640), // ~12 months ago
    modifiedAt: mockDate(-1),
  },
  {
    id: mockId('seller-profile', 4),
    userId: mockId('user', 4),
    storeName: 'Đồ Cũ Đà Nẵng',
    storeDescription:
      'Bán đồ cũ chất lượng tốt: gia dụng, nhạc cụ, xe đạp, đồ thể thao. ' +
      'Giá hợp lý, thương lượng thoải mái. Ship COD toàn quốc.',
    status: 'pending',
    verifiedAt: null,
    city: 'Đà Nẵng',
    region: 'Hải Châu',
    totalSalesCount: 45,
    totalSalesAmount: 320_000_000,
    successfulSalesCount: 41,
    ratingAverage: 3.8,
    ratingCount: 23,
    disputeCount: 5,
    disputeRate: 0.1111,
    responseRate: 0.78,
    trustScore: 62.0,
    trustScoreUpdatedAt: mockDate(-5),
    createdAt: mockDate(-2880), // ~4 months ago
    modifiedAt: mockDate(-5),
  },
  {
    id: mockId('seller-profile', 5),
    userId: mockId('user', 5),
    storeName: 'Audio Passion',
    storeDescription:
      'Đam mê âm thanh, chuyên loa và tai nghe cao cấp: Marshall, Sony, Bose, JBL. ' +
      'Tư vấn setup hệ thống âm thanh. Bảo hành chính hãng.',
    status: 'verified',
    verifiedAt: mockDate(-960), // ~40 days ago
    city: 'TP. Hồ Chí Minh',
    region: 'Quận 7',
    totalSalesCount: 98,
    totalSalesAmount: 650_000_000,
    successfulSalesCount: 95,
    ratingAverage: 4.7,
    ratingCount: 67,
    disputeCount: 2,
    disputeRate: 0.0204,
    responseRate: 0.95,
    trustScore: 88.5,
    trustScoreUpdatedAt: mockDate(-2),
    createdAt: mockDate(-3600), // ~5 months ago
    modifiedAt: mockDate(-2),
  },
];

// ─── Rating Summaries ────────────────────────────────────────────────

const MOCK_RATING_SUMMARIES: SellerRatingSummary[] = [
  {
    sellerId: mockId('user', 1),
    totalReviews: 156,
    averageRating: 4.8,
    rating5Count: 112,
    rating4Count: 30,
    rating3Count: 10,
    rating2Count: 3,
    rating1Count: 1,
    avgCommunication: 4.9,
    avgShippingSpeed: 4.7,
    avgItemAccuracy: 4.8,
  },
  {
    sellerId: mockId('user', 2),
    totalReviews: 89,
    averageRating: 4.5,
    rating5Count: 52,
    rating4Count: 22,
    rating3Count: 10,
    rating2Count: 4,
    rating1Count: 1,
    avgCommunication: 4.6,
    avgShippingSpeed: 4.3,
    avgItemAccuracy: 4.5,
  },
  {
    sellerId: mockId('user', 3),
    totalReviews: 234,
    averageRating: 4.9,
    rating5Count: 198,
    rating4Count: 28,
    rating3Count: 6,
    rating2Count: 2,
    rating1Count: 0,
    avgCommunication: 4.95,
    avgShippingSpeed: 4.85,
    avgItemAccuracy: 4.9,
  },
  {
    sellerId: mockId('user', 4),
    totalReviews: 23,
    averageRating: 3.8,
    rating5Count: 8,
    rating4Count: 5,
    rating3Count: 5,
    rating2Count: 3,
    rating1Count: 2,
    avgCommunication: 3.6,
    avgShippingSpeed: 3.5,
    avgItemAccuracy: 4.0,
  },
  {
    sellerId: mockId('user', 5),
    totalReviews: 67,
    averageRating: 4.7,
    rating5Count: 42,
    rating4Count: 18,
    rating3Count: 5,
    rating2Count: 2,
    rating1Count: 0,
    avgCommunication: 4.8,
    avgShippingSpeed: 4.6,
    avgItemAccuracy: 4.7,
  },
];

// ─── Mock Reviews ────────────────────────────────────────────────────

/** 10 mock reviews spread across sellers (mostly #1 and #3 who have the most auctions) */
const MOCK_SELLER_REVIEWS: SellerReview[] = [
  // ─── Reviews for TechViet Store (seller #1) ───────────────────
  {
    id: mockId('review', 1),
    orderId: mockId('order', 1),
    auctionId: mockId('auction', 8),
    reviewerId: mockId('user', 10),
    reviewerName: 'Nguyễn V. An',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=NVA',
    sellerId: mockId('user', 1),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 5,
    itemAccuracyRating: 5,
    title: 'Hàng đúng mô tả, giao nhanh!',
    comment:
      'Mua PS5 Slim trên sàn, seller đóng gói rất cẩn thận. Hàng nguyên seal, giao hàng chỉ 2 ngày. ' +
      'Sẽ ủng hộ shop dài dài.',
    images: [
      { id: mockId('review-img', 1), imageUrl: 'https://picsum.photos/seed/rev1a/200/200', sortOrder: 0 },
      { id: mockId('review-img', 2), imageUrl: 'https://picsum.photos/seed/rev1b/200/200', sortOrder: 1 },
    ],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn bạn đã ủng hộ shop! Chúc bạn sử dụng vui vẻ nhé 🎮',
    sellerRespondedAt: mockDate(-45 * 24),
    helpfulCount: 12,
    notHelpfulCount: 0,
    createdAt: mockDate(-46 * 24),
  },
  {
    id: mockId('review', 2),
    orderId: mockId('order', 2),
    auctionId: mockId('auction', 1),
    reviewerId: mockId('user', 11),
    reviewerName: 'Trần T. Bình',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=TTB',
    sellerId: mockId('user', 1),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 4,
    itemAccuracyRating: 5,
    title: 'iPhone chất lượng tuyệt vời',
    comment: 'Máy đẹp như mới, đầy đủ phụ kiện. Seller trả lời tin nhắn rất nhanh. Giao hàng hơi lâu 1 chút nhưng chấp nhận được.',
    images: [],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: null,
    sellerRespondedAt: null,
    helpfulCount: 8,
    notHelpfulCount: 1,
    createdAt: mockDate(-30 * 24),
  },
  {
    id: mockId('review', 3),
    orderId: mockId('order', 3),
    auctionId: mockId('auction', 3),
    reviewerId: mockId('user', 14),
    reviewerName: 'Lê M. Cường',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=LMC',
    sellerId: mockId('user', 1),
    overallRating: 4,
    communicationRating: 4,
    shippingSpeedRating: 4,
    itemAccuracyRating: 4,
    title: 'Tạm ổn',
    comment: 'MacBook hoạt động tốt, pin còn 92%. Có vài vết xước nhỏ trên vỏ nhưng không ảnh hưởng gì. Giá hợp lý.',
    images: [
      { id: mockId('review-img', 3), imageUrl: 'https://picsum.photos/seed/rev3a/200/200', sortOrder: 0 },
    ],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn bạn đã đánh giá. Vết xước đã được ghi chú trong mô tả sản phẩm ạ. Rất vui vì bạn hài lòng với máy!',
    sellerRespondedAt: mockDate(-20 * 24),
    helpfulCount: 5,
    notHelpfulCount: 2,
    createdAt: mockDate(-21 * 24),
  },

  // ─── Reviews for Sneaker Sài Gòn (seller #2) ─────────────────
  {
    id: mockId('review', 4),
    orderId: mockId('order', 4),
    auctionId: mockId('auction', 2),
    reviewerId: mockId('user', 12),
    reviewerName: 'Phạm H. Dũng',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=PHD',
    sellerId: mockId('user', 2),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 5,
    itemAccuracyRating: 5,
    title: 'Giày authentic 100%, quá đẹp!',
    comment: 'Jordan 1 OG đẹp xuất sắc, box nguyên vẹn. Shop check legit miễn phí, rất tận tâm. Recommend mạnh!',
    images: [
      { id: mockId('review-img', 4), imageUrl: 'https://picsum.photos/seed/rev4a/200/200', sortOrder: 0 },
      { id: mockId('review-img', 5), imageUrl: 'https://picsum.photos/seed/rev4b/200/200', sortOrder: 1 },
    ],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn anh! Lần sau ghé shop mình giảm thêm nhé 🙏',
    sellerRespondedAt: mockDate(-14 * 24),
    helpfulCount: 15,
    notHelpfulCount: 0,
    createdAt: mockDate(-15 * 24),
  },

  // ─── Reviews for Collector Hà Nội (seller #3) ─────────────────
  {
    id: mockId('review', 5),
    orderId: mockId('order', 5),
    auctionId: mockId('auction', 4),
    reviewerId: mockId('user', 15),
    reviewerName: 'Hoàng T. Emm',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=HTE',
    sellerId: mockId('user', 3),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 5,
    itemAccuracyRating: 5,
    title: 'Bộ Pokémon Cards tuyệt vời',
    comment:
      'Seller rất am hiểu về collectible, tư vấn nhiệt tình. Cards được đóng trong sleeve + toploader, ' +
      'bảo quản hoàn hảo. Sẽ quay lại mua thêm!',
    images: [],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn bạn! Tuần sau shop nhập thêm bộ mới, nhớ ghé xem nhé!',
    sellerRespondedAt: mockDate(-10 * 24),
    helpfulCount: 20,
    notHelpfulCount: 0,
    createdAt: mockDate(-11 * 24),
  },
  {
    id: mockId('review', 6),
    orderId: mockId('order', 6),
    auctionId: mockId('auction', 7),
    reviewerId: mockId('user', 16),
    reviewerName: 'Vũ Đ. Phong',
    reviewerAvatarUrl: null,
    sellerId: mockId('user', 3),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 4,
    itemAccuracyRating: 5,
    title: 'Vinyl Trịnh Công Sơn quá chất',
    comment: 'Đĩa còn rất tốt, âm thanh trong trẻo. Đóng gói chắc chắn, an tâm khi ship. Seller chuyên nghiệp!',
    images: [
      { id: mockId('review-img', 6), imageUrl: 'https://picsum.photos/seed/rev6a/200/200', sortOrder: 0 },
    ],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: null,
    sellerRespondedAt: null,
    helpfulCount: 9,
    notHelpfulCount: 0,
    createdAt: mockDate(-8 * 24),
  },
  {
    id: mockId('review', 7),
    orderId: mockId('order', 7),
    auctionId: mockId('auction', 11),
    reviewerId: mockId('user', 17),
    reviewerName: 'Đinh K. Giang',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=DKG',
    sellerId: mockId('user', 3),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 5,
    itemAccuracyRating: 5,
    title: 'Gundam MG chất lượng cao',
    comment: 'Kit hoàn hảo, runner nguyên vẹn. Shop tư vấn thêm dụng cụ lắp ráp rất hữu ích. Top seller!',
    images: [],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn bạn! Chúc build vui vẻ 🔧',
    sellerRespondedAt: mockDate(-4 * 24),
    helpfulCount: 7,
    notHelpfulCount: 0,
    createdAt: mockDate(-5 * 24),
  },

  // ─── Reviews for Đồ Cũ Đà Nẵng (seller #4) ──────────────────
  {
    id: mockId('review', 8),
    orderId: mockId('order', 8),
    auctionId: mockId('auction', 9),
    reviewerId: mockId('user', 18),
    reviewerName: 'Trương V. Hải',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=TVH',
    sellerId: mockId('user', 4),
    overallRating: 3,
    communicationRating: 3,
    shippingSpeedRating: 2,
    itemAccuracyRating: 4,
    title: 'Xe ổn nhưng giao chậm',
    comment: 'Xe đạp Giant đúng mô tả, tuy nhiên giao hàng mất gần 1 tuần. Seller trả lời tin nhắn hơi chậm.',
    images: [],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Xin lỗi bạn về thời gian giao hàng. Do đợt đó mình bận nên xử lý hơi trễ. Sẽ cải thiện ạ!',
    sellerRespondedAt: mockDate(-60 * 24),
    helpfulCount: 4,
    notHelpfulCount: 1,
    createdAt: mockDate(-62 * 24),
  },

  // ─── Reviews for Audio Passion (seller #5) ────────────────────
  {
    id: mockId('review', 9),
    orderId: mockId('order', 9),
    auctionId: mockId('auction', 5),
    reviewerId: mockId('user', 19),
    reviewerName: 'Ngô A. Khoa',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=NAK',
    sellerId: mockId('user', 5),
    overallRating: 5,
    communicationRating: 5,
    shippingSpeedRating: 5,
    itemAccuracyRating: 5,
    title: 'Sony XM5 đỉnh cao!',
    comment: 'Tai nghe chống ồn siêu tốt, seller tư vấn setup EQ rất chi tiết. Hàng sealed, giao 1 ngày. 10/10!',
    images: [
      { id: mockId('review-img', 7), imageUrl: 'https://picsum.photos/seed/rev9a/200/200', sortOrder: 0 },
    ],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: 'Cảm ơn bạn nhiều! Cần hỗ trợ gì thêm về EQ cứ nhắn mình nhé 🎧',
    sellerRespondedAt: mockDate(-25 * 24),
    helpfulCount: 11,
    notHelpfulCount: 0,
    createdAt: mockDate(-26 * 24),
  },
  {
    id: mockId('review', 10),
    orderId: mockId('order', 10),
    auctionId: mockId('auction', 10),
    reviewerId: mockId('user', 20),
    reviewerName: 'Bùi T. Linh',
    reviewerAvatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=BTL',
    sellerId: mockId('user', 5),
    overallRating: 4,
    communicationRating: 5,
    shippingSpeedRating: 4,
    itemAccuracyRating: 4,
    title: 'Loa Marshall tốt, có vài vết trầy nhỏ',
    comment: 'Loa Stanmore II âm thanh hay, bass ấm. Có vài vết trầy xước nhỏ trên mặt loa nhưng seller đã ghi chú từ trước. Tổng thể hài lòng.',
    images: [],
    isVerifiedPurchase: true,
    status: 'published',
    sellerResponse: null,
    sellerRespondedAt: null,
    helpfulCount: 3,
    notHelpfulCount: 0,
    createdAt: mockDate(-18 * 24),
  },
];

// ─── Helper Functions ────────────────────────────────────────────────

/** Build a SellerProfileDetail composite from profile + rating summary */
function buildProfileDetail(profile: SellerProfile): SellerProfileDetail {
  const seller = MOCK_SELLERS.find((s) => s.userId === profile.userId);
  const summary = MOCK_RATING_SUMMARIES.find((s) => s.sellerId === profile.userId);

  return {
    profile,
    displayName: profile.storeName ?? 'Unknown Seller',
    avatarUrl: seller?.avatarUrl ?? null,
    ratingSummary: summary ?? {
      sellerId: profile.userId,
      totalReviews: 0,
      averageRating: 0,
      rating5Count: 0,
      rating4Count: 0,
      rating3Count: 0,
      rating2Count: 0,
      rating1Count: 0,
      avgCommunication: 0,
      avgShippingSpeed: 0,
      avgItemAccuracy: 0,
    },
  };
}

/** Get full seller profile detail by userId */
export function getMockSellerProfile(userId: string): SellerProfileDetail | null {
  const profile = MOCK_SELLER_PROFILES.find((p) => p.userId === userId);
  if (!profile) return null;
  return buildProfileDetail(profile);
}

/** Get reviews for a specific seller by userId */
export function getMockSellerReviews(userId: string): SellerReview[] {
  return MOCK_SELLER_REVIEWS.filter((r) => r.sellerId === userId);
}

/** Get auctions belonging to a seller (non-ended ones first) */
export function getMockSellerAuctions(userId: string): AuctionListItem[] {
  return MOCK_AUCTION_LIST.filter((a) => a.sellerId === userId);
}
