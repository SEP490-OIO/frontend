/**
 * BidHistoryList — scrollable list of all bids for an auction.
 *
 * Shows bidder name, amount, relative time, and auto-bid badge.
 * The winning bid is highlighted with a green left border.
 *
 * For sealed auctions in active state, bids are hidden —
 * shows a message instead.
 */

import { List, Tag, Typography, Flex, Empty } from 'antd';
import {
  TrophyOutlined,
  ThunderboltOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Bid } from '@/types';
import type { AuctionType } from '@/types/enums';
import { formatVND, formatRelativeTime } from '@/utils/formatters';

const { Text } = Typography;

interface BidHistoryListProps {
  bids: Bid[];
  auctionType: AuctionType;
  /** Whether the auction is still active (determines sealed bid visibility) */
  isActive: boolean;
}

export function BidHistoryList({
  bids,
  auctionType,
  isActive,
}: BidHistoryListProps) {
  const { t } = useTranslation();

  // Sealed auctions: hide bids while active
  if (auctionType === 'sealed' && isActive) {
    return (
      <Flex
        align="center"
        justify="center"
        gap={8}
        style={{ padding: '32px 0', color: '#8c8c8c' }}
      >
        <LockOutlined />
        <Text type="secondary">{t('auctionDetail.sealedBidsHidden')}</Text>
      </Flex>
    );
  }

  // No bids
  if (bids.length === 0) {
    return <Empty description={t('auctionDetail.noBids')} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
      <List
        dataSource={bids}
        renderItem={(bid) => {
          const isWinning = bid.status === 'winning' || bid.status === 'won';

          return (
            <List.Item
              style={{
                borderLeft: isWinning ? '3px solid #52c41a' : '3px solid transparent',
                paddingLeft: 12,
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                style={{ width: '100%' }}
                wrap="wrap"
                gap={4}
              >
                {/* Left: bidder name + badges */}
                <Flex align="center" gap={8}>
                  <Text strong={isWinning}>
                    {bid.bidderName ?? '***'}
                  </Text>
                  {isWinning && (
                    <Tag color="green" icon={<TrophyOutlined />}>
                      {t('auctionDetail.winningBid')}
                    </Tag>
                  )}
                  {bid.isAutoBid && (
                    <Tag icon={<ThunderboltOutlined />}>
                      {t('auctionDetail.autoBidBadge')}
                    </Tag>
                  )}
                </Flex>

                {/* Right: amount + time */}
                <Flex align="center" gap={16}>
                  <Text strong style={{ fontSize: 15 }}>
                    {formatVND(bid.amount)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {formatRelativeTime(bid.createdAt, t)}
                  </Text>
                </Flex>
              </Flex>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
