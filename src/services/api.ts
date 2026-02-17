/**
 * Axios Instance — centralized HTTP client.
 *
 * All API requests go through this instance, which provides:
 * - Base URL configuration (swap between dev/staging/production)
 * - Automatic auth token injection on every request
 * - Centralized error handling (401 → logout, 500 → error message)
 *
 * Usage in TanStack Query:
 *   const { data } = useQuery({
 *     queryKey: ['auctions'],
 *     queryFn: () => api.get('/auctions').then(res => res.data),
 *   });
 */
import axios from 'axios';
import { store } from '@/app/store';
import { clearCredentials } from '@/features/auth/authSlice';

const api = axios.create({
  // Base URL will point to the real backend once it's ready.
  // For now, mock services will intercept calls before they reach this.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ─── Request Interceptor ────────────────────────────────────────────
// Attaches the JWT access token to every outgoing request.
// This means individual API calls don't need to worry about auth headers.
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ───────────────────────────────────────────
// Handles common error scenarios globally so individual components
// don't need to check for 401/403/500 in every API call.
api.interceptors.response.use(
  // Success — pass through
  (response) => response,

  // Error — handle common cases
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → log the user out
      store.dispatch(clearCredentials());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
