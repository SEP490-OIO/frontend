/**
 * SellerProfilePage — public seller storefront page.
 *
 * Accessible at /seller/:id (no login required).
 * Shows seller identity, trust metrics, active listings, and buyer reviews.
 *
 * Layout: single column, stacked sections (unlike AuctionDetail's 2-column).
 * Fetches 3 parallel queries: profile, auctions, reviews.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flex, Spin, Result, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSellerProfile, useSellerAuctions, useSellerReviews } from '@/hooks/useSeller';
import { SellerInfoCard } from '@/components/seller/SellerInfoCard';
import { SellerStats } from '@/components/seller/SellerStats';
import { SellerListings } from '@/components/seller/SellerListings';
import { SellerReviewsList } from '@/components/seller/SellerReviewsList';

export function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 3 parallel queries — all disabled until id is available
  const { data: seller, isLoading: profileLoading } = useSellerProfile(id);
  const { data: auctions } = useSellerAuctions(id);
  const { data: reviews } = useSellerReviews(id);

  // Loading state
  if (profileLoading) {
    return (
      <Flex justify="center" style={{ padding: 80 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // Not found
  if (!seller) {
    return (
      <Result
        status="404"
        title={t('sellerProfile.notFound')}
        subTitle={t('sellerProfile.notFoundDescription')}
        extra={
          <Button type="primary" onClick={() => navigate('/browse')}>
            {t('sellerProfile.backToBrowse')}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        {t('common.back')}
      </Button>

      {/* Stacked sections with vertical spacing */}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Section 1: Seller identity card */}
        <SellerInfoCard seller={seller} />

        {/* Section 2: Trust metrics grid */}
        <SellerStats seller={seller} />

        {/* Section 3: Active listings */}
        <SellerListings auctions={auctions ?? []} />

        {/* Section 4: Reviews with rating breakdown */}
        <SellerReviewsList
          reviews={reviews ?? []}
          ratingSummary={seller.ratingSummary}
        />
      </Space>
    </div>
  );
}
