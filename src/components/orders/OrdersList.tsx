/**
 * OrdersList — renders the user's orders in table, list, or card mode.
 *
 * View modes controlled by parent:
 * - Table: Ant Design Table (desktop) / List (mobile) with 5 columns
 * - Card: Responsive grid of compact order cards
 *
 * Includes client-side filters:
 * - Status: varies per tab (active/completed/cancelled)
 * - Sort: Newest | Oldest | Price
 *
 * Follows ActiveBidsList.tsx pattern from My Bids.
 */

import { useMemo, useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Typography,
  List,
  Avatar,
  Button,
  Empty,
  Skeleton,
  Select,
  Flex,
  Card,
  Row,
  Col,
} from 'antd';
import {
  ShoppingOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { OrderListItem } from '@/types';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import {
  formatVND,
  formatDate,
  ORDER_STATUS_KEYS,
  ORDER_STATUS_COLORS,
} from '@/utils/formatters';

const { Text, Paragraph } = Typography;

interface OrdersListProps {
  orders: OrderListItem[];
  isLoading: boolean;
  viewMode: 'table' | 'card';
  /** Which tab is active — controls filter options */
  tab: 'active' | 'completed' | 'cancelled';
}

export function OrdersList({ orders, isLoading, viewMode, tab }: OrdersListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  // ─── Filter state ──────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // ─── Status filter options per tab ─────────────────────────────
  const statusOptions = useMemo(() => {
    const base = [{ value: 'all', label: t('orders.filterAll') }];
    switch (tab) {
      case 'active':
        return [
          ...base,
          { value: 'pending_payment', label: t('orders.statusPendingPayment') },
          { value: 'paid', label: t('orders.statusPaid') },
          { value: 'processing', label: t('orders.statusProcessing') },
          { value: 'shipped', label: t('orders.statusShipped') },
          { value: 'delivered', label: t('orders.statusDelivered') },
        ];
      case 'completed':
        return [
          ...base,
          { value: 'completed', label: t('orders.statusCompleted') },
          { value: 'refunded', label: t('orders.statusRefunded') },
        ];
      case 'cancelled':
        return [
          ...base,
          { value: 'cancelled', label: t('orders.statusCancelled') },
          { value: 'disputed', label: t('orders.statusDisputed') },
        ];
      default:
        return base;
    }
  }, [tab, t]);

  // ─── Client-side filtering + sorting ───────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [orders, statusFilter, sortBy]);

  // ─── Empty state ───────────────────────────────────────────────
  const emptyContent = (
    <Empty
      description={
        <Space direction="vertical" size={4}>
          <Text>{t(`orders.empty${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}</Text>
        </Space>
      }
    >
      {tab === 'active' && (
        <Button type="primary" onClick={() => navigate('/browse')}>
          {t('orders.browseNow')}
        </Button>
      )}
    </Empty>
  );

  // ─── Filter bar ────────────────────────────────────────────────
  const filterBar = (
    <Flex wrap="wrap" gap={12} style={{ marginBottom: 16 }}>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {t('orders.filterStatus')}:
        </Text>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          options={statusOptions}
        />
      </Flex>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {t('orders.filterSort')}:
        </Text>
        <Select
          value={sortBy}
          onChange={setSortBy}
          style={{ width: 140 }}
          options={[
            { value: 'newest', label: t('orders.sortNewest') },
            { value: 'oldest', label: t('orders.sortOldest') },
            { value: 'price', label: t('orders.sortHighestPrice') },
          ]}
        />
      </Flex>
    </Flex>
  );

  // ─── Desktop: Table view ───────────────────────────────────────
  const columns = [
    {
      title: t('orders.columnItem'),
      key: 'item',
      render: (_: unknown, record: OrderListItem) => (
        <Space>
          <img
            src={record.primaryImageUrl ?? ''}
            alt={record.itemTitle}
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
          <div>
            <Paragraph
              ellipsis={{ rows: 1 }}
              style={{ margin: 0 }}
            >
              {record.itemTitle}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.orderNumber}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('orders.columnStatus'),
      key: 'status',
      width: 140,
      render: (_: unknown, record: OrderListItem) => (
        <Tag color={ORDER_STATUS_COLORS[record.status]}>
          {t(ORDER_STATUS_KEYS[record.status])}
        </Tag>
      ),
    },
    {
      title: t('orders.columnTotal'),
      key: 'total',
      width: 160,
      render: (_: unknown, record: OrderListItem) => (
        <Text strong>{formatVND(record.totalAmount)}</Text>
      ),
    },
    {
      title: t('orders.columnDate'),
      key: 'date',
      width: 160,
      render: (_: unknown, record: OrderListItem) => (
        <Text type="secondary">{formatDate(record.createdAt)}</Text>
      ),
    },
    {
      title: t('orders.columnAction'),
      key: 'action',
      width: 100,
      render: (_: unknown, record: OrderListItem) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${record.id}`);
          }}
        >
          {t('orders.viewDetail')}
        </Button>
      ),
    },
  ];

  // ─── Mobile: List view (used when viewMode=table on small screens) ──
  const mobileList = (
    <List
      dataSource={filteredOrders}
      locale={{ emptyText: emptyContent }}
      renderItem={(item) => (
        <List.Item
          style={{ cursor: 'pointer', padding: '12px 0' }}
          onClick={() => navigate(`/orders/${item.id}`)}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                shape="square"
                size={48}
                src={item.primaryImageUrl}
                icon={<ShoppingOutlined />}
              />
            }
            title={
              <Paragraph
                ellipsis={{ rows: 1 }}
                style={{ margin: 0, fontSize: 14 }}
              >
                {item.itemTitle}
              </Paragraph>
            }
            description={
              <Flex wrap="wrap" gap={4} align="center">
                <Text style={{ fontSize: 13 }}>
                  {formatVND(item.totalAmount)}
                </Text>
                <Tag
                  color={ORDER_STATUS_COLORS[item.status]}
                  style={{ margin: 0 }}
                >
                  {t(ORDER_STATUS_KEYS[item.status])}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDate(item.createdAt)}
                </Text>
              </Flex>
            }
          />
        </List.Item>
      )}
    />
  );

  // ─── Card view ────────────────────────────────────────────────
  const cardGrid = (
    <Row gutter={[16, 16]}>
      {filteredOrders.map((item) => (
        <Col key={item.id} xs={24} sm={12} lg={8}>
          <Card
            hoverable
            onClick={() => navigate(`/orders/${item.id}`)}
            styles={{ body: { padding: 16 } }}
            cover={
              <div style={{ position: 'relative' }}>
                <img
                  alt={item.itemTitle}
                  src={item.primaryImageUrl ?? ''}
                  style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                />
                {/* Status badge — top-right */}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Tag color={ORDER_STATUS_COLORS[item.status]}>
                    {t(ORDER_STATUS_KEYS[item.status])}
                  </Tag>
                </div>
              </div>
            }
          >
            <Paragraph
              strong
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 8, fontSize: 15 }}
            >
              {item.itemTitle}
            </Paragraph>

            {/* Order number + total */}
            <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {item.orderNumber}
              </Text>
              <Text strong style={{ fontSize: 14, color: '#1677ff' }}>
                {formatVND(item.totalAmount)}
              </Text>
            </Flex>

            {/* Footer: seller + date */}
            <Flex justify="space-between" align="center">
              {item.sellerName && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.sellerName}
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatDate(item.createdAt)}
              </Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  // ─── Render logic ─────────────────────────────────────────────
  const renderContent = () => {
    if (filteredOrders.length === 0) return emptyContent;

    if (viewMode === 'card') return cardGrid;

    // Table mode: responsive — table on desktop, compact list on mobile
    return isMobile ? mobileList : (
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={false}
        size="small"
        onRow={(record) => ({
          style: { cursor: 'pointer' },
          onClick: () => navigate(`/orders/${record.id}`),
        })}
      />
    );
  };

  return (
    <div>
      {filterBar}
      {renderContent()}
    </div>
  );
}
