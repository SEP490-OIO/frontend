/**
 * OrderActions — contextual action buttons based on order status.
 *
 * Each status has different available actions:
 * - pending_payment: Pay Now
 * - delivered: Confirm Receipt, Request Return, File Dispute
 * - shipped: Track Delivery (external link)
 * - Others: informational text only
 */

import { useState } from 'react';
import { Card, Button, Flex, Typography } from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types';
import { ConfirmReceiptModal } from './ConfirmReceiptModal';
import { RequestReturnModal } from './RequestReturnModal';
import { PayOrderModal } from './PayOrderModal';

const { Text } = Typography;

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const { t } = useTranslation();
  const [payOpen, setPayOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  return (
    <>
      <Card size="small">
        <Flex vertical gap={8}>
          {/* Pending payment: Pay Now */}
          {order.status === 'pending_payment' && (
            <Button
              type="primary"
              icon={<WalletOutlined />}
              size="large"
              block
              onClick={() => setPayOpen(true)}
            >
              {t('orders.payNow')}
            </Button>
          )}

          {/* Delivered: Confirm Receipt + Request Return + File Dispute */}
          {order.status === 'delivered' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                block
                onClick={() => setConfirmOpen(true)}
              >
                {t('orders.confirmReceipt')}
              </Button>
              <Button
                icon={<RollbackOutlined />}
                block
                onClick={() => setReturnOpen(true)}
              >
                {t('orders.requestReturn')}
              </Button>
              <Button
                type="text"
                danger
                icon={<ExclamationCircleOutlined />}
                block
              >
                {t('orders.fileDispute')}
              </Button>
            </>
          )}

          {/* Processing/Paid: info text */}
          {(order.status === 'paid' || order.status === 'processing') && (
            <Text type="secondary" style={{ textAlign: 'center' }}>
              {t('orders.timelineProcessing')}
            </Text>
          )}

          {/* Completed: placeholder */}
          {order.status === 'completed' && (
            <Text type="secondary" style={{ textAlign: 'center' }}>
              {t('orders.timelineCompleted')}
            </Text>
          )}

          {/* Cancelled/Disputed/Refunded: status text */}
          {(order.status === 'cancelled' ||
            order.status === 'disputed' ||
            order.status === 'refunded') && (
            <Text type="secondary" style={{ textAlign: 'center' }}>
              {order.notes ?? t('orders.timelineCancelled')}
            </Text>
          )}
        </Flex>
      </Card>

      {/* Modals */}
      <PayOrderModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        orderId={order.id}
        totalAmount={order.totalAmount}
      />
      <ConfirmReceiptModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        orderId={order.id}
      />
      <RequestReturnModal
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        orderId={order.id}
      />
    </>
  );
}
