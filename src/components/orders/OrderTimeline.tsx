/**
 * OrderTimeline — status progression using Ant Design Steps.
 *
 * Shows 6 steps in the happy path:
 * Created → Paid → Processing → Shipped → Delivered → Completed
 *
 * For cancelled/disputed orders, the step where the issue occurred
 * is marked with error status.
 *
 * Layout: Collapsible card on ALL screen sizes.
 * Shows current status summary; expand to reveal full vertical Steps.
 * Horizontal Steps wraps badly even on iPad Pro (1024px) with sidebar,
 * so the collapsible pattern is used universally.
 */

import { useState } from 'react';
import { Steps, Card, Flex, Typography, Tag, Button } from 'antd';
import {
  FileTextOutlined,
  WalletOutlined,
  SyncOutlined,
  CarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types';
import { formatDate, ORDER_STATUS_KEYS, ORDER_STATUS_COLORS } from '@/utils/formatters';

const { Text } = Typography;

interface OrderTimelineProps {
  order: Order;
}

/** Standard 6-step happy path */
const STEP_STATUSES = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'completed',
] as const;

const STEP_ICONS = [
  <FileTextOutlined key="created" />,
  <WalletOutlined key="paid" />,
  <SyncOutlined key="processing" />,
  <CarOutlined key="shipped" />,
  <HomeOutlined key="delivered" />,
  <CheckCircleOutlined key="completed" />,
];

const STEP_KEYS = [
  'orders.timelineCreated',
  'orders.timelinePaid',
  'orders.timelineProcessing',
  'orders.timelineShipped',
  'orders.timelineDelivered',
  'orders.timelineCompleted',
];

/** Maps order status → timestamp field name */
function getTimestamp(order: Order, stepIndex: number): string | null {
  switch (stepIndex) {
    case 0: return order.createdAt;
    case 1: return order.paidAt;
    case 3: return order.shippedAt;
    case 4: return order.deliveredAt;
    case 5: return order.completedAt;
    default: return null;
  }
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const isCancelled = order.status === 'cancelled';
  const isDisputed = order.status === 'disputed';
  const isError = isCancelled || isDisputed;

  // Find current step index — for error states, show where the order stopped
  let currentIndex = STEP_STATUSES.indexOf(
    order.status as (typeof STEP_STATUSES)[number]
  );
  if (currentIndex === -1) {
    // For cancelled/disputed, find the last completed step
    if (order.deliveredAt) currentIndex = 4;
    else if (order.shippedAt) currentIndex = 3;
    else if (order.paidAt) currentIndex = 1;
    else currentIndex = 0;
  }

  const items = STEP_STATUSES.map((_, i) => {
    const ts = getTimestamp(order, i);
    const icon =
      isError && i === currentIndex
        ? isCancelled
          ? <CloseCircleOutlined />
          : <WarningOutlined />
        : STEP_ICONS[i];

    return {
      title: t(STEP_KEYS[i]),
      description: ts ? formatDate(ts) : undefined,
      icon,
      status:
        isError && i === currentIndex
          ? ('error' as const)
          : undefined,
    };
  });

  // For error states, add the error step description
  if (isError) {
    items[currentIndex].description = t(
      isCancelled ? 'orders.timelineCancelled' : 'orders.timelineDisputed'
    );
  }

  // ─── Collapsible summary + expandable full timeline (all sizes) ──
  return (
    <Card size="small">
      {/* Always-visible: current status with icon + tag */}
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={8}>
          {isError
            ? (isCancelled
              ? <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
              : <WarningOutlined style={{ color: '#faad14', fontSize: 18 }} />)
            : <span style={{ fontSize: 18 }}>{STEP_ICONS[currentIndex]}</span>
          }
          <div>
            <Text strong>{t(STEP_KEYS[currentIndex])}</Text>
            {items[currentIndex].description && (
              <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                {items[currentIndex].description}
              </Text>
            )}
          </div>
        </Flex>
        <Tag color={ORDER_STATUS_COLORS[order.status]}>
          {t(ORDER_STATUS_KEYS[order.status])}
        </Tag>
      </Flex>

      {/* Expand/collapse toggle */}
      <Button
        type="link"
        size="small"
        icon={expanded ? <UpOutlined /> : <DownOutlined />}
        onClick={() => setExpanded(!expanded)}
        style={{ padding: 0, marginTop: 8 }}
      >
        {expanded ? t('orders.timelineHide') : t('orders.timelineShowAll')}
      </Button>

      {/* Full vertical steps — only shown when expanded */}
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <Steps
            current={currentIndex}
            direction="vertical"
            size="small"
            items={items}
          />
        </div>
      )}
    </Card>
  );
}
