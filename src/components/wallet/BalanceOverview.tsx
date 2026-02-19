/**
 * BalanceOverview — displays the 4 wallet balance types as color-coded cards.
 *
 * Each balance type represents a different state of the user's money:
 * - Available (green): freely usable for deposits and payments
 * - Locked (orange): deposit held for active auction participation
 * - Held (blue): escrow held until delivery is confirmed
 * - Refund (cyan): returned deposits, ready to withdraw
 *
 * Responsive: 2 cards per row on mobile (xs=12), 4 across on desktop (xl=6).
 * Uses xl breakpoint (not lg) because sidebar eats 240px at lg.
 */

import { Card, Row, Col, Skeleton, Typography, Tooltip } from 'antd';
import {
  DollarOutlined,
  LockOutlined,
  SafetyOutlined,
  RollbackOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Wallet } from '@/types';
import { formatVND } from '@/utils/formatters';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface BalanceOverviewProps {
  wallet: Wallet | undefined;
  isLoading: boolean;
}

/** Color + icon config for each balance type */
const BALANCE_CONFIG = [
  { key: 'available', field: 'availableBalance', color: '#52c41a', icon: <DollarOutlined /> },
  { key: 'locked', field: 'lockedBalance', color: '#faad14', icon: <LockOutlined /> },
  { key: 'held', field: 'heldBalance', color: '#1677ff', icon: <SafetyOutlined /> },
  { key: 'refund', field: 'refundBalance', color: '#13c2c2', icon: <RollbackOutlined /> },
] as const;

export function BalanceOverview({ wallet, isLoading }: BalanceOverviewProps) {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  return (
    <Row gutter={[16, 16]}>
      {BALANCE_CONFIG.map(({ key, field, color, icon }) => (
        <Col xs={12} xl={6} key={key}>
          {isLoading ? (
            <Card styles={{ body: { padding: isMobile ? 12 : 24 } }}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ) : (
            <Card
              styles={{ body: { padding: isMobile ? 12 : 24 } }}
              style={{ borderTop: `3px solid ${color}` }}
            >
              {/* Label row: icon + text + info tooltip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}>
                <span style={{ color, fontSize: isMobile ? 14 : 16 }}>{icon}</span>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: isMobile ? 12 : 14 }}
                >
                  {t(`wallet.${key}`)}
                </Typography.Text>
                <Tooltip title={t(`wallet.${key}Hint`)}>
                  <InfoCircleOutlined
                    style={{ color: '#bfbfbf', fontSize: 12, cursor: 'help' }}
                  />
                </Tooltip>
              </div>

              {/* Amount */}
              <Typography.Text
                strong
                style={{
                  fontSize: isMobile ? 18 : 24,
                  display: 'block',
                  overflowWrap: 'break-word',
                }}
              >
                {formatVND(wallet?.[field] ?? 0)}
              </Typography.Text>
            </Card>
          )}
        </Col>
      ))}
    </Row>
  );
}
