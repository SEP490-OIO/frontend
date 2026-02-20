/**
 * RequestReturnModal — return request form with reason selection.
 *
 * User selects a reason (radio group) and optionally adds notes.
 */

import { useState } from 'react';
import { Modal, Radio, Input, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useRequestReturn } from '@/hooks/useOrders';

const { Text } = Typography;

interface RequestReturnModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

const RETURN_REASONS = [
  'returnReasonNotAsDescribed',
  'returnReasonDamaged',
  'returnReasonWrongItem',
  'returnReasonOther',
] as const;

export function RequestReturnModal({
  open,
  onClose,
  orderId,
}: RequestReturnModalProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const mutation = useRequestReturn();
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!reason) {
      setShowError(true);
      return;
    }
    mutation.mutate(
      { orderId, reason: `${reason}${notes ? ': ' + notes : ''}` },
      {
        onSuccess: () => {
          setReason('');
          setNotes('');
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    setReason('');
    setNotes('');
    setShowError(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={mutation.isPending}
      title={t('orders.requestReturn')}
      okText={t('common.submit')}
      cancelText={t('common.cancel')}
      width={isMobile ? '100%' : 520}
      style={isMobile ? { top: 20 } : undefined}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {t('orders.returnReason')} <Text type="danger">*</Text>
      </Text>
      <Radio.Group
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setShowError(false);
        }}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {RETURN_REASONS.map((key) => (
            <Radio key={key} value={key}>
              {t(`orders.${key}`)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      {showError && (
        <Text type="danger" style={{ display: 'block', fontSize: 13, marginTop: 4 }}>
          {t('orders.returnReasonRequired')}
        </Text>
      )}

      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
          {t('orders.returnNotes')}
        </Text>
        <div style={{ position: 'relative' }}>
          <Input.TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <Text
            type="secondary"
            style={{
              position: 'absolute',
              bottom: 6,
              right: 10,
              fontSize: 12,
              pointerEvents: 'none',
            }}
          >
            {notes.length}/500
          </Text>
        </div>
      </div>
    </Modal>
  );
}
