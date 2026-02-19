/**
 * BidForm — manual bid placement for open (English) auctions.
 *
 * Shows:
 * - User status badge (winning = green, outbid = orange)
 * - Minimum next bid amount
 * - InputNumber with VND formatter/parser (established pattern from Wallet)
 * - Quick-bid buttons: +1x, +2x, +3x increment (auto-fill amount)
 * - "Đặt giá" submit button
 *
 * Disabled if user is not qualified (shows "not qualified" message).
 *
 * The VND InputNumber pattern uses InputNumber<number> generic to avoid
 * the TypeScript literal type inference issue with min={0}.
 */

import { useState } from 'react';
import { Button, InputNumber, Flex, Typography, Alert, message } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Auction } from '@/types';
import { CURRENT_USER_ID } from '@/services/mock/auctionDetails';
import { usePlaceBid } from '@/hooks/useBidding';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { formatVND } from '@/utils/formatters';

const { Text } = Typography;

interface BidFormProps {
  auction: Auction;
}

export function BidForm({ auction }: BidFormProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const placeBid = usePlaceBid();

  // Calculate minimum next bid
  const currentPrice = auction.currentPrice ?? auction.startingPrice;
  const minNextBid = currentPrice + auction.bidIncrement;

  const [amount, setAmount] = useState<number | null>(minNextBid);

  const isQualified = auction.currentUserDeposit !== null;

  // Check if the current user is currently winning
  // The latest bid with status 'winning' belongs to the current user
  const latestWinningBid = auction.recentBids.find((b) => b.status === 'winning');
  const isWinning = latestWinningBid?.bidderId === CURRENT_USER_ID;

  // ─── Not qualified: show warning ──────────────────────────────
  if (!isQualified) {
    return (
      <Alert
        type="warning"
        showIcon
        message={t('bidding.notQualified')}
      />
    );
  }

  // ─── Winning/outbid status banner ─────────────────────────────
  const handleSubmit = () => {
    if (!amount || amount < minNextBid) {
      message.warning(
        t('bidding.bidAmountTooLow', { min: formatVND(minNextBid) })
      );
      return;
    }

    placeBid.mutate(
      { auctionId: auction.id, amount },
      {
        onSuccess: (data) => {
          message.success(
            t('bidding.bidSuccess', { amount: formatVND(data.newCurrentPrice) })
          );
          // Update the input to the next minimum after placing a bid
          setAmount(data.newCurrentPrice + auction.bidIncrement);
        },
        onError: () => {
          message.error(t('common.error'));
        },
      }
    );
  };

  // Quick bid amounts: +1x, +2x, +3x the bid increment
  const quickBids = [1, 2, 3].map((multiplier) => ({
    label: `+${multiplier}x`,
    amount: currentPrice + auction.bidIncrement * multiplier,
  }));

  return (
    <Flex vertical gap={12}>
      {/* Winning/outbid status */}
      {isWinning ? (
        <Alert
          type="success"
          showIcon
          message={t('bidding.youAreWinning')}
          style={{ padding: '6px 12px' }}
        />
      ) : (
        <Alert
          type="warning"
          showIcon
          message={t('bidding.youAreOutbid')}
          style={{ padding: '6px 12px' }}
        />
      )}

      {/* Minimum next bid display */}
      <Flex justify="space-between" align="center">
        <Text type="secondary">{t('bidding.minNextBid')}</Text>
        <Text strong>{formatVND(minNextBid)}</Text>
      </Flex>

      {/* Bid amount input */}
      <InputNumber<number>
        style={{ width: '100%' }}
        size="large"
        value={amount}
        onChange={(val) => setAmount(val)}
        formatter={(value) =>
          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        parser={(value) => Number(value?.replace(/\./g, '') ?? 0)}
        addonAfter="VND"
        min={minNextBid}
        step={auction.bidIncrement}
        placeholder={formatVND(minNextBid)}
      />

      {/* Quick-bid buttons — wraps on narrow screens */}
      <div>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
          {t('bidding.quickBid')}:
        </Text>
        <Flex wrap="wrap" gap={8}>
          {quickBids.map((qb) => (
            <Button
              key={qb.label}
              size="small"
              onClick={() => setAmount(qb.amount)}
            >
              {isMobile ? qb.label : `${qb.label} (${formatVND(qb.amount)})`}
            </Button>
          ))}
        </Flex>
      </div>

      {/* Submit button */}
      <Button
        type="primary"
        size="large"
        block
        onClick={handleSubmit}
        loading={placeBid.isPending}
        disabled={!amount || amount < minNextBid}
      >
        {placeBid.isPending
          ? t('bidding.placing')
          : `${t('bidding.placeBid')} ${amount ? formatVND(amount) : ''}`}
      </Button>
    </Flex>
  );
}
