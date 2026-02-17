/**
 * Sidebar — role-based navigation menu.
 *
 * Shows different menu items based on the user's roles.
 * Uses Ant Design's Menu component inside a Layout.Sider.
 *
 * Responsive behavior:
 * - Desktop (≥768px): Visible as a collapsible sidebar
 * - Mobile (<768px): Completely hidden — AppLayout shows a Drawer instead
 */
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { buildMenuItems } from './buildMenuItems';

const { Sider } = Layout;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile } = useBreakpoint();

  const roles = user?.roles ?? ['bidder'];
  const menuItems = buildMenuItems(roles, t);

  // On mobile, the sidebar is completely hidden.
  // AppLayout renders a Drawer with the same menu items instead.
  if (isMobile) return null;

  return (
    <Sider
      width={240}
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
