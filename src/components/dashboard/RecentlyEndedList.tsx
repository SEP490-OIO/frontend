/**
 * RecentlyEndedList — auctions the user participated in that have ended.
 *
 * Compact list showing won/lost result with final price.
 * Clicking a row navigates to the auction detail page.
 */

import { Card, List, Avatar, Tag, Space, Typography, Skeleton, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { MyBidItem } from '@/types';
import { formatVND } from '@/utils/formatters';

const { Text, Paragraph } = Typography;

interface RecentlyEndedListProps {
  items: MyBidItem[];
  isLoading: boolean;
}

export function RecentlyEndedList({ items, isLoading }: RecentlyEndedListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card title={t('dashboard.recentlyEnded')}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <List
          dataSource={items}
          locale={{
            emptyText: (
              <Empty description={t('dashboard.noRecentEnded')} />
            ),
          }}
          renderItem={(item) => {
            const isWon = item.myBidStatus === 'won';
            const finalPrice =
              item.auction.currentPrice ?? item.auction.startingPrice;

            return (
              <List.Item
                style={{ cursor: 'pointer', padding: '12px 0' }}
                onClick={() => navigate(`/auction/${item.auction.id}`)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={48}
                      src={item.auction.primaryImageUrl}
                    />
                  }
                  title={
                    <Paragraph
                      ellipsis={{ rows: 1 }}
                      style={{ margin: 0, fontSize: 14 }}
                    >
                      {item.auction.itemTitle}
                    </Paragraph>
                  }
                  description={
                    <Space size={8}>
                      <Tag color={isWon ? 'green' : 'default'}>
                        {isWon
                          ? t('dashboard.bidStatusWon')
                          : t('dashboard.bidStatusLost')}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {formatVND(finalPrice)}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
}
