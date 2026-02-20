/**
 * OrderTrackingInfo — carrier details and tracking event timeline.
 *
 * Only rendered when order.tracking is not null (shipped and beyond).
 * Shows carrier name, tracking number (copyable), estimated delivery,
 * and a chronological event timeline from the carrier API.
 */

import { Card, Flex, Typography, Timeline, Tag, Button, message } from 'antd';
import {
  CarOutlined,
  CopyOutlined,
  LinkOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { OrderTracking } from '@/types';
import { formatDate } from '@/utils/formatters';

const { Text } = Typography;

interface OrderTrackingInfoProps {
  tracking: OrderTracking;
}

export function OrderTrackingInfo({ tracking }: OrderTrackingInfoProps) {
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(tracking.trackingNumber);
    message.success(t('orders.copied'));
  };

  return (
    <Card title={t('orders.tracking')} size="small">
      {/* Carrier & tracking number */}
      <Flex gap={8} align="center" wrap="wrap" style={{ marginBottom: 12 }}>
        <CarOutlined style={{ fontSize: 16, color: '#1677ff' }} />
        <Text strong>{tracking.carrier}</Text>
      </Flex>

      <Flex gap={8} align="center" wrap="wrap" style={{ marginBottom: 12 }}>
        <Text type="secondary">{t('orders.trackingNumber')}:</Text>
        <Text copyable={false} code>
          {tracking.trackingNumber}
        </Text>
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={handleCopy}
        >
          {t('orders.copyTracking')}
        </Button>
      </Flex>

      {/* Estimated delivery */}
      {tracking.estimatedDelivery && (
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">{t('orders.estimatedDelivery')}: </Text>
          <Text>{formatDate(tracking.estimatedDelivery)}</Text>
        </div>
      )}

      {/* External tracking link */}
      {tracking.trackingUrl && (
        <Button
          type="default"
          icon={<LinkOutlined />}
          href={tracking.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginBottom: 16 }}
        >
          {t('orders.trackDelivery')}
        </Button>
      )}

      {/* Event timeline */}
      {tracking.events.length > 0 && (
        <Timeline
          items={tracking.events.map((event) => ({
            color:
              event.status === 'delivered'
                ? 'green'
                : event.status === 'out_for_delivery'
                  ? 'blue'
                  : 'gray',
            children: (
              <div>
                <Text>{event.description}</Text>
                <Flex gap={8} style={{ marginTop: 2 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(event.timestamp)}
                  </Text>
                  {event.location && (
                    <Tag icon={<EnvironmentOutlined />} style={{ fontSize: 11 }}>
                      {event.location}
                    </Tag>
                  )}
                </Flex>
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
}
