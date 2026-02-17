/**
 * ProtectedRoute — guards routes that require authentication or specific roles.
 *
 * Wraps any route that should only be accessible to logged-in users.
 * Optionally checks for specific roles (e.g., only moderators can access /moderator).
 *
 * Usage in routes:
 *   <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRoles={['moderator']}><AppLayout /></ProtectedRoute>}>
 *     <Route path="/moderator" element={<ModeratorPage />} />
 *   </Route>
 */
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useAppSelector } from '@/app/hooks';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If specified, user must have at least one of these roles */
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  // Not logged in → redirect to login page, preserving the intended URL
  // so we can redirect back after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but doesn't have the required role → show access denied
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return (
        <Result
          status="403"
          title="403"
          subTitle={t('common.error')}
          extra={
            <Button type="primary" href="/dashboard">
              {t('nav.dashboard')}
            </Button>
          }
        />
      );
    }
  }

  // Authenticated and authorized → render the protected content
  return <>{children}</>;
}
