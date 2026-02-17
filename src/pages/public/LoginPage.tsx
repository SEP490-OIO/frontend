/**
 * LoginPage — user login form.
 *
 * Uses React Hook Form + Zod for validation.
 * On successful login, stores credentials in Redux and redirects to dashboard.
 *
 * Currently uses mock auth (no backend) — will swap to real API later.
 */
import { Card, Button, Form, Input, Typography, message, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import type { User } from '@/types';

const { Title, Text } = Typography;

/** Zod schema — defines validation rules for the login form */
const loginSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  password: z.string().min(1, 'auth.passwordRequired'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Mock login — simulates a successful login response.
 * Replace this with a real API call when the backend is ready.
 */
function mockLogin(email: string): { user: User; accessToken: string; refreshToken: string } {
  return {
    user: {
      id: 'mock-user-1',
      email,
      fullName: 'Nguyễn Văn A',
      avatarUrl: null,
      roles: ['bidder'],
      isEmailVerified: true,
      hasSellerPermission: false,
      createdAt: new Date().toISOString(),
    },
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Where to redirect after login (default: dashboard)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Replace with real API call: const response = await api.post('/auth/login', data);
      const response = mockLogin(data.email);
      dispatch(setCredentials(response));
      message.success(t('dashboard.welcome', { name: response.user.fullName }));
      navigate(from, { replace: true });
    } catch {
      message.error(t('common.error'));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
      <Card style={{ width: '100%', maxWidth: 420, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          {t('auth.loginTitle')}
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message ? t(errors.email.message) : undefined}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder={t('auth.email')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message ? t(errors.password.message) : undefined}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder={t('auth.password')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large">
              {t('auth.loginButton')}
            </Button>
          </Form.Item>
        </form>

        <Divider />

        <Text style={{ display: 'block', textAlign: 'center' }}>
          {t('auth.noAccount')} <Link to="/register">{t('auth.registerButton')}</Link>
        </Text>
      </Card>
    </div>
  );
}
