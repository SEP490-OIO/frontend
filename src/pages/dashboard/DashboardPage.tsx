/**
 * DashboardPage — the main landing page after login.
 *
 * Shows the bidder's dashboard with:
 * 1. Quick stats (active bids, won, wallet balance, watching)
 * 2. Wallet summary + active bids table (side by side on desktop)
 * 3. Recently ended auctions
 * 4. Recommended/featured auctions
 *
 * All data fetches run in parallel via TanStack Query hooks.
 * Later: add role-based views for seller, staff, and admin dashboards.
 */

import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import {
  useDashboardStats,
  useDashboardWallet,
  useMyActiveBids,
  useRecentlyEnded,
  useFeaturedForDashboard,
} from '@/hooks/useDashboard';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { WalletSummaryCard } from '@/components/dashboard/WalletSummaryCard';
import { MyActiveBidsTable } from '@/components/dashboard/MyActiveBidsTable';
import { RecentlyEndedList } from '@/components/dashboard/RecentlyEndedList';
import { RecommendedAuctions } from '@/components/dashboard/RecommendedAuctions';

const { Title, Text } = Typography;

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  // All 5 queries fire in parallel — no sequential dependencies
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: wallet, isLoading: walletLoading } = useDashboardWallet();
  const { data: activeBids, isLoading: bidsLoading } = useMyActiveBids();
  const { data: recentlyEnded, isLoading: recentLoading } = useRecentlyEnded();
  const { data: featured, isLoading: featuredLoading } =
    useFeaturedForDashboard();

  return (
    <div>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <Title level={3}>{t('dashboard.welcome', { name: user?.fullName })}</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {t('dashboard.overview')}
      </Text>

      {/* ─── Section 1: Quick Stats Row ─────────────────────────── */}
      <StatsRow
        stats={stats ?? { activeBidsCount: 0, wonCount: 0, watchingCount: 0 }}
        walletBalance={wallet?.availableBalance ?? 0}
        isLoading={statsLoading || walletLoading}
      />

      {/* ─── Section 2: Wallet Summary + Active Bids ────────────── */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} xl={8}>
          <WalletSummaryCard wallet={wallet} isLoading={walletLoading} />
        </Col>
        <Col xs={24} xl={16}>
          <MyActiveBidsTable
            bids={activeBids ?? []}
            isLoading={bidsLoading}
          />
        </Col>
      </Row>

      {/* ─── Section 3: Recently Ended ──────────────────────────── */}
      <div style={{ marginTop: 24 }}>
        <RecentlyEndedList
          items={recentlyEnded ?? []}
          isLoading={recentLoading}
        />
      </div>

      {/* ─── Section 4: Recommended Auctions ────────────────────── */}
      <div style={{ marginTop: 24 }}>
        <RecommendedAuctions
          auctions={featured ?? []}
          isLoading={featuredLoading}
        />
      </div>
    </div>
  );
}
