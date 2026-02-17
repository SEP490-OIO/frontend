/**
 * RegisterPage — new user registration form.
 *
 * Creates an account with default Bidder permissions and an empty wallet.
 * Uses React Hook Form + Zod for validation.
 *
 * Currently uses mock auth (no backend) — will swap to real API later.
 */
import { Card, Button, Form, Input, Typography, message, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import type { User } from '@/types';

const { Title, Text } = Typography;

const registerSchema = z
  .object({
    fullName: z.string().min(1, 'auth.fullNameRequired'),
    email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
    password: z.string().min(8, 'auth.passwordMinLength'),
    confirmPassword: z.string().min(1, 'auth.passwordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Mock registration — simulates a successful registration response.
 * Replace this with a real API call when the backend is ready.
 */
function mockRegister(
  data: RegisterFormData
): { user: User; accessToken: string; refreshToken: string } {
  return {
    user: {
      id: 'mock-user-new',
      email: data.email,
      fullName: data.fullName,
      avatarUrl: null,
      roles: ['bidder'],
      isEmailVerified: false,
      hasSellerPermission: false,
      createdAt: new Date().toISOString(),
    },
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
}

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // TODO: Replace with real API call: const response = await api.post('/auth/register', data);
      const response = mockRegister(data);
      dispatch(setCredentials(response));
      message.success(t('dashboard.welcome', { name: response.user.fullName }));
      navigate('/dashboard', { replace: true });
    } catch {
      message.error(t('common.error'));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
      <Card style={{ width: '100%', maxWidth: 420, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          {t('auth.registerTitle')}
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.fullName ? 'error' : ''}
            help={errors.fullName?.message ? t(errors.fullName.message) : undefined}
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder={t('auth.fullName')}
                  size="large"
                />
              )}
            />
          </Form.Item>

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
            help={
              errors.password?.message
                ? t(errors.password.message, { min: 8 })
                : undefined
            }
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

          <Form.Item
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={
              errors.confirmPassword?.message
                ? t(errors.confirmPassword.message)
                : undefined
            }
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder={t('auth.confirmPassword')}
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large">
              {t('auth.registerButton')}
            </Button>
          </Form.Item>
        </form>

        <Divider />

        <Text style={{ display: 'block', textAlign: 'center' }}>
          {t('auth.hasAccount')} <Link to="/login">{t('auth.loginButton')}</Link>
        </Text>
      </Card>
    </div>
  );
}
