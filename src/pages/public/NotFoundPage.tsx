/**
 * NotFoundPage — shown when a user navigates to a route that doesn't exist.
 *
 * Displays a friendly 404 message with a button to go back to the home page.
 */

import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('errors.notFoundDescription')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('common.backToHome')}
        </Button>
      }
    />
  );
}
