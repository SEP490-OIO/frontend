/**
 * Route Configuration — all application routes defined in one place.
 *
 * Routes are organized by access level:
 * 1. Public routes — accessible without login (PublicLayout)
 * 2. Authenticated routes — require login (AppLayout + ProtectedRoute)
 * 3. Staff routes — require specific roles (AppLayout + ProtectedRoute with roles)
 * 4. Admin routes — require admin or super_admin role
 *
 * Each route group uses a layout route (element with <Outlet />) to share
 * the same header/sidebar/footer across all pages in that group.
 *
 * Placeholder routes render a simple "Coming Soon" page until
 * the actual page component is built.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { Result } from 'antd';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// ─── Page Components ─────────────────────────────────────────────────
import { HomePage } from '@/pages/public/HomePage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { BrowsePage } from '@/pages/public/BrowsePage';

/** Temporary placeholder for pages not yet built */
function ComingSoon({ title }: { title: string }) {
  return <Result title={title} subTitle="This page is under construction." />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ─── Public Routes (no login required) ──────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/auction/:id" element={<ComingSoon title="Auction Detail" />} />
        <Route path="/seller/:id" element={<ComingSoon title="Seller Profile" />} />
      </Route>

      {/* ─── Authenticated Routes (login required) ──────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Bidder pages (default for all logged-in users) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wallet" element={<ComingSoon title="Wallet" />} />
        <Route path="/my-bids" element={<ComingSoon title="My Bids" />} />
        <Route path="/orders" element={<ComingSoon title="Orders" />} />
        <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
        <Route path="/profile" element={<ComingSoon title="Profile" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />

        {/* Seller pages (require seller permission — enforced at component level) */}
        <Route path="/my-listings" element={<ComingSoon title="My Listings" />} />
        <Route path="/create-item" element={<ComingSoon title="Create Item" />} />
      </Route>

      {/* ─── Staff Routes (require specific roles) ──────────────── */}
      <Route
        element={
          <ProtectedRoute requiredRoles={['moderator']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/moderator" element={<ComingSoon title="Moderator Portal" />} />
      </Route>

      <Route
        element={
          <ProtectedRoute requiredRoles={['risk_manager']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/risk" element={<ComingSoon title="Risk Manager Portal" />} />
      </Route>

      <Route
        element={
          <ProtectedRoute requiredRoles={['support']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/support" element={<ComingSoon title="Support Portal" />} />
      </Route>

      <Route
        element={
          <ProtectedRoute requiredRoles={['marketing']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/marketing" element={<ComingSoon title="Marketing Portal" />} />
      </Route>

      {/* ─── Admin Routes ───────────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<ComingSoon title="Admin Dashboard" />} />
        <Route path="/admin/users" element={<ComingSoon title="User Management" />} />
        <Route path="/admin/config" element={<ComingSoon title="Platform Configuration" />} />
        <Route path="/admin/logs" element={<ComingSoon title="Audit Logs" />} />
        <Route path="/admin/staff" element={<ComingSoon title="Staff Management" />} />
        <Route path="/admin/emergency" element={<ComingSoon title="Emergency Controls" />} />
      </Route>

      {/* ─── Catch-all: 404 ─────────────────────────────────────── */}
      <Route path="/404" element={<Result status="404" title="404" subTitle="Page not found." />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
