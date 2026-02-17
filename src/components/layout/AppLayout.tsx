/**
 * AppLayout — layout for authenticated (logged-in) pages.
 *
 * Used by: Dashboard, Wallet, My Bids, Seller pages, Staff portals, Admin.
 * Structure: Sidebar (role-based nav) + Header (user info + lang) + Content.
 *
 * Responsive behavior:
 * - Desktop (≥768px): Sidebar visible + header with user info
 * - Mobile (<768px): Sidebar hidden, hamburger icon in header opens a Drawer
 *   with the same role-based menu items
 */
import { useState } from 'react';
import { Layout, Button, Dropdown, Space, Avatar, Typography, Drawer, Menu } from 'antd';
import {
  GlobalOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { clearCredentials } from '@/features/auth/authSlice';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Sidebar } from './Sidebar';
import { buildMenuItems } from './buildMenuItems';
import type { SupportedLanguage } from '@/types';

const { Header, Content } = Layout;
const { Text } = Typography;

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile } = useBreakpoint();

  // Controls the mobile navigation drawer open/closed state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  const languageItems = [
    { key: 'vi', label: t('language.vi'), onClick: () => changeLanguage('vi') },
    { key: 'en', label: t('language.en'), onClick: () => changeLanguage('en') },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: t('nav.settings'),
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Reuse the same role-based menu items from Sidebar for the mobile drawer
  const roles = user?.roles ?? ['bidder'];
  const sidebarMenuItems = buildMenuItems(roles, t);

  /** Navigate and close the drawer (mobile) */
  const handleMobileNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar renders itself only on tablet+ (see Sidebar.tsx) */}
      <Sidebar />

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: isMobile ? '0 16px' : '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          {/* ─── Mobile: hamburger button on the left ──────────────── */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label={t('common.menu')}
            />
          )}

          {/* ─── Right side: language + user menu ──────────────────── */}
          <Space size="middle">
            {/* Language Switcher */}
            <Dropdown menu={{ items: languageItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />} />
            </Dropdown>

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                {/* Hide full name on mobile to save space — avatar is enough */}
                {!isMobile && <Text>{user?.fullName}</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* ─── Mobile navigation drawer ──────────────────────────── */}
        <Drawer
          title={t('app.name')}
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          styles={{ wrapper: { width: 280 }, body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={sidebarMenuItems}
            onClick={({ key }) => handleMobileNav(key)}
            style={{ borderInlineEnd: 'none' }}
          />

          {/* Logout button at the bottom of the drawer */}
          <div style={{ padding: '16px 24px' }}>
            <Button danger block onClick={handleLogout}>
              <LogoutOutlined /> {t('nav.logout')}
            </Button>
          </div>
        </Drawer>

        {/* Page content renders here via React Router's <Outlet /> */}
        <Content
          style={{
            margin: isMobile ? 12 : 24,
            padding: isMobile ? 16 : 24,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
