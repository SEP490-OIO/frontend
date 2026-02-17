/**
 * buildMenuItems — creates the role-based navigation menu items.
 *
 * Shared between:
 * - Sidebar.tsx (desktop: Sider menu)
 * - AppLayout.tsx (mobile: Drawer menu)
 *
 * Extracted to its own file so Sidebar.tsx only exports a component,
 * which keeps React fast refresh working correctly.
 */
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
import type { UserRole } from '@/types';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * Builds the menu items based on the user's roles.
 * Each role sees only the navigation relevant to their permissions.
 */
export function buildMenuItems(
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
