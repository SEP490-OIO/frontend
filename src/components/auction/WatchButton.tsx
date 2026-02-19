/**
 * WatchButton — toggles watch/unwatch for an auction.
 *
 * Shows a heart icon (filled when watching) with the watch count.
 * Uses optimistic UI: the heart fills/unfills immediately on click,
 * even before the server confirms. If the mutation fails, TanStack Query
 * refetches the real state via cache invalidation.
 *
 * Why a standalone component? The watch action appears in both the
 * BiddingPanel and potentially in AuctionCard later, so it's reusable.
 */

import { Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useToggleWatch } from '@/hooks/useBidding';

interface WatchButtonProps {
  auctionId: string;
  isWatching: boolean;
  watchCount: number;
}

export function WatchButton({ auctionId, isWatching, watchCount }: WatchButtonProps) {
  const { t } = useTranslation();
  const toggleWatch = useToggleWatch();

  const handleClick = () => {
    toggleWatch.mutate(
      { auctionId, currentlyWatching: isWatching },
      {
        onError: () => {
          message.error(t('common.error'));
        },
      }
    );
  };

  return (
    <Button
      type="text"
      icon={
        isWatching ? (
          <HeartFilled style={{ color: '#ff4d4f' }} />
        ) : (
          <HeartOutlined />
        )
      }
      onClick={handleClick}
      loading={toggleWatch.isPending}
    >
      {isWatching ? t('bidding.watching') : t('bidding.watch')}
      {watchCount > 0 && ` (${watchCount})`}
    </Button>
  );
}
