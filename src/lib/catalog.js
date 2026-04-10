import {
  brands as seedBrandNames,
  categories as seedCategories,
  heroBanners as seedHeroBanners,
  products as seedProducts,
} from '../data/mockData';

export const CATALOG_SNAPSHOT_VERSION = 1;

export const PRODUCT_IMAGE_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f5f7f9" />
      <rect x="200" y="120" width="400" height="560" rx="44" fill="#ffffff" stroke="#d7dde4" stroke-width="12" />
      <rect x="266" y="206" width="268" height="330" rx="28" fill="#eef2f6" />
      <circle cx="400" cy="612" r="22" fill="#d7dde4" />
      <text x="400" y="390" text-anchor="middle" font-size="52" font-family="Arial, sans-serif" font-weight="700" fill="#9aa4af">
        MobiMax
      </text>
    </svg>
  `);

const DEFAULT_CATEGORY_ICONS = {
  phones: 'Smartphone',
  tablets: 'Tablet',
  computing: 'Laptop',
  audio: 'Speaker',
  wearables: 'Watch',
  gaming: 'Gamepad2',
  entertainment: 'Monitor',
  accessories: 'Headphones',
};

function createId(prefix = 'item') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatCurrency(value) {
  return `KSh ${Number(value || 0).toLocaleString()}`;
}

export function buildProductDescription(product) {
  const specs = (product.specs || []).slice(0, 3).join(', ');
  return `Discover the ${product.name} from ${product.brand}. Built for premium everyday use with standout features like ${specs || 'trusted performance and polished design'}.`;
}

export function normalizeCategoryRecord(category) {
  return {
    id: category.id || slugify(category.name) || createId('cat'),
    name: category.name || 'Untitled Category',
    slug: category.slug || slugify(category.name || category.id),
    icon: category.icon || DEFAULT_CATEGORY_ICONS[category.id] || 'Package',
    subcategories: Array.isArray(category.subcategories)
      ? [...new Set(category.subcategories.filter(Boolean))]
      : [],
  };
}

export function normalizeBrandRecord(brand) {
  if (typeof brand === 'string') {
    return {
      id: slugify(brand),
      slug: slugify(brand),
      name: brand,
    };
  }

  const name = brand?.name || 'Untitled Brand';

  return {
    id: brand.id || slugify(name),
    slug: brand.slug || slugify(name),
    name,
  };
}

export function getProductPrimaryImage(product) {
  if (Array.isArray(product.images) && product.images[product.thumbnailIndex || 0]) {
    return product.images[product.thumbnailIndex || 0];
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  return product.image || PRODUCT_IMAGE_FALLBACK;
}

export function normalizeProductRecord(product) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : [product.image || PRODUCT_IMAGE_FALLBACK];

  const safeImages = images.length > 0 ? images : [PRODUCT_IMAGE_FALLBACK];
  const price = Number(product.price || 0);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const stockQuantity = Number.isFinite(Number(product.stockQuantity))
    ? Math.max(0, Number(product.stockQuantity))
    : product.status === 'out_of_stock'
      ? 0
      : product.condition === 'Ex-UK Used'
        ? 2
        : 12;
  const status =
    stockQuantity <= 0
      ? 'out_of_stock'
      : product.status && ['in_stock', 'low_stock', 'out_of_stock', 'preorder'].includes(product.status)
        ? product.status
        : stockQuantity <= 3
          ? 'low_stock'
          : 'in_stock';
  const name = product.name || 'Untitled Product';
  const brand = product.brand || 'Generic';
  const category = product.category || 'uncategorized';

  return {
    id: product.id || createId('prd'),
    slug: product.slug || slugify(name),
    sku: product.sku || `MBX-${slugify(brand).toUpperCase().slice(0, 4)}-${slugify(name).toUpperCase().slice(0, 8)}`,
    name,
    brand,
    category,
    subcategory: product.subcategory || '',
    condition: product.condition || 'New',
    description: product.description || buildProductDescription(product),
    specs: Array.isArray(product.specs) ? product.specs.filter(Boolean) : [],
    price,
    oldPrice,
    rating: Number(product.rating || 4.8),
    reviews: Number(product.reviews || 0),
    isNew: Boolean(product.isNew),
    images: safeImages,
    thumbnailIndex: Math.min(Math.max(Number(product.thumbnailIndex || 0), 0), safeImages.length - 1),
    image: getProductPrimaryImage({
      images: safeImages,
      thumbnailIndex: Math.min(Math.max(Number(product.thumbnailIndex || 0), 0), safeImages.length - 1),
    }),
    stockQuantity,
    status,
    flags: {
      isFeatured: Boolean(product.flags?.isFeatured),
      isHotDeal: Boolean(product.flags?.isHotDeal),
      isOffer: Boolean(product.flags?.isOffer),
      isNewArrival: Boolean(product.flags?.isNewArrival || product.isNew),
      isBestseller: Boolean(product.flags?.isBestseller),
    },
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeHeroBannerRecord(banner) {
  return {
    id: banner.id || createId('hero'),
    title: banner.title || 'Featured Collection',
    subtitle: banner.subtitle || 'Shop the latest arrivals.',
    bg: banner.bg || PRODUCT_IMAGE_FALLBACK,
    link: banner.link || '/shop',
    eyebrow: banner.eyebrow || 'Featured Drop',
  };
}

export function createCatalogSeed() {
  return createCatalogStateFromSnapshot({
    categories: seedCategories,
    brands: seedBrandNames,
    heroBanners: seedHeroBanners,
    products: seedProducts,
  });
}

export function createCatalogStateFromSnapshot(snapshot = {}) {
  return {
    categories: Array.isArray(snapshot.categories)
      ? snapshot.categories.map(normalizeCategoryRecord)
      : seedCategories.map(normalizeCategoryRecord),
    brands: Array.isArray(snapshot.brands)
      ? snapshot.brands.map(normalizeBrandRecord)
      : seedBrandNames.map(normalizeBrandRecord),
    heroBanners: Array.isArray(snapshot.heroBanners)
      ? snapshot.heroBanners.map(normalizeHeroBannerRecord)
      : seedHeroBanners.map(normalizeHeroBannerRecord),
    products: Array.isArray(snapshot.products)
      ? snapshot.products.map(normalizeProductRecord)
      : seedProducts.map(normalizeProductRecord),
  };
}

export function getProductAvailability(product) {
  switch (product.status) {
    case 'out_of_stock':
      return { label: 'Out of Stock', tone: 'text-red-500', dot: 'bg-red-500' };
    case 'low_stock':
      return { label: 'Low Stock', tone: 'text-amber-500', dot: 'bg-amber-400' };
    case 'preorder':
      return { label: 'Pre-Order', tone: 'text-blue-500', dot: 'bg-blue-500' };
    default:
      return { label: 'In Stock', tone: 'text-brand-green', dot: 'bg-brand-green' };
  }
}

export function productMatchesQuery(product, query) {
  const search = query.toLowerCase();
  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.sku,
    ...(product.specs || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(search);
}

export function createEmptyProductDraft(categories = [], brands = []) {
  return {
    id: '',
    name: '',
    brand: brands[0]?.name || '',
    category: categories[0]?.id || '',
    subcategory: categories[0]?.subcategories?.[0] || '',
    sku: '',
    price: '',
    oldPrice: '',
    stockQuantity: 12,
    status: 'in_stock',
    condition: 'New',
    description: '',
    specsText: '',
    images: [],
    thumbnailIndex: 0,
    isNew: false,
    flags: {
      isFeatured: false,
      isHotDeal: false,
      isOffer: false,
      isBestseller: false,
    },
    rating: '4.8',
    reviews: '0',
  };
}

export function createEmptyHeroBannerDraft() {
  return {
    id: '',
    eyebrow: 'Featured Drop',
    title: '',
    subtitle: '',
    link: '/shop',
    bg: '',
  };
}

export function validateProductDraft(draft) {
  const errors = {};

  if (!draft.name?.trim()) {
    errors.name = 'Product name is required.';
  }

  if (!draft.brand?.trim()) {
    errors.brand = 'Choose or enter a brand.';
  }

  if (!draft.category?.trim()) {
    errors.category = 'Choose a category.';
  }

  if (!String(draft.price).trim() || Number(draft.price) <= 0) {
    errors.price = 'Enter a valid selling price.';
  }

  if (draft.oldPrice && Number(draft.oldPrice) < Number(draft.price)) {
    errors.oldPrice = 'Compare-at price should be greater than or equal to the selling price.';
  }

  if (Number(draft.stockQuantity) < 0) {
    errors.stockQuantity = 'Stock quantity cannot be negative.';
  }

  if (!draft.description?.trim()) {
    errors.description = 'Add a product description.';
  }

  if (!Array.isArray(draft.images) || draft.images.length === 0) {
    errors.images = 'Upload at least one product image.';
  }

  return errors;
}

export function validateHeroBannerDraft(draft) {
  const errors = {};

  if (!draft.title?.trim()) {
    errors.title = 'Banner title is required.';
  }

  if (!draft.subtitle?.trim()) {
    errors.subtitle = 'Banner subtitle is required.';
  }

  if (!draft.link?.trim()) {
    errors.link = 'Add the banner destination link.';
  }

  if (!draft.bg?.trim()) {
    errors.bg = 'Choose a hero background image.';
  }

  return errors;
}

export async function readImageFileAsDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSizeMb = 4;

  if (!validTypes.includes(file.type)) {
    return 'Only JPG, PNG, or WEBP images are allowed.';
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return `Each image must be ${maxSizeMb}MB or smaller.`;
  }

  return '';
}
