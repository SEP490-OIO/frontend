/**
 * OrderDetailPage — full order detail with timeline, item, tracking, payment, and actions.
 *
 * Layout:
 * - Desktop: two-column (left: timeline + item + tracking, right: payment + actions)
 * - Mobile: single column, stacked vertically
 *
 * Deep-linkable from notifications, emails, AuctionResult "View Order" button,
 * and My Bids ended tab "View Order" link.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Row,
  Col,
  Typography,
  Spin,
  Flex,
  Result,
  Button,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useOrderDetail } from '@/hooks/useOrders';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderItemCard } from '@/components/orders/OrderItemCard';
import { OrderTrackingInfo } from '@/components/orders/OrderTrackingInfo';
import { OrderPaymentInfo } from '@/components/orders/OrderPaymentInfo';
import { OrderActions } from '@/components/orders/OrderActions';

const { Title } = Typography;

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  const { data: order, isLoading } = useOrderDetail(id);

  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 80 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // Not found
  if (!order) {
    return (
      <Result
        status="404"
        title={t('orders.notFound')}
        subTitle={t('orders.notFoundDescription')}
        extra={
          <Button type="primary" onClick={() => navigate('/orders')}>
            {t('orders.backToOrders')}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Back button + order number header */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        style={{ marginBottom: 8 }}
      >
        {t('orders.backToOrders')}
      </Button>

      <Title level={4} style={{ marginBottom: 24 }}>
        {order.orderNumber}
      </Title>

      {/* ─── Timeline (full width) ─────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <OrderTimeline order={order} />
      </div>

      {/* ─── Main two-column layout ────────────────────────────── */}
      <Row gutter={[24, 24]}>
        {/* Left column: Item + Tracking */}
        <Col xs={24} xl={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <OrderItemCard order={order} />
            {order.tracking && <OrderTrackingInfo tracking={order.tracking} />}
          </Space>
        </Col>

        {/* Right column: Payment + Actions */}
        <Col xs={24} xl={8}>
          <div style={!isMobile ? { position: 'sticky', top: 24 } : undefined}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <OrderPaymentInfo order={order} />
              <OrderActions order={order} />
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}
