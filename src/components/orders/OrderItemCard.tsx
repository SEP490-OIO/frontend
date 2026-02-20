/**
 * OrderItemCard — item info + price breakdown for the order detail page.
 *
 * Shows item image, title, link to original auction,
 * and a table of price components (item + shipping + fee + total).
 */

import { Card, Flex, Typography, Descriptions, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { Order } from '@/types';
import { formatVND } from '@/utils/formatters';

const { Text } = Typography;

interface OrderItemCardProps {
  order: Order;
}

export function OrderItemCard({ order }: OrderItemCardProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  return (
    <Card title={t('orders.columnItem')} size="small">
      {/* Item info */}
      <Flex gap={16} align="start" wrap="wrap">
        <img
          src={order.item?.primaryImageUrl ?? 'https://picsum.photos/80/80?grayscale'}
          alt={order.item?.title ?? ''}
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: 8,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ fontSize: 15 }}>
            {order.item?.title}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('orders.orderNumber')}: {order.orderNumber}
            </Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('orders.sellerInfo')}: {order.seller?.storeName}
            </Text>
          </div>
          <Button
            type="link"
            size="small"
            icon={<ShoppingOutlined />}
            onClick={() => navigate(`/auction/${order.auctionId}`)}
            style={{ padding: 0, marginTop: 4 }}
          >
            {t('orders.viewAuction')}
          </Button>
        </div>
      </Flex>

      {/* Price breakdown */}
      <Descriptions
        bordered
        size="small"
        column={1}
        style={{ marginTop: 16 }}
        title={t('orders.priceBreakdown')}
      >
        <Descriptions.Item label={t('orders.itemPrice')}>
          {formatVND(order.itemPrice)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orders.shippingFee')}>
          {formatVND(order.shippingFee)}
        </Descriptions.Item>
        <Descriptions.Item label={t('orders.platformFee')}>
          {formatVND(order.platformFee)}
        </Descriptions.Item>
        {order.taxAmount > 0 && (
          <Descriptions.Item label={t('orders.taxAmount')}>
            {formatVND(order.taxAmount)}
          </Descriptions.Item>
        )}
        <Descriptions.Item
          label={<Text strong>{t('orders.totalAmount')}</Text>}
        >
          <Text strong style={{ color: '#1677ff', fontSize: isMobile ? 16 : 18 }}>
            {formatVND(order.totalAmount)}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
