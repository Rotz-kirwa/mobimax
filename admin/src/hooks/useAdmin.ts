import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api/admin';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('mbx_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/dashboard`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/products`, { headers: getAuthHeaders() });
      // Note: Reusing the same endpoint as products but theoretically we could have an admin specific one
      // Actually api/index.ts uses app.get('/products') for storefront but we could use it for admin too if public.
      // But we have app.get('/admin/orders'), so let's stick to the structure.
      // Actually let's just use the storefront /products for now as it's the same list
      const storefrontRes = await fetch('/api/products');
      return storefrontRes.json();
    },
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
  });
}

export function useSaveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const isUpdate = !!data.id;
      const url = isUpdate ? `${API_BASE}/products/${data.id}` : `${API_BASE}/products`;
      const method = isUpdate ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, type }: { id: string; status: string; type: 'payment' | 'order' }) => {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, type }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
