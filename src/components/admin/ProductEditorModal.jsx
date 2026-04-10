import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Star, Trash2, UploadCloud, X } from 'lucide-react';
import clsx from 'clsx';
import {
  createEmptyProductDraft,
  readImageFileAsDataUrl,
  validateImageFile,
  validateProductDraft,
} from '../../lib/catalog';

function buildDraftFromProduct(product, categories, brands) {
  if (!product) {
    return createEmptyProductDraft(categories, brands);
  }

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory || '',
    sku: product.sku || '',
    price: String(product.price || ''),
    oldPrice: product.oldPrice ? String(product.oldPrice) : '',
    stockQuantity: product.stockQuantity ?? 0,
    status: product.status || 'in_stock',
    condition: product.condition || 'New',
    description: product.description || '',
    specsText: Array.isArray(product.specs) ? product.specs.join('\n') : '',
    images: product.images || (product.image ? [product.image] : []),
    thumbnailIndex: product.thumbnailIndex || 0,
    isNew: Boolean(product.isNew),
    flags: {
      isFeatured: Boolean(product.flags?.isFeatured),
      isHotDeal: Boolean(product.flags?.isHotDeal),
      isOffer: Boolean(product.flags?.isOffer),
      isBestseller: Boolean(product.flags?.isBestseller),
    },
    rating: String(product.rating || ''),
    reviews: String(product.reviews || ''),
  };
}

export default function ProductEditorModal({
  open,
  initialProduct,
  categories,
  brands,
  onClose,
  onSave,
}) {
  const [draft, setDraft] = useState(() => buildDraftFromProduct(initialProduct, categories, brands));
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === draft.category),
    [categories, draft.category]
  );

  useEffect(() => {
    setDraft(buildDraftFromProduct(initialProduct, categories, brands));
    setErrors({});
    setUploadError('');
  }, [initialProduct, categories, brands, open]);

  if (!open) {
    return null;
  }

  const setField = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const setFlag = (flag, value) => {
    setDraft((current) => ({
      ...current,
      flags: {
        ...current.flags,
        [flag]: value,
      },
    }));
  };

  const handleCategoryChange = (value) => {
    const nextCategory = categories.find((category) => category.id === value);
    setDraft((current) => ({
      ...current,
      category: value,
      subcategory: nextCategory?.subcategories?.[0] || '',
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const nextImages = [];

      for (const file of files) {
        const validationMessage = validateImageFile(file);

        if (validationMessage) {
          throw new Error(validationMessage);
        }

        const dataUrl = await readImageFileAsDataUrl(file);
        nextImages.push(dataUrl);
      }

      setDraft((current) => ({
        ...current,
        images: [...current.images, ...nextImages],
      }));
    } catch (error) {
      setUploadError(error.message || 'Unable to read the selected image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setDraft((current) => {
      const images = current.images.filter((_, imageIndex) => imageIndex !== index);
      const thumbnailIndex = Math.min(current.thumbnailIndex, Math.max(images.length - 1, 0));
      return {
        ...current,
        images,
        thumbnailIndex,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateProductDraft(draft);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      id: draft.id || undefined,
      name: draft.name.trim(),
      brand: draft.brand.trim(),
      category: draft.category,
      subcategory: draft.subcategory.trim(),
      sku: draft.sku.trim(),
      price: Number(draft.price),
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : null,
      stockQuantity: Number(draft.stockQuantity),
      status: draft.status,
      condition: draft.condition,
      description: draft.description.trim(),
      specs: draft.specsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      images: draft.images,
      thumbnailIndex: draft.thumbnailIndex,
      isNew: Boolean(draft.isNew),
      rating: Number(draft.rating || 0),
      reviews: Number(draft.reviews || 0),
      flags: {
        ...draft.flags,
        isNewArrival: Boolean(draft.isNew),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-stretch justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-white/10 bg-slate-950 text-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
              Admin Editor
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              {initialProduct ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Product Name
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => setField('name', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="e.g. iPhone 15 Pro Max 256GB"
              />
              {errors.name && <p className="mt-2 text-xs font-bold text-red-300">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Brand
              </label>
              <input
                type="text"
                list="admin-brand-list"
                value={draft.brand}
                onChange={(event) => setField('brand', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="Apple"
              />
              {errors.brand && <p className="mt-2 text-xs font-bold text-red-300">{errors.brand}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                SKU
              </label>
              <input
                type="text"
                value={draft.sku}
                onChange={(event) => setField('sku', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="MBX-APP-IP15PM"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Category
              </label>
              <select
                value={draft.category}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-slate-950">
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-2 text-xs font-bold text-red-300">{errors.category}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Subcategory
              </label>
              <input
                type="text"
                list="admin-subcategory-list"
                value={draft.subcategory}
                onChange={(event) => setField('subcategory', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="Subcategory"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Selling Price
              </label>
              <input
                type="number"
                value={draft.price}
                onChange={(event) => setField('price', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="0"
              />
              {errors.price && <p className="mt-2 text-xs font-bold text-red-300">{errors.price}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Compare-at Price
              </label>
              <input
                type="number"
                value={draft.oldPrice}
                onChange={(event) => setField('oldPrice', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="Optional"
              />
              {errors.oldPrice && <p className="mt-2 text-xs font-bold text-red-300">{errors.oldPrice}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Stock Quantity
              </label>
              <input
                type="number"
                value={draft.stockQuantity}
                onChange={(event) => setField('stockQuantity', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              />
              {errors.stockQuantity && (
                <p className="mt-2 text-xs font-bold text-red-300">{errors.stockQuantity}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Status
              </label>
              <select
                value={draft.status}
                onChange={(event) => setField('status', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              >
                <option value="in_stock" className="bg-slate-950">
                  In Stock
                </option>
                <option value="low_stock" className="bg-slate-950">
                  Low Stock
                </option>
                <option value="out_of_stock" className="bg-slate-950">
                  Out of Stock
                </option>
                <option value="preorder" className="bg-slate-950">
                  Pre-Order
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Condition
              </label>
              <select
                value={draft.condition}
                onChange={(event) => setField('condition', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              >
                <option value="New" className="bg-slate-950">
                  New
                </option>
                <option value="Ex-UK Used" className="bg-slate-950">
                  Ex-UK Used
                </option>
                <option value="Refurbished" className="bg-slate-950">
                  Refurbished
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Rating
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={draft.rating}
                onChange={(event) => setField('rating', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Reviews
              </label>
              <input
                type="number"
                min="0"
                value={draft.reviews}
                onChange={(event) => setField('reviews', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Product Description
              </label>
              <textarea
                rows="4"
                value={draft.description}
                onChange={(event) => setField('description', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-white outline-none transition focus:border-emerald-400"
                placeholder="Write a polished product description..."
              />
              {errors.description && (
                <p className="mt-2 text-xs font-bold text-red-300">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Specifications
              </label>
              <textarea
                rows="5"
                value={draft.specsText}
                onChange={(event) => setField('specsText', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-white outline-none transition focus:border-emerald-400"
                placeholder={'One feature per line\nA17 Pro chip\n48MP camera\n6.7" display'}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                  Product Images
                </p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  Upload multiple images, then choose the main thumbnail shoppers see first.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400">
                <UploadCloud size={16} />
                {isUploading ? 'Uploading…' : 'Upload Images'}
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={handleImageUpload} />
              </label>
            </div>

            {(errors.images || uploadError) && (
              <p className="mt-4 text-xs font-bold text-red-300">{errors.images || uploadError}</p>
            )}

            {draft.images.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {draft.images.map((image, index) => (
                  <div
                    key={`${image.slice(0, 20)}-${index}`}
                    className={clsx(
                      'overflow-hidden rounded-[24px] border p-3 transition',
                      draft.thumbnailIndex === index
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-white/10 bg-slate-900/40'
                    )}
                  >
                    <div className="aspect-square overflow-hidden rounded-[18px] bg-white p-3">
                      <img src={image} alt={`Upload preview ${index + 1}`} className="h-full w-full object-contain" />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setField('thumbnailIndex', index)}
                        className={clsx(
                          'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition',
                          draft.thumbnailIndex === index
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-white/10 text-slate-200 hover:bg-white/15'
                        )}
                      >
                        <Star size={12} />
                        {draft.thumbnailIndex === index ? 'Primary' : 'Set Primary'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-slate-900/30 px-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/5 text-slate-300">
                  <ImagePlus size={28} />
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                  No Images Yet
                </p>
                <p className="mt-2 max-w-sm text-sm font-medium text-slate-400">
                  Upload the gallery now so this product renders with a proper thumbnail and product detail carousel.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
              Merchandising Flags
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['isNew', 'New Arrival'],
                ['isFeatured', 'Featured Product'],
                ['isHotDeal', 'Hot Deal'],
                ['isOffer', 'Discount Offer'],
                ['isBestseller', 'Best Seller'],
              ].map(([key, label]) => {
                const checked = key === 'isNew' ? draft.isNew : draft.flags[key];

                return (
                  <label
                    key={key}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4"
                  >
                    <span className="text-sm font-black uppercase tracking-tight text-white">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(checked)}
                      onChange={(event) =>
                        key === 'isNew'
                          ? setField('isNew', event.target.checked)
                          : setFlag(key, event.target.checked)
                      }
                      className="h-5 w-5 rounded border-white/10 bg-white/5 text-emerald-500"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-200 transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
            >
              {initialProduct ? 'Save Product' : 'Create Product'}
            </button>
          </div>
        </form>

        <datalist id="admin-brand-list">
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name} />
          ))}
        </datalist>

        <datalist id="admin-subcategory-list">
          {(activeCategory?.subcategories || []).map((subcategory) => (
            <option key={subcategory} value={subcategory} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
