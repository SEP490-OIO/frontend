/**
 * HomePage — the landing page for guests and returning users.
 *
 * This is a placeholder that will later include:
 * - Featured auctions carousel
 * - Category browsing
 * - Search functionality
 * - Promotion banners (Marketing staff manages these)
 */
import { Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';

const { Title, Paragraph } = Typography;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <Title>{t('home.hero')}</Title>
      <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto 32px' }}>
        {t('home.heroSub')}
      </Paragraph>

      <Space size="large">
        <Button type="primary" size="large" onClick={() => navigate('/browse')}>
          {t('home.browseButton')}
        </Button>
        {!user && (
          <Button size="large" onClick={() => navigate('/register')}>
            {t('home.registerButton')}
          </Button>
        )}
      </Space>
    </div>
  );
}
