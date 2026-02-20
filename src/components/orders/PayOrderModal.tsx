/**
 * PayOrderModal — payment confirmation from wallet.
 *
 * Shows the total amount and confirms wallet deduction.
 * In production, this would check wallet balance and deduct funds.
 */

import { Modal, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { usePayOrder } from '@/hooks/useOrders';
import { formatVND } from '@/utils/formatters';

const { Text } = Typography;

interface PayOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number;
}

export function PayOrderModal({
  open,
  onClose,
  orderId,
  totalAmount,
}: PayOrderModalProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const mutation = usePayOrder();

  const handlePay = () => {
    mutation.mutate(orderId, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handlePay}
      confirmLoading={mutation.isPending}
      title={t('orders.payNow')}
      okText={t('orders.payNow')}
      cancelText={t('common.cancel')}
      width={isMobile ? '100%' : 480}
      style={isMobile ? { top: 20 } : undefined}
    >
      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <Text type="secondary">{t('orders.payConfirm', { amount: formatVND(totalAmount) })}</Text>
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ fontSize: 24, color: '#1677ff' }}>
            {formatVND(totalAmount)}
          </Text>
        </div>
      </div>

      <Alert
        type="info"
        showIcon
        message={t('orders.payNote')}
        style={{ marginTop: 8 }}
      />
    </Modal>
  );
}
