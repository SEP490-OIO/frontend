/**
 * AuctionCard — displays one auction in the Browse grid.
 *
 * Reusable across Browse page, Home page featured section,
 * and future Watchlist page. Shows:
 * - Product image with overlay badges (featured, sealed)
 * - Category + condition tags
 * - Pricing (current price, starting price, buy-now)
 * - Countdown timer or "Ended" label
 * - Bid count + qualified bidder count
 * - Seller name, rating, and verification badge
 * - Status badge (color-coded via Ant Design Tag)
 *
 * Clicking the card navigates to /auction/:id.
 */

import { Card, Tag, Space, Typography, Rate } from 'antd';
import {
  ClockCircleOutlined,
  FireOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AuctionListItem } from '@/types';
import { formatVND, formatCountdown, CONDITION_KEYS, STATUS_KEYS, STATUS_COLORS } from '@/utils/formatters';

const { Text, Paragraph } = Typography;

interface AuctionCardProps {
  auction: AuctionListItem;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isLive = auction.status === 'active' || auction.status === 'qualifying';
  const isSealed = auction.auctionType === 'sealed';

  return (
    <Card
      hoverable
      onClick={() => navigate(`/auction/${auction.id}`)}
      styles={{
        body: { padding: 16 },
      }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Product image */}
          <img
            alt={auction.itemTitle}
            src={auction.primaryImageUrl ?? 'https://picsum.photos/400/400?grayscale'}
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Overlay badges — top-left corner */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
            {auction.isFeatured && (
              <Tag color="gold" icon={<FireOutlined />}>
                {t('auction.featured')}
              </Tag>
            )}
            {isSealed && (
              <Tag color="purple" icon={<LockOutlined />}>
                {t('auction.typeSealed')}
              </Tag>
            )}
          </div>

          {/* Status badge — top-right corner */}
          <div style={{ position: 'absolute', top: 8, right: 8, maxWidth: '50%' }}>
            <Tag color={STATUS_COLORS[auction.status]} style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t(STATUS_KEYS[auction.status])}
            </Tag>
          </div>
        </div>
      }
    >
      {/* ─── Category + Condition tags ──────────────────────────── */}
      <Space size={4} wrap style={{ marginBottom: 8 }}>
        {auction.categoryName && (
          <Tag>{auction.categoryName}</Tag>
        )}
        <Tag>{t(CONDITION_KEYS[auction.itemCondition])}</Tag>
      </Space>

      {/* ─── Item title (max 2 lines) ──────────────────────────── */}
      <Paragraph
        strong
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: 8, fontSize: 15, lineHeight: 1.4 }}
      >
        {auction.itemTitle}
      </Paragraph>

      {/* ─── Pricing ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        {isSealed && !auction.currentPrice ? (
          // Sealed auction — price is hidden
          <>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('auction.startingPrice')}
            </Text>
            <div>
              <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
                {formatVND(auction.startingPrice)}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('auction.sealedPrice')}
            </Text>
          </>
        ) : (
          // Open auction or ended sealed auction — show prices
          <>
            {auction.currentPrice !== null ? (
              <>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('auction.currentPrice')}
                </Text>
                <div>
                  <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
                    {formatVND(auction.currentPrice)}
                  </Text>
                </div>
              </>
            ) : (
              <>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('auction.startingPrice')}
                </Text>
                <div>
                  <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
                    {formatVND(auction.startingPrice)}
                  </Text>
                </div>
              </>
            )}
          </>
        )}

        {/* Buy Now price (if available) */}
        {auction.buyNowPrice !== null && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('auction.buyNow')}: {formatVND(auction.buyNowPrice)}
          </Text>
        )}
      </div>

      {/* ─── Countdown + Stats ─────────────────────────────────── */}
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={4}>
          <ClockCircleOutlined style={{ color: isLive ? '#52c41a' : '#999' }} />
          <Text type={isLive ? undefined : 'secondary'} style={{ fontSize: 13 }}>
            {isLive ? formatCountdown(auction.endTime, t) : t('auction.ended')}
          </Text>
        </Space>
      </div>

      <Space size={[16, 4]} wrap style={{ marginBottom: 8, fontSize: 12 }}>
        <Text type="secondary">
          {t('auction.bidCount', { count: auction.bidCount })}
        </Text>
        <Text type="secondary">
          {t('auction.qualifiedCount', { count: auction.qualifiedCount })}
        </Text>
      </Space>

      {/* ─── Seller info (clickable → seller profile) ────────── */}
      <div
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click (auction detail)
          navigate(`/seller/${auction.sellerId}`);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            navigate(`/seller/${auction.sellerId}`);
          }
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0',
          paddingTop: 8,
          cursor: 'pointer',
        }}
        title={t('sellerProfile.viewSellerProfile')}
      >
        <Space size={4}>
          <Text style={{ fontSize: 13 }}>{auction.sellerName}</Text>
          <Rate disabled defaultValue={1} count={1} style={{ fontSize: 12 }} />
          <Text style={{ fontSize: 12 }}>{auction.sellerRating}</Text>
        </Space>

        {auction.sellerTrustScore >= 80 && (
          <SafetyCertificateOutlined
            style={{ color: '#52c41a', fontSize: 16 }}
            title={t('auction.verified')}
          />
        )}
      </div>
    </Card>
  );
}
