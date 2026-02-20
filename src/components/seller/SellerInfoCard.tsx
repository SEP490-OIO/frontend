/**
 * SellerInfoCard — header section of the Seller Profile page.
 *
 * Displays seller identity: avatar, store name, verification badge,
 * location, member since date, and store description.
 *
 * Desktop: horizontal layout (avatar left, info right).
 * Mobile: stacked vertically with centered avatar.
 */

import { Card, Avatar, Typography, Tag, Flex } from 'antd';
import {
  SafetyCertificateOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SellerProfileDetail } from '@/types';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { Text, Paragraph, Title } = Typography;

interface SellerInfoCardProps {
  seller: SellerProfileDetail;
}

/** Verification status badge — color + i18n key */
function getVerificationBadge(
  status: string,
  t: (key: string) => string,
): { color: string; label: string } {
  const map: Record<string, { color: string; label: string }> = {
    verified: { color: 'green', label: t('sellerProfile.verified') },
    pending: { color: 'orange', label: t('sellerProfile.pending') },
    rejected: { color: 'red', label: t('sellerProfile.rejected') },
  };
  return map[status] ?? { color: 'default', label: status };
}

export function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { profile } = seller;
  const badge = getVerificationBadge(profile.status, t);

  const memberSinceDate = new Date(profile.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <Card>
      <Flex
        gap={isMobile ? 16 : 24}
        align={isMobile ? 'center' : 'flex-start'}
        vertical={isMobile}
      >
        {/* Avatar */}
        <Avatar
          src={seller.avatarUrl}
          icon={<ShopOutlined />}
          size={isMobile ? 80 : 96}
          style={{ flexShrink: 0 }}
        />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, textAlign: isMobile ? 'center' : 'left' }}>
          {/* Store name + verification badge */}
          <Flex
            align="center"
            gap={8}
            wrap="wrap"
            justify={isMobile ? 'center' : 'flex-start'}
          >
            <Title level={4} style={{ margin: 0 }}>
              {profile.storeName}
            </Title>
            {profile.status === 'verified' && (
              <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            )}
            <Tag color={badge.color}>{badge.label}</Tag>
          </Flex>

          {/* Location + member since */}
          <Flex
            gap={16}
            wrap="wrap"
            justify={isMobile ? 'center' : 'flex-start'}
            style={{ marginTop: 8 }}
          >
            {(profile.city || profile.region) && (
              <Flex align="center" gap={4}>
                <EnvironmentOutlined style={{ color: '#999' }} />
                <Text type="secondary">
                  {[profile.region, profile.city].filter(Boolean).join(', ')}
                </Text>
              </Flex>
            )}
            <Flex align="center" gap={4}>
              <CalendarOutlined style={{ color: '#999' }} />
              <Text type="secondary">
                {t('sellerProfile.memberSince', { date: memberSinceDate })}
              </Text>
            </Flex>
            {profile.verifiedAt && (
              <Flex align="center" gap={4}>
                <ClockCircleOutlined style={{ color: '#999' }} />
                <Text type="secondary">
                  {t('sellerProfile.verifiedSince', {
                    date: new Date(profile.verifiedAt).toLocaleDateString('vi-VN'),
                  })}
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Store description */}
          {profile.storeDescription && (
            <Paragraph
              type="secondary"
              style={{ marginTop: 12, marginBottom: 0 }}
              ellipsis={{ rows: 3, expandable: 'collapsible' }}
            >
              {profile.storeDescription}
            </Paragraph>
          )}
        </div>
      </Flex>
    </Card>
  );
}
