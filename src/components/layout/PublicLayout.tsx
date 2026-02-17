/**
 * PublicLayout — layout for pages accessible without login.
 *
 * Used by: Home, Browse, Auction Detail (read-only), Login, Register.
 * Structure: Header (logo + nav + login/register) → Content → Footer.
 */
import { Layout, Button, Space, Dropdown, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import type { SupportedLanguage } from '@/types';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export function PublicLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  const languageItems = [
    { key: 'vi', label: t('language.vi'), onClick: () => changeLanguage('vi') },
    { key: 'en', label: t('language.en'), onClick: () => changeLanguage('en') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo + App Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong style={{ fontSize: 20, color: '#1677ff' }}>
            {t('app.name')}
          </Text>
        </Link>

        {/* Right side: Navigation + Auth + Language */}
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
      </Header>

      {/* Page content renders here via React Router's <Outlet /> */}
      <Content style={{ padding: '24px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        {t('app.name')} ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
