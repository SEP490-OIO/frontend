/**
 * Order service — data fetching and mutation functions.
 *
 * Currently uses mock data. When the real API is ready,
 * only the function bodies change (signatures stay the same).
 *
 * Future endpoints:
 *   GET  /orders?tab=active|completed|cancelled
 *   GET  /orders/:id
 *   POST /orders/:id/pay
 *   POST /orders/:id/confirm-receipt
 *   POST /orders/:id/return
 */

import type { Order, OrderListItem } from '@/types';
import { mockDelay } from './mock/helpers';
import { getMockOrders, getMockOrderDetail } from './mock/orders';

// ─── Query Functions ──────────────────────────────────────────────────

export async function getMyOrders(
  tab: 'active' | 'completed' | 'cancelled'
): Promise<OrderListItem[]> {
  await mockDelay();
  return getMockOrders(tab);
}

export async function getOrderDetail(
  orderId: string
): Promise<Order | null> {
  await mockDelay();
  return getMockOrderDetail(orderId);
}

// ─── Mutation Functions ───────────────────────────────────────────────

export async function payOrder(orderId: string): Promise<void> {
  await mockDelay(500, 1000);
  const order = getMockOrderDetail(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'pending_payment') {
    throw new Error('Order is not in pending_payment status');
  }
  // In real API: wallet deduction + escrow creation
}

export async function confirmReceipt(orderId: string): Promise<void> {
  await mockDelay(500, 1000);
  const order = getMockOrderDetail(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'delivered') {
    throw new Error('Order is not in delivered status');
  }
  // In real API: escrow release to seller (minus commission)
}

export async function requestReturn(
  orderId: string,
  reason: string
): Promise<void> {
  await mockDelay(500, 1000);
  const order = getMockOrderDetail(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'delivered') {
    throw new Error('Order is not in delivered status');
  }
  // In real API: creates return request with reason, pauses escrow release
  console.info('[mock] Return requested for order', orderId, 'reason:', reason);
}
