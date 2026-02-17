/**
 * PublicLayout — layout for pages accessible without login.
 *
 * Used by: Home, Browse, Auction Detail (read-only), Login, Register.
 * Structure: Header (logo + nav + login/register) → Content → Footer.
 *
 * Responsive behavior:
 * - Desktop (≥768px): Full nav links + auth buttons in header row
 * - Mobile (<768px): Hamburger icon opens a Drawer with nav + auth
 */
import { useState } from 'react';
import { Layout, Button, Space, Dropdown, Typography, Drawer, Menu, Flex } from 'antd';
import { GlobalOutlined, MenuOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { SupportedLanguage } from '@/types';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export function PublicLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile } = useBreakpoint();

  // Controls the mobile navigation drawer open/closed state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  const languageItems = [
    { key: 'vi', label: t('language.vi'), onClick: () => changeLanguage('vi') },
    { key: 'en', label: t('language.en'), onClick: () => changeLanguage('en') },
  ];

  // Menu items used in the mobile drawer
  const mobileMenuItems = [
    { key: '/', label: t('nav.home') },
    { key: '/browse', label: t('nav.browse') },
  ];

  /** Navigate and close the drawer (mobile) */
  const handleMobileNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: isMobile ? '0 16px' : '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo + App Name — always visible */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong style={{ fontSize: isMobile ? 16 : 20, color: '#1677ff' }}>
            {t('app.name')}
          </Text>
        </Link>

        {/* ─── Desktop navigation (hidden on mobile) ─────────────── */}
        {!isMobile && (
          <Space size="middle">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/browse">{t('nav.browse')}</Link>

            {/* Language Switcher */}
            <Dropdown menu={{ items: languageItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />} />
            </Dropdown>

            {/* Auth buttons or Dashboard link */}
            {user ? (
              <Button type="primary" onClick={() => navigate('/dashboard')}>
                {t('nav.dashboard')}
              </Button>
            ) : (
              <Space>
                <Button onClick={() => navigate('/login')}>{t('nav.login')}</Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </Space>
            )}
          </Space>
        )}

        {/* ─── Mobile hamburger button (shown only on mobile) ────── */}
        {isMobile && (
          <Space>
            {/* Language switcher stays visible on mobile (compact) */}
            <Dropdown menu={{ items: languageItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />} size="small" />
            </Dropdown>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label={t('common.menu')}
            />
          </Space>
        )}
      </Header>

      {/* ─── Mobile navigation drawer ──────────────────────────── */}
      <Drawer
        title={t('app.name')}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ wrapper: { width: 280 }, body: { padding: 0 } }}
      >
        {/* Navigation links */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={mobileMenuItems}
          onClick={({ key }) => handleMobileNav(key)}
          style={{ borderInlineEnd: 'none' }}
        />

        {/* Auth buttons at the bottom of the drawer */}
        <div style={{ padding: '16px 24px' }}>
          {user ? (
            <Button
              type="primary"
              block
              onClick={() => handleMobileNav('/dashboard')}
            >
              {t('nav.dashboard')}
            </Button>
          ) : (
            <Flex vertical gap="middle">
              <Button block onClick={() => handleMobileNav('/login')}>
                {t('nav.login')}
              </Button>
              <Button type="primary" block onClick={() => handleMobileNav('/register')}>
                {t('nav.register')}
              </Button>
            </Flex>
          )}
        </div>
      </Drawer>

      {/* Page content renders here via React Router's <Outlet /> */}
      <Content
        style={{
          padding: isMobile ? '16px' : '24px',
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999', padding: isMobile ? '16px' : '24px 50px' }}>
        {t('app.name')} ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
