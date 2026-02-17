/**
 * HomePage — the landing page for guests and returning users.
 *
 * This is a placeholder that will later include:
 * - Featured auctions carousel
 * - Category browsing
 * - Search functionality
 * - Promotion banners (Marketing staff manages these)
 *
 * Responsive: Reduces padding and font sizes on mobile.
 * Buttons stack vertically on small screens for better touch targets.
 */
import { Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { Title, Paragraph } = Typography;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px' : '80px 24px' }}>
      <Title level={isMobile ? 2 : 1}>{t('home.hero')}</Title>
      <Paragraph
        style={{
          fontSize: isMobile ? 15 : 18,
          color: '#666',
          maxWidth: 600,
          margin: '0 auto 32px',
        }}
      >
        {t('home.heroSub')}
      </Paragraph>

      {/* Stack buttons vertically on mobile for full-width touch targets */}
      <Space direction={isMobile ? 'vertical' : 'horizontal'} size="large" style={{ width: isMobile ? '100%' : 'auto' }}>
        <Button
          type="primary"
          size="large"
          block={isMobile}
          onClick={() => navigate('/browse')}
        >
          {t('home.browseButton')}
        </Button>
        {!user && (
          <Button
            size="large"
            block={isMobile}
            onClick={() => navigate('/register')}
          >
            {t('home.registerButton')}
          </Button>
        )}
      </Space>
    </div>
  );
}
