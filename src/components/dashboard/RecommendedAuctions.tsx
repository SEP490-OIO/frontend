/**
 * RecommendedAuctions — featured auction cards on the dashboard.
 *
 * Reuses the existing AuctionCard component in a responsive grid.
 * Shows up to 4 featured/active auctions to drive engagement.
 */

import { Row, Col, Typography, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import type { AuctionListItem } from '@/types';
import { AuctionCard } from '@/components/auction/AuctionCard';

const { Title } = Typography;

interface RecommendedAuctionsProps {
  auctions: AuctionListItem[];
  isLoading: boolean;
}

export function RecommendedAuctions({
  auctions,
  isLoading,
}: RecommendedAuctionsProps) {
  const { t } = useTranslation();

  if (!isLoading && auctions.length === 0) return null;

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        {t('dashboard.recommended')}
      </Title>

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((key) => (
            <Col xs={24} sm={12} xl={6} key={key}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[16, 16]}>
          {auctions.map((auction) => (
            <Col xs={24} sm={12} xl={6} key={auction.id}>
              <AuctionCard auction={auction} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
