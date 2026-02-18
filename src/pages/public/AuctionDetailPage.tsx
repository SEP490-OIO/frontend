/**
 * AuctionDetailPage — the most important page in the platform.
 *
 * Layer 1 (current): Read-only display of all auction info.
 * Layer 2 (future): Interactive actions (bid, deposit, buy now, watch).
 *
 * Layout:
 * - Desktop: two-column (image gallery left, pricing panel right)
 * - Mobile: single column, stacked vertically
 *
 * Handles all auction states: qualifying, active (open/sealed),
 * ended, sold, cancelled, failed.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Row,
  Col,
  Card,
  Tag,
  Space,
  Typography,
  Spin,
  Flex,
  Result,
  Button,
  Descriptions,
  Avatar,
  Rate,
  Divider,
  Tooltip,
} from 'antd';
import {
  ClockCircleOutlined,
  FireOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  HeartOutlined,
  UserOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAuction, useAuctionBids } from '@/hooks/useAuctions';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import {
  formatVND,
  formatCountdown,
  CONDITION_KEYS,
  STATUS_KEYS,
  STATUS_COLORS,
} from '@/utils/formatters';
import { ImageGallery } from '@/components/auction/ImageGallery';
import { BidHistoryList } from '@/components/auction/BidHistoryList';

const { Title, Text, Paragraph } = Typography;

export function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  const { data: auction, isLoading } = useAuction(id);
  const { data: bids } = useAuctionBids(id);

  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 80 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // Not found
  if (!auction) {
    return (
      <Result
        status="404"
        title={t('auctionDetail.notFound')}
        subTitle={t('auctionDetail.notFoundDescription')}
        extra={
          <Button type="primary" onClick={() => navigate('/browse')}>
            {t('auctionDetail.backToBrowse')}
          </Button>
        }
      />
    );
  }

  const isActive = auction.status === 'active';
  const isQualifying = auction.status === 'qualifying';
  const isEnded = ['ended', 'sold', 'cancelled', 'failed', 'emergency_stopped'].includes(
    auction.status
  );
  const isSealed = auction.auctionType === 'sealed';

  // Determine which time to show countdown for
  const countdownTarget = isQualifying
    ? auction.qualificationEndTime ?? auction.startTime
    : auction.actualEndTime ?? auction.endTime;

  // Reserve price status
  const hasReserve = auction.reservePrice !== null;
  const reserveMet =
    hasReserve && auction.currentPrice !== null
      ? auction.currentPrice >= auction.reservePrice!
      : false;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/browse')}
        style={{ marginBottom: 16 }}
      >
        {t('auctionDetail.backToBrowse')}
      </Button>

      {/* ─── Main two-column layout ──────────────────────────────── */}
      <Row gutter={[24, 24]}>
        {/* Left column: Image gallery */}
        <Col xs={24} md={14}>
          <ImageGallery
            images={auction.item?.images ?? []}
            title={auction.item?.title ?? ''}
          />
        </Col>

        {/* Right column: Pricing panel + seller info */}
        <Col xs={24} md={10}>
          <div style={isMobile ? undefined : { position: 'sticky', top: 24 }}>
            {/* Pricing panel */}
            <Card style={{ marginBottom: 16 }}>
              {/* Status + type badges */}
              <Space size={8} style={{ marginBottom: 12 }}>
                <Tag color={STATUS_COLORS[auction.status]}>
                  {t(STATUS_KEYS[auction.status])}
                </Tag>
                {isSealed && (
                  <Tag icon={<LockOutlined />}>{t('auction.typeSealed')}</Tag>
                )}
                {auction.isFeatured && (
                  <Tag color="gold" icon={<FireOutlined />}>
                    {t('auction.featured')}
                  </Tag>
                )}
              </Space>

              {/* Item title */}
              <Title level={isMobile ? 4 : 3} style={{ marginTop: 0, marginBottom: 8 }}>
                {auction.item?.title}
              </Title>

              {/* Category + condition + verification */}
              <Space size={4} wrap style={{ marginBottom: 16 }}>
                {auction.item?.categoryName && (
                  <Tag>{auction.item.categoryName}</Tag>
                )}
                {auction.item?.condition && (
                  <Tag color="blue">
                    {t(CONDITION_KEYS[auction.item.condition])}
                  </Tag>
                )}
                {auction.item?.verificationStatus === 'verified' && (
                  <Tag color="green" icon={<SafetyCertificateOutlined />}>
                    {t('auction.verified')}
                  </Tag>
                )}
              </Space>

              <Divider style={{ margin: '12px 0' }} />

              {/* Pricing section */}
              <div style={{ marginBottom: 16 }}>
                {/* Current price (large) or sealed message */}
                {isSealed && isActive ? (
                  <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
                    <LockOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />
                    <Text style={{ fontSize: 22, fontWeight: 700, color: '#8c8c8c' }}>
                      {t('auction.sealedPrice')}
                    </Text>
                  </Flex>
                ) : (
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {auction.currentPrice
                        ? t('auction.currentPrice')
                        : t('auction.startingPrice')}
                    </Text>
                    <div>
                      <Text style={{ fontSize: 28, fontWeight: 700, color: '#1677ff' }}>
                        {formatVND(auction.currentPrice ?? auction.startingPrice)}
                      </Text>
                    </div>
                  </div>
                )}

                {/* Starting price (shown if current price differs) */}
                {auction.currentPrice && (
                  <Flex justify="space-between" style={{ marginBottom: 4 }}>
                    <Text type="secondary">{t('auction.startingPrice')}</Text>
                    <Text>{formatVND(auction.startingPrice)}</Text>
                  </Flex>
                )}

                {/* Bid increment */}
                <Flex justify="space-between" style={{ marginBottom: 4 }}>
                  <Text type="secondary">{t('auctionDetail.bidIncrement')}</Text>
                  <Text>{formatVND(auction.bidIncrement)}</Text>
                </Flex>

                {/* Buy now price */}
                {auction.buyNowPrice && (
                  <Flex justify="space-between" style={{ marginBottom: 4 }}>
                    <Text type="secondary">{t('auction.buyNow')}</Text>
                    <Text strong style={{ color: '#fa8c16' }}>
                      {formatVND(auction.buyNowPrice)}
                    </Text>
                  </Flex>
                )}

                {/* Reserve price indicator */}
                {hasReserve && (
                  <Flex justify="space-between" style={{ marginBottom: 4 }}>
                    <Text type="secondary">{t('auctionDetail.reservePrice')}</Text>
                    <Tag color={reserveMet ? 'green' : 'orange'}>
                      {reserveMet
                        ? t('auctionDetail.reserveMet')
                        : t('auctionDetail.reserveNotMet')}
                    </Tag>
                  </Flex>
                )}
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* Deposit info */}
              {auction.depositAmount && (
                <Flex justify="space-between" style={{ marginBottom: 12 }}>
                  <Text type="secondary">{t('auctionDetail.depositInfo')}</Text>
                  <Text>
                    {t('auctionDetail.depositAmount', {
                      percentage: auction.depositPercentage,
                      amount: formatVND(auction.depositAmount),
                    })}
                  </Text>
                </Flex>
              )}

              {/* Countdown */}
              {!isEnded && (
                <Flex
                  align="center"
                  gap={8}
                  style={{
                    padding: '8px 12px',
                    background: isActive ? '#f6ffed' : '#fff7e6',
                    borderRadius: 6,
                    marginBottom: 12,
                  }}
                >
                  <ClockCircleOutlined
                    style={{ color: isActive ? '#52c41a' : '#fa8c16' }}
                  />
                  <Text>
                    {isQualifying
                      ? `${t('auction.endsIn')}: `
                      : `${t('auction.endsIn')}: `}
                    <Text strong>
                      {formatCountdown(countdownTarget, t)}
                    </Text>
                  </Text>
                </Flex>
              )}

              {/* Stats row */}
              <Flex wrap="wrap" gap={16} style={{ marginBottom: 12 }}>
                <Tooltip title={t('auction.bidCount', { count: auction.bidCount })}>
                  <Text type="secondary">
                    {t('auction.bidCount', { count: auction.bidCount })}
                  </Text>
                </Tooltip>
                <Tooltip
                  title={t('auction.qualifiedCount', { count: auction.qualifiedCount })}
                >
                  <Text type="secondary">
                    <UserOutlined style={{ marginRight: 4 }} />
                    {t('auction.qualifiedCount', { count: auction.qualifiedCount })}
                  </Text>
                </Tooltip>
                <Text type="secondary">
                  <EyeOutlined style={{ marginRight: 4 }} />
                  {t('auctionDetail.viewCount', { count: auction.viewCount })}
                </Text>
                <Text type="secondary">
                  <HeartOutlined style={{ marginRight: 4 }} />
                  {t('auctionDetail.watchCount', { count: auction.watchCount })}
                </Text>
              </Flex>

              {/* Anti-sniping info */}
              {auction.autoExtend && (
                <Flex align="center" gap={4}>
                  <ThunderboltOutlined style={{ color: '#faad14' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('auctionDetail.antiSniping')} ·{' '}
                    {t('auctionDetail.extensionMinutes', {
                      minutes: auction.extensionMinutes,
                    })}
                  </Text>
                </Flex>
              )}

              {/* Minimum participants warning */}
              {isQualifying &&
                auction.qualifiedCount < auction.minimumParticipants && (
                  <Text type="warning" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                    {t('auctionDetail.minimumParticipants', {
                      count: auction.minimumParticipants,
                    })}
                  </Text>
                )}
            </Card>

            {/* Seller info card */}
            {auction.seller && (
              <Card size="small">
                <Flex align="center" gap={12}>
                  <Avatar
                    src={auction.seller.avatarUrl}
                    icon={<ShopOutlined />}
                    size={48}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Flex align="center" gap={8}>
                      <Text strong style={{ fontSize: 15 }}>
                        {auction.seller.storeName}
                      </Text>
                      {auction.seller.status === 'verified' && (
                        <SafetyCertificateOutlined
                          style={{ color: '#52c41a', fontSize: 14 }}
                        />
                      )}
                    </Flex>
                    <Flex align="center" gap={8} style={{ marginTop: 4 }}>
                      <Rate
                        disabled
                        allowHalf
                        value={auction.seller.ratingAverage}
                        style={{ fontSize: 12 }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('auctionDetail.ratingCount', {
                          count: auction.seller.ratingCount,
                        })}
                      </Text>
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t('auctionDetail.sellerTrustScore')}:{' '}
                      <Text strong style={{ fontSize: 12 }}>
                        {auction.seller.trustScore}%
                      </Text>
                    </Text>
                  </div>
                </Flex>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* ─── Full-width sections below ───────────────────────────── */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Item description */}
        <Col xs={24}>
          <Card title={t('auctionDetail.description')}>
            {auction.item?.description ? (
              <Paragraph
                ellipsis={{
                  rows: 6,
                  expandable: 'collapsible',
                  symbol: (expanded: boolean) =>
                    expanded ? t('common.close') : '...',
                }}
              >
                {auction.item.description}
              </Paragraph>
            ) : (
              <Text type="secondary">{t('auctionDetail.noDescription')}</Text>
            )}
          </Card>
        </Col>

        {/* Item attributes */}
        {auction.item?.attributes && auction.item.attributes.length > 0 && (
          <Col xs={24}>
            <Card title={t('auctionDetail.attributes')}>
              <Descriptions
                bordered
                size="small"
                column={isMobile ? 1 : 2}
              >
                {auction.item.attributes.map((attr) => (
                  <Descriptions.Item key={attr.id} label={attr.attributeName}>
                    {attr.attributeValue}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Bid history */}
        <Col xs={24}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <span>{t('auctionDetail.bidHistory')}</span>
                <Tag>{auction.bidCount}</Tag>
              </Flex>
            }
          >
            <BidHistoryList
              bids={bids ?? []}
              auctionType={auction.auctionType}
              isActive={isActive}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
