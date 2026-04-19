import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import clsx from 'clsx';

import { useAdminProducts, useSaveProduct, useDeleteProduct } from '../hooks/useAdmin';
import ProductModal from '../components/ProductModal';
import { Product } from '@mobiplus/shared';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useAdminProducts();
  const saveProductMutation = useSaveProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleSave = async (data: any) => {
    try {
      await saveProductMutation.mutateAsync({ ...editingProduct, ...data });
      toast.success(editingProduct ? 'Product updated' : 'Product created');
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Catalog</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Manage your stock, pricing, and merchandising flags for all storefront items.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>

        {/* Product Modal */}
        <ProductModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          product={editingProduct} 
          onSave={handleSave} 
        />

        {/* Filters & Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name, SKU, or brand..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              <Filter size={14} />
              All Categories
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              <ArrowUpDown size={14} />
              Sort: Newest
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="mt-2 text-sm font-medium text-slate-500 max-w-xs">
                We couldn't find any products matching your search criteria. Try a different query or add a new item.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{product.sku} • {product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{product.stockQuantity} units</p>
                        <p className={clsx(
                          "text-[10px] font-bold uppercase tracking-wider",
                          product.stockQuantity > 10 ? "text-emerald-500" : product.stockQuantity > 0 ? "text-amber-500" : "text-red-500"
                        )}>
                          {product.stockQuantity > 10 ? "Healthy Stock" : product.stockQuantity > 0 ? "Reorder Soon" : "Out of Stock"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">KES {product.price.toLocaleString()}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={clsx(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        product.status === 'published' ? "bg-emerald-50 text-emerald-600" :
                        product.status === 'low_stock' ? "bg-amber-50 text-amber-600" :
                        "bg-red-50 text-red-600"
                      )}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setModalOpen(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <p className="text-xs font-medium text-slate-500">Showing 1 to 4 of 428 products</p>
            <div className="flex items-center gap-2">
               <button disabled className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-400 opacity-50">Previous</button>
               <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
