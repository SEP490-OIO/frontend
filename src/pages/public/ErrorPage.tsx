/**
 * ErrorPage — shown when an unexpected error occurs.
 *
 * Does NOT display the actual error message to the user
 * (errors are logged to console in the ErrorBoundary).
 * Just shows a friendly "something went wrong" message
 * with a button to go back to the home page.
 */

import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ErrorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Result
      status="500"
      title={t('errors.genericTitle')}
      subTitle={t('errors.genericDescription')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('common.backToHome')}
        </Button>
      }
    />
  );
}
