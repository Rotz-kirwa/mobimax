import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { Product } from '@mobiplus/shared';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(3, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  oldPrice: z.number().optional().nullable(),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description is required'),
  image: z.string().url('Must be a valid image URL'),
  stockQuantity: z.number().min(0, 'Stock cannot be negative'),
  status: z.enum(['published', 'low_stock', 'out_of_stock']),
  isFeatured: z.boolean().default(false),
  isHotDeal: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: ProductFormValues) => void;
}

export default function ProductModal({ open, onClose, product, onSave }: ProductModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'published',
      stockQuantity: 0,
      isFeatured: false,
      isHotDeal: false,
    }
  });

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        oldPrice: product.oldPrice || null,
      });
    } else {
      reset({
        name: '',
        sku: '',
        price: 0,
        oldPrice: null,
        brand: '',
        category: '',
        description: '',
        image: '',
        stockQuantity: 0,
        status: 'published',
        isFeatured: false,
        isHotDeal: false,
      });
    }
  }, [product, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-8 py-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Product Name</label>
                <input 
                  {...register('name')}
                  className={clsx("w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-4", errors.name ? "border-red-200 bg-red-50 focus:ring-red-500/10" : "border-slate-200 bg-slate-50 focus:border-indigo-400") }
                  placeholder="e.g. iPhone 15 Pro Max"
                />
                {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">SKU Code</label>
                <input 
                  {...register('sku')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white"
                  placeholder="MBX-PRO-15"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Pricing & Inventory</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Price (KES)</label>
                <input 
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Old Price (Opt.)</label>
                <input 
                  type="number"
                  {...register('oldPrice', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Current Stock</label>
                <input 
                  type="number"
                  {...register('stockQuantity', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Media & Merchandising</h3>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Image URL</label>
              <div className="flex gap-3">
                 <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      {...register('image')}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-indigo-400"
                      placeholder="https://images.unsplash.com/..."
                    />
                 </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" {...register('isFeatured')} className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" {...register('isHotDeal')} className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Hot Deal</span>
              </label>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-8 -mb-8 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/80 backdrop-blur px-8 py-5">
            <button 
              type="button"
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-70 disabled:scale-100"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving Changes...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
