/**
 * Core domain types for the Competitive Bidding Platform.
 *
 * These types mirror the PostgreSQL schema (docs/analysis/SP26SE150.sql)
 * and define the shape of data flowing through the frontend.
 * Only types needed for Phase 1 (Foundation) are included here —
 * domain-specific types (Auction, Bid, Wallet, etc.) will be added
 * as those features are built.
 */

// ─── Roles ───────────────────────────────────────────────────────────
// Matches the 9 roles defined in Alignment Analysis (Decision #7)

export type UserRole =
  | 'guest'
  | 'bidder'
  | 'seller'
  | 'moderator'
  | 'risk_manager'
  | 'support'
  | 'marketing'
  | 'admin'
  | 'super_admin';

// Staff roles that have dedicated portals (assigned by Super Admin)
export const STAFF_ROLES: UserRole[] = [
  'moderator',
  'risk_manager',
  'support',
  'marketing',
  'admin',
  'super_admin',
];

// ─── User ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: UserRole[];
  isEmailVerified: boolean;
  hasSellerPermission: boolean;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── API ─────────────────────────────────────────────────────────────

/** Standard API response wrapper from the backend */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/** Standard API error shape */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// ─── UI ──────────────────────────────────────────────────────────────

export type SupportedLanguage = 'vi' | 'en';
