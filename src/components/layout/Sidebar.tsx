/**
 * Sidebar — role-based navigation menu.
 *
 * Shows different menu items based on the user's roles.
 * Uses Ant Design's Menu component inside a Layout.Sider.
 *
 * The sidebar is collapsible on desktop and hidden on mobile
 * (responsive behavior handled by antd's Sider breakpoint).
 */
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  WalletOutlined,
  ShoppingOutlined,
  AppstoreAddOutlined,
  FileSearchOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  FundOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  BellOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import type { UserRole } from '@/types';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

/**
 * Builds the menu items based on the user's roles.
 * Each role sees only the navigation relevant to their permissions.
 */
function buildMenuItems(
  roles: UserRole[],
  t: (key: string) => string
): MenuItem[] {
  const items: MenuItem[] = [];

  // Everyone who is logged in sees the dashboard
  items.push({
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: t('nav.dashboard'),
  });

  // ─── Bidder items (default for all users) ──────────────────────
  items.push({
    key: '/wallet',
    icon: <WalletOutlined />,
    label: t('nav.wallet'),
  });
  items.push({
    key: '/my-bids',
    icon: <ShoppingOutlined />,
    label: t('nav.myBids'),
  });
  items.push({
    key: '/orders',
    icon: <ShopOutlined />,
    label: t('nav.orders'),
  });

  // ─── Seller items (if user has seller permission) ──────────────
  if (roles.includes('seller')) {
    items.push({ type: 'divider' });
    items.push({
      key: '/my-listings',
      icon: <AppstoreAddOutlined />,
      label: t('nav.myListings'),
    });
    items.push({
      key: '/create-item',
      icon: <AppstoreAddOutlined />,
      label: t('nav.createItem'),
    });
  }

  // ─── Staff items (shown per role) ──────────────────────────────
  const staffItems: MenuItem[] = [];

  if (roles.includes('moderator')) {
    staffItems.push({
      key: '/moderator',
      icon: <FileSearchOutlined />,
      label: t('staff.moderator'),
    });
  }
  if (roles.includes('risk_manager')) {
    staffItems.push({
      key: '/risk',
      icon: <SafetyOutlined />,
      label: t('staff.riskManager'),
    });
  }
  if (roles.includes('support')) {
    staffItems.push({
      key: '/support',
      icon: <CustomerServiceOutlined />,
      label: t('staff.support'),
    });
  }
  if (roles.includes('marketing')) {
    staffItems.push({
      key: '/marketing',
      icon: <FundOutlined />,
      label: t('staff.marketing'),
    });
  }

  if (staffItems.length > 0) {
    items.push({ type: 'divider' });
    items.push(...staffItems);
  }

  // ─── Admin items ───────────────────────────────────────────────
  if (roles.includes('admin') || roles.includes('super_admin')) {
    items.push({ type: 'divider' });
    items.push({
      key: '/admin',
      icon: <SettingOutlined />,
      label: t('staff.admin'),
    });
  }
  if (roles.includes('super_admin')) {
    items.push({
      key: '/admin/staff',
      icon: <TeamOutlined />,
      label: t('staff.superAdmin'),
    });
    items.push({
      key: '/admin/emergency',
      icon: <ThunderboltOutlined />,
      label: 'Emergency',
    });
  }

  // ─── Common items at bottom ────────────────────────────────────
  items.push({ type: 'divider' });
  items.push({
    key: '/notifications',
    icon: <BellOutlined />,
    label: t('nav.notifications'),
  });
  items.push({
    key: '/profile',
    icon: <UserOutlined />,
    label: t('nav.profile'),
  });

  return items;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  const roles = user?.roles ?? ['bidder'];
  const menuItems = buildMenuItems(roles, t);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth={80}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          height: 48,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: collapsed ? 14 : 18,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {collapsed ? 'ĐG' : t('app.name')}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
