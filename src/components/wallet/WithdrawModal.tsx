/**
 * WithdrawModal — mock form for withdrawing refund balance to a bank account.
 *
 * Business rule: Only the Refund Balance can be withdrawn. This is money
 * returned from lost auctions — it's the user's money, ready to leave
 * the platform. Available balance stays for bidding/payments.
 *
 * In production, this creates a WithdrawalRequest that goes through
 * admin approval (pending → approved → processing → completed).
 * For now, it's a simulated form with a success message.
 *
 * Responsive: full-width on mobile, 480px on desktop.
 */

import { Modal, Form, InputNumber, Input, Alert, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { formatVND } from '@/utils/formatters';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  /** Current refund balance — max amount the user can withdraw */
  refundBalance: number;
}

export function WithdrawModal({
  open,
  onClose,
  refundBalance,
}: WithdrawModalProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Mock: just show success message
      message.success(
        t('wallet.successWithdraw', { amount: formatVND(values.amount) })
      );
      form.resetFields();
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={t('wallet.withdrawTitle')}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={t('wallet.withdraw')}
      cancelText={t('common.cancel')}
      okButtonProps={{ disabled: refundBalance <= 0 }}
      width={isMobile ? '100%' : 480}
      style={isMobile ? { top: 20 } : undefined}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Withdraw amount — capped at refund balance */}
        <Form.Item
          name="amount"
          label={t('wallet.withdrawAmount')}
          extra={t('wallet.withdrawAmountMax', {
            amount: formatVND(refundBalance),
          })}
          rules={[
            { required: true, message: t('wallet.withdrawAmountRequired') },
            {
              type: 'number',
              max: refundBalance,
              message: t('wallet.withdrawAmountExceed'),
            },
          ]}
        >
          <InputNumber<number>
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            parser={(value) =>
              Number(value?.replace(/\./g, '') ?? 0)
            }
            addonAfter="VND"
            placeholder="1.000.000"
            min={0}
            max={refundBalance}
            step={100_000}
            disabled={refundBalance <= 0}
          />
        </Form.Item>

        {/* Bank name */}
        <Form.Item
          name="bankName"
          label={t('wallet.bankName')}
          rules={[
            { required: true, message: t('wallet.bankNameRequired') },
          ]}
        >
          <Input placeholder="Vietcombank" disabled={refundBalance <= 0} />
        </Form.Item>

        {/* Account number */}
        <Form.Item
          name="bankAccountNumber"
          label={t('wallet.bankAccount')}
          rules={[
            { required: true, message: t('wallet.bankAccountRequired') },
          ]}
        >
          <Input placeholder="0123456789" disabled={refundBalance <= 0} />
        </Form.Item>

        {/* Account holder name */}
        <Form.Item
          name="bankAccountHolder"
          label={t('wallet.bankHolder')}
          rules={[
            { required: true, message: t('wallet.bankHolderRequired') },
          ]}
        >
          <Input
            placeholder="NGUYEN VAN A"
            disabled={refundBalance <= 0}
          />
        </Form.Item>

        {/* Info note: this is a simulation */}
        <Alert
          type="info"
          message={t('wallet.withdrawNote')}
          showIcon
          style={{ marginBottom: 0 }}
        />
      </Form>
    </Modal>
  );
}
