/**
 * TransactionHistory — filterable transaction list for the Wallet page.
 *
 * Desktop (≥768px): Ant Design Table with 4 columns (type+desc, amount, balance after, date).
 * Mobile (<768px): Compact List with stacked info per row.
 *
 * Each transaction type has a color-coded tag:
 * - credit (green): money added — deposit, add funds, payout
 * - debit (red): money removed — payment, purchase
 * - hold (orange): money moved to locked — auction deposit
 * - release (blue): money returned — refund from lost auction
 */

import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Typography,
  Skeleton,
  Segmented,
  Space,
  List,
  Empty,
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LockOutlined,
  UnlockOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { WalletTransaction } from '@/types';
import type { WalletTransactionType } from '@/types/enums';
import { formatVND } from '@/utils/formatters';
import { formatRelativeTime } from '@/utils/formatters';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  isLoading: boolean;
}

/** Visual config for each transaction type */
const TYPE_CONFIG: Record<
  WalletTransactionType,
  { color: string; icon: React.ReactNode; sign: '+' | '-' }
> = {
  credit: { color: 'green', icon: <ArrowDownOutlined />, sign: '+' },
  debit: { color: 'red', icon: <ArrowUpOutlined />, sign: '-' },
  hold: { color: 'orange', icon: <LockOutlined />, sign: '-' },
  release: { color: 'blue', icon: <UnlockOutlined />, sign: '+' },
};

export function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter transactions by selected type
  const filtered =
    typeFilter === 'all'
      ? transactions
      : transactions.filter((tx) => tx.type === typeFilter);

  // Segmented control options for type filter
  const filterOptions = [
    { label: t('wallet.allTypes'), value: 'all' },
    { label: t('wallet.typeCredit'), value: 'credit' },
    { label: t('wallet.typeDebit'), value: 'debit' },
    { label: t('wallet.typeHold'), value: 'hold' },
    { label: t('wallet.typeRelease'), value: 'release' },
  ];

  return (
    <Card
      title={
        <Space>
          <WalletOutlined />
          {t('wallet.transactionHistory')}
        </Space>
      }
    >
      {/* Type filter */}
      <div style={{ marginBottom: 16, overflowX: 'auto' }}>
        <Segmented
          options={filterOptions}
          value={typeFilter}
          onChange={(val) => setTypeFilter(val as string)}
          size={isMobile ? 'small' : 'middle'}
        />
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : filtered.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              <Typography.Text type="secondary">
                {t('wallet.noTransactions')}
              </Typography.Text>
              <br />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {t('wallet.noTransactionsHint')}
              </Typography.Text>
            </span>
          }
        />
      ) : isMobile ? (
        <MobileTransactionList transactions={filtered} />
      ) : (
        <DesktopTransactionTable transactions={filtered} />
      )}
    </Card>
  );
}

// ─── Desktop: Full Table ──────────────────────────────────────────────

function DesktopTransactionTable({
  transactions,
}: {
  transactions: WalletTransaction[];
}) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('wallet.colDescription'),
      dataIndex: 'description',
      key: 'description',
      render: (desc: string | null, record: WalletTransaction) => {
        const config = TYPE_CONFIG[record.type];
        return (
          <Space>
            <Tag color={config.color} icon={config.icon}>
              {t(`wallet.type${capitalize(record.type)}`)}
            </Tag>
            <span>{desc ?? '—'}</span>
          </Space>
        );
      },
    },
    {
      title: t('wallet.colAmount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (amount: number, record: WalletTransaction) => {
        const config = TYPE_CONFIG[record.type];
        return (
          <Typography.Text
            style={{ color: config.sign === '+' ? '#52c41a' : '#ff4d4f' }}
            strong
          >
            {config.sign}
            {formatVND(amount)}
          </Typography.Text>
        );
      },
    },
    {
      title: t('wallet.colBalance'),
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      width: 160,
      render: (bal: number) => formatVND(bal),
    },
    {
      title: t('wallet.colDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date: string) => formatRelativeTime(date, t),
    },
  ];

  return (
    <Table
      dataSource={transactions}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="middle"
    />
  );
}

// ─── Mobile: Compact List ─────────────────────────────────────────────

function MobileTransactionList({
  transactions,
}: {
  transactions: WalletTransaction[];
}) {
  const { t } = useTranslation();

  return (
    <List
      dataSource={transactions}
      renderItem={(tx) => {
        const config = TYPE_CONFIG[tx.type];
        return (
          <List.Item style={{ padding: '12px 0' }}>
            <div style={{ width: '100%' }}>
              {/* Row 1: type tag + amount */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Tag color={config.color} icon={config.icon} style={{ margin: 0 }}>
                  {t(`wallet.type${capitalize(tx.type)}`)}
                </Tag>
                <Typography.Text
                  strong
                  style={{
                    color: config.sign === '+' ? '#52c41a' : '#ff4d4f',
                  }}
                >
                  {config.sign}
                  {formatVND(tx.amount)}
                </Typography.Text>
              </div>
              {/* Row 2: description */}
              <Typography.Text
                type="secondary"
                style={{ fontSize: 13, display: 'block' }}
                ellipsis
              >
                {tx.description ?? '—'}
              </Typography.Text>
              {/* Row 3: date + balance after */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatRelativeTime(tx.createdAt, t)}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {t('wallet.colBalance')}: {formatVND(tx.balanceAfter)}
                </Typography.Text>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

/** Capitalizes first letter — used to build i18n keys like "typeCredit" */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
