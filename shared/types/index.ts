export interface Product {
  id: string;
  name: string;
  sku?: string;
  slug?: string;
  price: number;
  oldPrice?: number;
  brand: string;
  category: string;
  subcategory?: string;
  description?: string;
  image: string;
  stockQuantity?: number;
  status: 'published' | 'low_stock' | 'out_of_stock';
  isHotDeal?: boolean;
  isFeatured?: boolean;
  specs?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

export interface Order {
  id: string;
  reference: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
}
