/**
 * SealedBidForm — one-time sealed bid submission.
 *
 * Sealed auctions work differently from open auctions:
 * - Each bidder submits exactly ONE bid (irreversible)
 * - Bids are hidden until the auction ends
 * - No bid history is visible during the auction
 *
 * This component shows:
 * - Warning alert explaining the one-bid rule
 * - InputNumber with VND formatter (min = startingPrice)
 * - Popconfirm before submission (since it's irreversible)
 * - After submission: checkmark + success message
 *
 * The "already submitted" state is detected by checking if the user
 * has a deposit AND the mock returns a sealed bid status.
 * In production, the API would return a `hasSubmittedSealedBid` field.
 */

import { useState } from 'react';
import { Button, InputNumber, Flex, Typography, Alert, Popconfirm, Result, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Auction } from '@/types';
import { useSubmitSealedBid } from '@/hooks/useBidding';
import { formatVND } from '@/utils/formatters';

const { Text } = Typography;

interface SealedBidFormProps {
  auction: Auction;
}

export function SealedBidForm({ auction }: SealedBidFormProps) {
  const { t } = useTranslation();
  const submitBid = useSubmitSealedBid();

  const [amount, setAmount] = useState<number | null>(auction.startingPrice);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isQualified = auction.currentUserDeposit !== null;

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

  // ─── Already submitted: show confirmation ─────────────────────
  if (hasSubmitted) {
    return (
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title={t('bidding.sealedBidSubmitted')}
        subTitle={t('bidding.sealedBidWaiting')}
        style={{ padding: '16px 0' }}
      />
    );
  }

  // ─── Bid form ─────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!amount || amount < auction.startingPrice) return;

    submitBid.mutate(
      { auctionId: auction.id, amount },
      {
        onSuccess: () => {
          setHasSubmitted(true);
          message.success(t('bidding.sealedBidSubmitted'));
        },
        onError: () => {
          message.error(t('common.error'));
        },
      }
    );
  };

  return (
    <Flex vertical gap={12}>
      {/* Warning: one bid only */}
      <Alert
        type="warning"
        showIcon
        message={t('bidding.sealedBidTitle')}
        description={t('bidding.sealedBidWarning')}
      />

      {/* Bid amount input */}
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
          {t('bidding.yourBidAmount')}
        </Text>
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
          min={auction.startingPrice}
          step={auction.bidIncrement}
          placeholder={formatVND(auction.startingPrice)}
        />
      </div>

      {/* Submit with confirmation */}
      <Popconfirm
        title={t('bidding.sealedBidTitle')}
        description={t('bidding.sealedBidConfirm', {
          amount: amount ? formatVND(amount) : '',
        })}
        onConfirm={handleConfirm}
        okText={t('bidding.submitSealedBid')}
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: submitBid.isPending }}
      >
        <Button
          type="primary"
          size="large"
          block
          disabled={!amount || amount < auction.startingPrice}
        >
          {submitBid.isPending
            ? t('bidding.submitting')
            : t('bidding.submitSealedBid')}
        </Button>
      </Popconfirm>
    </Flex>
  );
}
