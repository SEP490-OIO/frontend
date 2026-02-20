/**
 * Order hooks — TanStack Query wrappers for order data.
 *
 * Query hooks fire on mount and cache data.
 * Mutation hooks invalidate relevant caches on success.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  getMyOrders,
  getOrderDetail,
  payOrder,
  confirmReceipt,
  requestReturn,
} from '@/services/orderService';

// ─── Query Hooks ──────────────────────────────────────────────────────

export function useMyOrders(tab: 'active' | 'completed' | 'cancelled') {
  return useQuery({
    queryKey: ['orders', tab],
    queryFn: () => getMyOrders(tab),
  });
}

export function useOrderDetail(orderId: string | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetail(orderId!),
    enabled: !!orderId,
  });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────

export function usePayOrder() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (orderId: string) => payOrder(orderId),
    onSuccess: (_data, orderId) => {
      message.success(t('orders.paySuccess'));
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}

export function useConfirmReceipt() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (orderId: string) => confirmReceipt(orderId),
    onSuccess: (_data, orderId) => {
      message.success(t('orders.confirmReceiptSuccess'));
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useRequestReturn() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      requestReturn(orderId, reason),
    onSuccess: (_data, { orderId }) => {
      message.success(t('orders.returnSuccess'));
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
