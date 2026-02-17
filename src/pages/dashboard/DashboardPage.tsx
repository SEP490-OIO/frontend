/**
 * DashboardPage — the main landing page after login.
 *
 * This is a placeholder that will later show role-specific content:
 * - Bidder: Active auctions, won items, wallet summary
 * - Seller: Listing stats, revenue, active auctions
 * - Staff: Queue summary, pending tasks
 * - Admin: System health, user counts
 */
import { Card, Typography, Row, Col, Statistic } from 'antd';
import {
  ShoppingOutlined,
  WalletOutlined,
  TrophyOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';

const { Title } = Typography;

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <Title level={3}>{t('dashboard.welcome', { name: user?.fullName })}</Title>
      <Title level={5} type="secondary" style={{ marginBottom: 32 }}>
        {t('dashboard.overview')}
      </Title>

      {/* Placeholder statistics — will be replaced with real data */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('nav.myBids')}
              value={0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('nav.wallet')}
              value={0}
              prefix={<WalletOutlined />}
              suffix="d"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Won"
              value={0}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('nav.myListings')}
              value={0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
