/**
 * Mock data helpers — utilities for generating realistic fake data.
 *
 * These are TEMPORARY and will be removed when real API endpoints
 * are available. They exist to make mock services feel like real
 * API calls (with network delay simulation and stable IDs).
 */

/**
 * Simulates network latency so the UI shows loading states
 * the same way it will with a real backend.
 * Default: 300-800ms random delay.
 */
export function mockDelay(minMs = 300, maxMs = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a stable UUID-like string for mock entities.
 * Uses a simple prefix + index pattern so IDs are predictable
 * and consistent across page refreshes (important for navigation).
 *
 * Example: mockId('auction', 1) → 'auction-00000001-mock'
 */
export function mockId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(8, '0')}-mock`;
}

/**
 * Creates an ISO datetime string offset from "now".
 * Positive hours = future, negative hours = past.
 *
 * Example: mockDate(-24) → 24 hours ago
 * Example: mockDate(48)  → 48 hours from now
 */
export function mockDate(offsetHours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + offsetHours);
  return date.toISOString();
}

/**
 * Formats a number as VND for display in mock data descriptions.
 * Example: formatVND(15000000) → "15.000.000"
 */
export function formatMockVND(amount: number): string {
  return amount.toLocaleString('vi-VN');
}
