/**
 * WalletPage — the user's financial hub (Option A: single-page full view).
 *
 * Layout (desktop):
 * ┌──────────────────────────────────────────────────┐
 * │  Title + subtitle                                │
 * ├──────────┬──────────┬──────────┬─────────────────┤
 * │Available │ Locked   │  Held    │  Refund         │ ← BalanceOverview
 * ├──────────┴──────────┴──────────┴─────────────────┤
 * │  [+ Nạp tiền]         [↑ Rút tiền]              │ ← Action buttons
 * ├──────────────────────────────────────────────────┤
 * │  Transaction History (table with type filter)    │ ← TransactionHistory
 * └──────────────────────────────────────────────────┘
 *
 * Mobile: everything stacks vertically, table becomes compact list.
 *
 * Key design decisions:
 * - Balance is ALWAYS visible — even when modals are open (overlays)
 * - Modals for actions keep the user in context (no page navigation)
 * - Both hooks fire in parallel on mount (no sequential dependency)
 */

import { useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useWalletData, useWalletTransactions } from '@/hooks/useWallet';
import { BalanceOverview } from '@/components/wallet/BalanceOverview';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { Title, Text } = Typography;

export function WalletPage() {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  // Both queries fire in parallel — no sequential dependency
  const { data: wallet, isLoading: walletLoading } = useWalletData();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions();

  // Modal visibility state
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <Title level={3}>{t('wallet.title')}</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {t('wallet.subtitle')}
      </Text>

      {/* ─── Balance Overview (4 cards) ─────────────────────────── */}
      <BalanceOverview wallet={wallet} isLoading={walletLoading} />

      {/* ─── Action Buttons ─────────────────────────────────────── */}
      <Space
        size={12}
        style={{ marginTop: 20, marginBottom: 24 }}
        wrap
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size={isMobile ? 'middle' : 'large'}
          onClick={() => setAddFundsOpen(true)}
        >
          {t('wallet.addFunds')}
        </Button>
        <Button
          icon={<ArrowUpOutlined />}
          size={isMobile ? 'middle' : 'large'}
          onClick={() => setWithdrawOpen(true)}
        >
          {t('wallet.withdraw')}
        </Button>
      </Space>

      {/* ─── Transaction History ────────────────────────────────── */}
      <TransactionHistory
        transactions={transactions ?? []}
        isLoading={txLoading}
      />

      {/* ─── Modals (overlay — balance stays visible behind) ───── */}
      <AddFundsModal
        open={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        refundBalance={wallet?.refundBalance ?? 0}
      />
    </div>
  );
}
