import { useQuery } from '@tanstack/react-query';
import { Product, Category, Brand, HeroBanner } from '@mobiplus/shared';

const API_BASE = '/api';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });
}

export function useFeaturedContent() {
  return useQuery<{ featured: Product[]; hotDeals: Product[]; banners: HeroBanner[] }>({
    queryKey: ['storefront', 'featured'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/storefront/featured`);
      if (!res.ok) throw new Error('Failed to fetch featured content');
      return res.json();
    },
  });
}

export function useMetadata() {
  return useQuery<{ categories: Category[]; brands: Brand[] }>({
    queryKey: ['metadata'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/metadata`);
      if (!res.ok) throw new Error('Failed to fetch metadata');
      return res.json();
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
    enabled: !!id,
  });
}
