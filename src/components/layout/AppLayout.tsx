/**
 * AppLayout — layout for authenticated (logged-in) pages.
 *
 * Used by: Dashboard, Wallet, My Bids, Seller pages, Staff portals, Admin.
 * Structure: Sidebar (role-based nav) + Header (user info + lang) + Content.
 *
 * The sidebar shows different menu items based on the user's roles
 * (see Sidebar.tsx for the role-based menu logic).
 */
import { Layout, Button, Dropdown, Space, Avatar, Typography } from 'antd';
import {
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { clearCredentials } from '@/features/auth/authSlice';
import { Sidebar } from './Sidebar';
import type { SupportedLanguage } from '@/types';

const { Header, Content } = Layout;
const { Text } = Typography;

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Space size="middle">
            {/* Language Switcher */}
            <Dropdown menu={{ items: languageItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />} />
            </Dropdown>

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                <Text>{user?.fullName}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Page content renders here via React Router's <Outlet /> */}
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
