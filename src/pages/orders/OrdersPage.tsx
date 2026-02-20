/**
 * OrdersPage — the bidder's order management page.
 *
 * Three tabs via Segmented control (follows MyBidsPage pattern):
 * 1. Active — pending_payment, paid, processing, shipped, delivered
 * 2. Completed — completed, refunded
 * 3. Cancelled & Disputed — cancelled, disputed
 *
 * All 3 data hooks fire in parallel on mount so tab switching is instant.
 * Each tab shares the same OrdersList component with different filter options.
 *
 * View mode toggle (table/card) is page-level state shared across all tabs.
 * On mobile, tab switcher changes to a Select dropdown to prevent truncation
 * of long Vietnamese labels.
 */

import { useState } from 'react';
import { Typography, Segmented, Flex, Tooltip, Select } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useMyOrders } from '@/hooks/useOrders';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { OrdersList } from '@/components/orders/OrdersList';

const { Title, Text } = Typography;

type TabKey = 'active' | 'completed' | 'cancelled';
type ViewMode = 'table' | 'card';

export function OrdersPage() {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // All 3 queries fire in parallel — no sequential dependency
  const { data: activeOrders, isLoading: activeLoading } = useMyOrders('active');
  const { data: completedOrders, isLoading: completedLoading } = useMyOrders('completed');
  const { data: cancelledOrders, isLoading: cancelledLoading } = useMyOrders('cancelled');

  // Counts for tab labels (show 0 while loading)
  const activeCount = activeOrders?.length ?? 0;
  const completedCount = completedOrders?.length ?? 0;
  const cancelledCount = cancelledOrders?.length ?? 0;

  // Tab options — shared between Segmented (desktop) and Select (mobile)
  const tabOptions = [
    { value: 'active' as const, label: `${t('orders.tabActive')} (${activeCount})` },
    { value: 'completed' as const, label: `${t('orders.tabCompleted')} (${completedCount})` },
    { value: 'cancelled' as const, label: `${t('orders.tabCancelled')} (${cancelledCount})` },
  ];

  // View toggle — shared between mobile and desktop layouts
  const viewToggle = (
    <Segmented
      size="small"
      value={viewMode}
      onChange={(val) => setViewMode(val as ViewMode)}
      options={[
        {
          value: 'table',
          icon: (
            <Tooltip title={t('orders.viewTable')}>
              <UnorderedListOutlined />
            </Tooltip>
          ),
        },
        {
          value: 'card',
          icon: (
            <Tooltip title={t('orders.viewCard')}>
              <AppstoreOutlined />
            </Tooltip>
          ),
        },
      ]}
    />
  );

  return (
    <div>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <Title level={3}>{t('orders.title')}</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {t('orders.subtitle')}
      </Text>

      {/* ─── Tab switcher + view toggle ──────────────────────────── */}
      {isMobile ? (
        // Mobile: Select dropdown avoids truncation of long Vietnamese labels
        <Flex gap={8} align="center" style={{ marginBottom: 24 }}>
          <Select
            value={activeTab}
            onChange={(val) => setActiveTab(val)}
            options={tabOptions}
            style={{ flex: 1 }}
          />
          {viewToggle}
        </Flex>
      ) : (
        // Desktop: Segmented pills with full labels
        <Flex align="center" gap={12} style={{ marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Segmented
              value={activeTab}
              onChange={(val) => setActiveTab(val as TabKey)}
              options={tabOptions}
              block
            />
          </div>
          {viewToggle}
        </Flex>
      )}

      {/* ─── Tab content ──────────────────────────────────────────── */}
      {activeTab === 'active' && (
        <OrdersList
          orders={activeOrders ?? []}
          isLoading={activeLoading}
          viewMode={viewMode}
          tab="active"
        />
      )}
      {activeTab === 'completed' && (
        <OrdersList
          orders={completedOrders ?? []}
          isLoading={completedLoading}
          viewMode={viewMode}
          tab="completed"
        />
      )}
      {activeTab === 'cancelled' && (
        <OrdersList
          orders={cancelledOrders ?? []}
          isLoading={cancelledLoading}
          viewMode={viewMode}
          tab="cancelled"
        />
      )}
    </div>
  );
}
