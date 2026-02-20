/**
 * SellerReviewsList — reviews section of the Seller Profile page.
 *
 * Two parts:
 * 1. Rating overview: star breakdown with progress bars + category averages
 * 2. Individual review cards with ratings, text, images, seller responses
 *
 * Responsive: overview switches from horizontal to vertical on mobile.
 * Review cards stack vertically on all breakpoints.
 */

import { Card, Rate, Progress, Typography, Flex, Avatar, Tag, Image, Divider, Empty, Row, Col } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SellerReview, SellerRatingSummary } from '@/types';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { formatRelativeTime } from '@/utils/formatters';

const { Text, Paragraph, Title } = Typography;

interface SellerReviewsListProps {
  reviews: SellerReview[];
  ratingSummary: SellerRatingSummary;
}

// ─── Rating Overview ──────────────────────────────────────────────

function RatingOverview({ summary }: { summary: SellerRatingSummary }) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  const starCounts = [
    { stars: 5, count: summary.rating5Count },
    { stars: 4, count: summary.rating4Count },
    { stars: 3, count: summary.rating3Count },
    { stars: 2, count: summary.rating2Count },
    { stars: 1, count: summary.rating1Count },
  ];

  const categoryRatings = [
    { label: t('sellerProfile.avgCommunication'), value: summary.avgCommunication },
    { label: t('sellerProfile.avgShippingSpeed'), value: summary.avgShippingSpeed },
    { label: t('sellerProfile.avgItemAccuracy'), value: summary.avgItemAccuracy },
  ];

  return (
    <Row gutter={[24, 16]}>
      {/* Left: overall rating + stars */}
      <Col xs={24} md={8}>
        <Flex vertical align="center" gap={8}>
          <Title level={2} style={{ margin: 0, color: '#faad14' }}>
            {summary.averageRating.toFixed(1)}
          </Title>
          <Rate disabled allowHalf value={summary.averageRating} />
          <Text type="secondary">
            {t('sellerProfile.reviewCount', { count: summary.totalReviews })}
          </Text>
        </Flex>
      </Col>

      {/* Middle: star distribution bars */}
      <Col xs={24} md={8}>
        {starCounts.map(({ stars, count }) => {
          const percent = summary.totalReviews > 0
            ? (count / summary.totalReviews) * 100
            : 0;
          return (
            <Flex key={stars} align="center" gap={8} style={{ marginBottom: 4 }}>
              <Text style={{ width: 50, fontSize: 12, textAlign: 'right' }}>
                {stars} {t('sellerProfile.star')}
              </Text>
              <Progress
                percent={percent}
                showInfo={false}
                size="small"
                strokeColor="#faad14"
                style={{ flex: 1, margin: 0 }}
              />
              <Text type="secondary" style={{ width: 30, fontSize: 12 }}>
                {count}
              </Text>
            </Flex>
          );
        })}
      </Col>

      {/* Right: category averages */}
      <Col xs={24} md={8}>
        <Flex vertical gap={isMobile ? 8 : 12}>
          {categoryRatings.map((cat) => (
            <Flex key={cat.label} justify="space-between" align="center">
              <Text type="secondary" style={{ fontSize: 13 }}>
                {cat.label}
              </Text>
              <Flex align="center" gap={4}>
                <Rate disabled allowHalf value={cat.value} style={{ fontSize: 12 }} />
                <Text strong style={{ fontSize: 13 }}>
                  {cat.value.toFixed(1)}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Col>
    </Row>
  );
}

// ─── Individual Review Card ───────────────────────────────────────

function ReviewCard({ review }: { review: SellerReview }) {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
      {/* Reviewer header */}
      <Flex gap={12} align="flex-start">
        <Avatar
          src={review.reviewerAvatarUrl}
          icon={<UserOutlined />}
          size={40}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + date + verified badge */}
          <Flex align="center" gap={8} wrap="wrap">
            <Text strong>{review.reviewerName}</Text>
            {review.isVerifiedPurchase && (
              <Tag
                icon={<CheckCircleOutlined />}
                color="green"
                style={{ fontSize: 11 }}
              >
                {t('sellerProfile.verifiedPurchase')}
              </Tag>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatRelativeTime(review.createdAt, t)}
            </Text>
          </Flex>

          {/* Star rating */}
          <Rate
            disabled
            value={review.overallRating}
            style={{ fontSize: 14, marginTop: 4 }}
          />

          {/* Review title + comment */}
          {review.title && (
            <Text strong style={{ display: 'block', marginTop: 8 }}>
              {review.title}
            </Text>
          )}
          {review.comment && (
            <Paragraph style={{ marginTop: 4, marginBottom: 8 }}>
              {review.comment}
            </Paragraph>
          )}

          {/* Review images */}
          {review.images.length > 0 && (
            <Flex gap={8} wrap="wrap" style={{ marginBottom: 8 }}>
              <Image.PreviewGroup>
                {review.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.imageUrl}
                    width={64}
                    height={64}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ))}
              </Image.PreviewGroup>
            </Flex>
          )}

          {/* Helpful counts */}
          <Flex gap={16} style={{ fontSize: 12 }}>
            <Flex align="center" gap={4}>
              <LikeOutlined style={{ color: '#999' }} />
              <Text type="secondary">{review.helpfulCount}</Text>
            </Flex>
            <Flex align="center" gap={4}>
              <DislikeOutlined style={{ color: '#999' }} />
              <Text type="secondary">{review.notHelpfulCount}</Text>
            </Flex>
          </Flex>

          {/* Seller response */}
          {review.sellerResponse && (
            <div
              style={{
                marginTop: 12,
                padding: '12px 16px',
                background: '#f6f6f6',
                borderRadius: 8,
                borderLeft: '3px solid #1677ff',
              }}
            >
              <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
                <MessageOutlined style={{ color: '#1677ff', fontSize: 12 }} />
                <Text strong style={{ fontSize: 12, color: '#1677ff' }}>
                  {t('sellerProfile.sellerResponse')}
                </Text>
              </Flex>
              <Text style={{ fontSize: 13 }}>{review.sellerResponse}</Text>
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export function SellerReviewsList({ reviews, ratingSummary }: SellerReviewsListProps) {
  const { t } = useTranslation();

  return (
    <Card title={t('sellerProfile.reviews')}>
      {/* Rating overview section */}
      <RatingOverview summary={ratingSummary} />

      <Divider />

      {/* Review list */}
      {reviews.length === 0 ? (
        <Empty description={t('sellerProfile.noReviews')} />
      ) : (
        reviews.map((review, index) => (
          <div key={review.id}>
            <ReviewCard review={review} />
            {index < reviews.length - 1 && <Divider style={{ margin: 0 }} />}
          </div>
        ))
      )}
    </Card>
  );
}
