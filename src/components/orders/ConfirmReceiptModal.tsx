/**
 * ConfirmReceiptModal — confirmation dialog before marking delivery received.
 *
 * Warns the user that confirming will release payment to the seller
 * and close the return window.
 */

import { Modal, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useConfirmReceipt } from '@/hooks/useOrders';

const { Text } = Typography;

interface ConfirmReceiptModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export function ConfirmReceiptModal({
  open,
  onClose,
  orderId,
}: ConfirmReceiptModalProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const mutation = useConfirmReceipt();

  const handleConfirm = () => {
    mutation.mutate(orderId, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      confirmLoading={mutation.isPending}
      title={t('orders.confirmReceipt')}
      okText={t('common.confirm')}
      cancelText={t('common.cancel')}
      width={isMobile ? '100%' : 480}
      style={isMobile ? { top: 20 } : undefined}
    >
      <Alert
        type="warning"
        showIcon
        message={t('orders.confirmReceiptWarning')}
        style={{ marginBottom: 16 }}
      />
      <Text>
        {t('orders.confirmReceipt')}?
      </Text>
    </Modal>
  );
}
