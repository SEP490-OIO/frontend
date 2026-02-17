/**
 * Root App Component.
 *
 * This is intentionally minimal — all provider setup lives in
 * app/providers.tsx and all route definitions live in routes/index.tsx.
 *
 * App.tsx just connects them together.
 */
import { Providers } from '@/app/providers';
import { AppRoutes } from '@/routes';

export function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}
