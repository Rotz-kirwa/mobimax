import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function createOrderId() {
  return `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: [],

      createOrder: (orderInput) =>
        set((state) => ({
          orders: [
            {
              id: orderInput.id || createOrderId(),
              createdAt: orderInput.createdAt || new Date().toISOString(),
              status: orderInput.status || 'paid',
              paymentStatus: orderInput.paymentStatus || 'confirmed',
              paymentMethod: orderInput.paymentMethod || 'mpesa',
              customer: orderInput.customer || {},
              items: orderInput.items || [],
              totals: orderInput.totals || { subtotal: 0, deliveryFee: 0, total: 0 },
              reference: orderInput.reference || '',
              checkoutRequestId: orderInput.checkoutRequestId || '',
              merchantRequestId: orderInput.merchantRequestId || '',
            },
            ...state.orders,
          ],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
          ),
        })),

      updatePaymentStatus: (orderId, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
              : order
          ),
        })),
    }),
    {
      name: 'mobimax-orders',
      version: 1,
    }
  )
);
