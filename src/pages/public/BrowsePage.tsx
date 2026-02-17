/**
 * BrowsePage — public catalog page where users explore auctions.
 *
 * This is the "front door" of the platform — accessible without login.
 * Features:
 * - Search bar (400ms debounce to avoid query-per-keystroke)
 * - Category filter (parent groups with child options)
 * - Status filter (Live / Qualifying / Ended / All)
 * - Sort selector (Ending soonest, Price, Bids, Newest)
 * - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
 * - Ant Design Pagination at the bottom
 *
 * Data is fetched via TanStack Query (useAuctions hook).
 * Filter changes automatically trigger a refetch because
 * the filters object is part of the query key.
 */

import { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Input,
  Select,
  Typography,
  Pagination,
  Spin,
  Empty,
  Space,
  Flex,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { AuctionFilters, AuctionStatus } from '@/types';
import { useAuctions, useCategories } from '@/hooks/useAuctions';
import { AuctionCard } from '@/components/auction/AuctionCard';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const { Title, Text } = Typography;

/** Status options for the filter dropdown */
const STATUS_OPTIONS: { value: string; labelKey: string }[] = [
  { value: 'all', labelKey: 'browse.statusAll' },
  { value: 'active', labelKey: 'browse.statusLive' },
  { value: 'qualifying', labelKey: 'browse.statusQualifying' },
  { value: 'ended', labelKey: 'browse.statusEnded' },
];

/** Sort options for the sort dropdown */
const SORT_OPTIONS: {
  value: string;
  labelKey: string;
  sortBy: AuctionFilters['sortBy'];
  sortOrder: AuctionFilters['sortOrder'];
}[] = [
  { value: 'endingSoon', labelKey: 'auction.sortEndingSoon', sortBy: 'endTime', sortOrder: 'asc' },
  { value: 'lowestPrice', labelKey: 'auction.sortLowestPrice', sortBy: 'currentPrice', sortOrder: 'asc' },
  { value: 'highestPrice', labelKey: 'auction.sortHighestPrice', sortBy: 'currentPrice', sortOrder: 'desc' },
  { value: 'mostBids', labelKey: 'auction.sortMostBids', sortBy: 'bidCount', sortOrder: 'desc' },
  { value: 'newest', labelKey: 'auction.sortNewest', sortBy: 'createdAt', sortOrder: 'desc' },
];

export function BrowsePage() {
  const { t } = useTranslation();

  // ─── Filter state ────────────────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortValue, setSortValue] = useState('endingSoon');
  const [page, setPage] = useState(1);

  // Debounce search input — waits 400ms after the user stops typing
  const debouncedSearch = useDebouncedValue(searchText, 400);

  // Resolve the selected sort option into sortBy + sortOrder
  const selectedSort = SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0];

  // Build the filter object passed to useAuctions
  const filters: AuctionFilters = useMemo(() => {
    const f: AuctionFilters = {
      page,
      sortBy: selectedSort.sortBy,
      sortOrder: selectedSort.sortOrder,
    };

    if (debouncedSearch) f.search = debouncedSearch;
    if (categoryId) f.categoryId = categoryId;

    // Map status filter to AuctionStatus values
    if (statusFilter === 'active') {
      f.status = ['active'] as AuctionStatus[];
    } else if (statusFilter === 'qualifying') {
      f.status = ['qualifying'] as AuctionStatus[];
    } else if (statusFilter === 'ended') {
      f.status = ['ended', 'sold', 'cancelled', 'failed'] as AuctionStatus[];
    }
    // 'all' → no status filter

    return f;
  }, [debouncedSearch, categoryId, statusFilter, selectedSort, page]);

  // ─── Data fetching ───────────────────────────────────────────
  const { data, isLoading } = useAuctions(filters);
  const { data: categories } = useCategories();

  // Build category options for Select — parent as group, children as options
  const categoryOptions = useMemo(() => {
    if (!categories) return [];
    return categories.map((parent) => ({
      label: parent.name,
      options: [
        // Include parent itself as an option (selects all children)
        { label: parent.name, value: parent.id },
        // Child categories
        ...(parent.children?.map((child) => ({
          label: `  ${child.name}`,
          value: child.id,
        })) ?? []),
      ],
    }));
  }, [categories]);

  // Reset page to 1 when any filter changes
  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      {/* ─── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          {t('browse.title')}
        </Title>
        <Text type="secondary">{t('browse.subtitle')}</Text>
      </div>

      {/* ─── Filter Bar ──────────────────────────────────────── */}
      <Flex
        gap={12}
        wrap="wrap"
        style={{ marginBottom: 24 }}
      >
        {/* Search input */}
        <Input
          placeholder={t('browse.searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          allowClear
          style={{ flex: '1 1 240px', maxWidth: 360 }}
        />

        {/* Category filter */}
        <Select
          placeholder={t('browse.categoryAll')}
          value={categoryId}
          onChange={handleFilterChange(setCategoryId)}
          allowClear
          onClear={() => { setCategoryId(undefined); setPage(1); }}
          options={categoryOptions}
          style={{ flex: '0 1 200px', minWidth: 160 }}
        />

        {/* Status filter */}
        <Select
          value={statusFilter}
          onChange={handleFilterChange(setStatusFilter)}
          options={STATUS_OPTIONS.map((o) => ({
            label: t(o.labelKey),
            value: o.value,
          }))}
          style={{ flex: '0 1 180px', minWidth: 160 }}
        />

        {/* Sort */}
        <Select
          value={sortValue}
          onChange={handleFilterChange(setSortValue)}
          options={SORT_OPTIONS.map((o) => ({
            label: t(o.labelKey),
            value: o.value,
          }))}
          style={{ flex: '0 1 220px', minWidth: 180 }}
        />
      </Flex>

      {/* ─── Result count ────────────────────────────────────── */}
      {data && !isLoading && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          {t('browse.totalItems', { total: data.totalItems })}
        </Text>
      )}

      {/* ─── Auction Grid ────────────────────────────────────── */}
      {isLoading ? (
        <Flex justify="center" style={{ padding: 80 }}>
          <Spin size="large" />
        </Flex>
      ) : !data || data.items.length === 0 ? (
        <Empty
          description={
            <Space direction="vertical" size={4}>
              <Text>{t('browse.noResults')}</Text>
              <Text type="secondary">{t('browse.noResultsHint')}</Text>
            </Space>
          }
          style={{ padding: 80 }}
        />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data.items.map((auction) => (
              <Col key={auction.id} xs={24} sm={12} lg={8}>
                <AuctionCard auction={auction} />
              </Col>
            ))}
          </Row>

          {/* ─── Pagination ──────────────────────────────────── */}
          {data.totalPages > 1 && (
            <Flex justify="center" style={{ marginTop: 32 }}>
              <Pagination
                current={data.page}
                total={data.totalItems}
                pageSize={data.pageSize}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </Flex>
          )}
        </>
      )}
    </div>
  );
}
