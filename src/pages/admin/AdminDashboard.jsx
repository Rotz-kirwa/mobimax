import { useEffect, useMemo, useState } from 'react';
import {
  Boxes,
  ChartNoAxesColumn,
  ChevronRight,
  CreditCard,
  Download,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Upload,
  Users,
} from 'lucide-react';
import clsx from 'clsx';
import ProductEditorModal from '../../components/admin/ProductEditorModal';
import HeroBannerEditorModal from '../../components/admin/HeroBannerEditorModal';
import { useAdminSession } from '../../hooks/useAdminSession';
import {
  CATALOG_SNAPSHOT_VERSION,
  formatCurrency,
  getProductAvailability,
  PRODUCT_IMAGE_FALLBACK,
} from '../../lib/catalog';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useOrderStore } from '../../store/useOrderStore';

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: PackagePlus },
  { id: 'categories', label: 'Categories', icon: Boxes },
  { id: 'brands', label: 'Brands', icon: Tags },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'storefront', label: 'Storefront', icon: ImagePlus },
  { id: 'backups', label: 'Backups', icon: RefreshCcw },
];

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>
          <p className="mt-4 text-4xl font-black tracking-tighter text-slate-950">
            {value}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">{hint}</p>
        </div>
        <div className={clsx('flex h-14 w-14 items-center justify-center rounded-[20px]', tone)}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function NoticeBanner({ notice }) {
  if (!notice) {
    return null;
  }

  const tone =
    notice.type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : notice.type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <div className={clsx('mb-6 rounded-[24px] border px-5 py-4 shadow-sm', tone)}>
      <p className="text-[10px] font-black uppercase tracking-[0.25em]">Admin Update</p>
      <p className="mt-2 text-sm font-bold">{notice.message}</p>
    </div>
  );
}

function EmptyPanel({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <p className="text-lg font-black uppercase tracking-tight text-slate-950">{title}</p>
      <p className="mt-3 text-sm font-medium text-slate-500">{description}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { username } = useAdminSession();
  const {
    products,
    categories,
    brands,
    heroBanners,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    saveBrand,
    deleteBrand,
    saveHeroBanner,
    deleteHeroBanner,
    importCatalogSnapshot,
    resetCatalog,
  } = useCatalogStore();
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrderStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [productQuery, setProductQuery] = useState('');
  const [customerQuery, setCustomerQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [bannerEditorOpen, setBannerEditorOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [categoryDraft, setCategoryDraft] = useState({
    id: '',
    name: '',
    icon: 'Package',
    subcategories: '',
  });
  const [brandDraft, setBrandDraft] = useState({ id: '', name: '' });
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.brand, product.category, product.subcategory, product.sku]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [products, productQuery]);

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.status === 'low_stock' || product.stockQuantity <= 3),
    [products]
  );

  const inventoryValue = useMemo(
    () => products.reduce((total, product) => total + product.price * product.stockQuantity, 0),
    [products]
  );

  const paidRevenue = useMemo(
    () =>
      orders
        .filter((order) => order.paymentStatus === 'confirmed')
        .reduce((total, order) => total + Number(order.totals?.total || 0), 0),
    [orders]
  );

  const categoryProductCounts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.id).length,
      })),
    [categories, products]
  );

  const brandProductCounts = useMemo(
    () =>
      brands.map((brand) => ({
        ...brand,
        count: products.filter(
          (product) => product.brand.toLowerCase() === brand.name.toLowerCase()
        ).length,
      })),
    [brands, products]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const customers = useMemo(() => {
    const grouped = new Map();

    orders.forEach((order) => {
      const firstName = order.customer?.firstName || 'Guest';
      const lastName = order.customer?.lastName || 'Customer';
      const phone = String(order.customer?.phone || '').trim();
      const key = phone || order.reference || order.id;
      const city = order.customer?.city || 'Unspecified';
      const address = order.customer?.address || 'Address not captured';

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          name: `${firstName} ${lastName}`.trim(),
          phone,
          city,
          address,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderAt: order.createdAt,
          lastReference: order.reference || order.id,
          paymentStates: new Set(),
        });
      }

      const record = grouped.get(key);
      record.ordersCount += 1;
      record.totalSpent += Number(order.totals?.total || 0);
      record.lastOrderAt =
        new Date(order.createdAt).getTime() > new Date(record.lastOrderAt).getTime()
          ? order.createdAt
          : record.lastOrderAt;
      record.lastReference = order.reference || order.id;
      record.city = order.customer?.city || record.city;
      record.address = order.customer?.address || record.address;
      record.paymentStates.add(order.paymentStatus || 'pending');
    });

    return Array.from(grouped.values())
      .map((record) => ({
        ...record,
        paymentStates: Array.from(record.paymentStates),
      }))
      .sort((left, right) => new Date(right.lastOrderAt) - new Date(left.lastOrderAt));
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.name,
        customer.phone,
        customer.city,
        customer.address,
        customer.lastReference,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [customers, customerQuery]);

  const pushNotice = (type, message) => {
    setNotice({ type, message, id: Date.now() });
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => undefined);

    window.location.assign('/admin/login');
  };

  const openProductEditor = (product = null) => {
    setEditingProduct(product);
    setEditorOpen(true);
  };

  const handleSaveProduct = (productInput) => {
    saveProduct(productInput);
    setEditorOpen(false);
    setEditingProduct(null);
    pushNotice('success', `${productInput.name} is now saved in the catalog.`);
  };

  const handleDeleteProduct = (productId, productName) => {
    const confirmed = window.confirm(`Delete "${productName}" from the catalog?`);

    if (!confirmed) {
      return;
    }

    deleteProduct(productId);
    pushNotice('success', `${productName} was removed from the catalog.`);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    if (!categoryDraft.name.trim()) {
      pushNotice('error', 'Add a category name before saving.');
      return;
    }

    const isEditing = Boolean(categoryDraft.id);

    saveCategory({
      id: categoryDraft.id || undefined,
      name: categoryDraft.name.trim(),
      icon: categoryDraft.icon.trim() || 'Package',
      subcategories: categoryDraft.subcategories
        .split(',')
        .map((subcategory) => subcategory.trim())
        .filter(Boolean),
    });

    setCategoryDraft({ id: '', name: '', icon: 'Package', subcategories: '' });
    pushNotice('success', isEditing ? 'Category updated successfully.' : 'Category created successfully.');
  };

  const handleDeleteCategory = (category) => {
    const confirmed = window.confirm(`Delete the "${category.name}" category?`);

    if (!confirmed) {
      return;
    }

    const didDelete = deleteCategory(category.id);

    if (!didDelete) {
      pushNotice('error', 'Cannot delete a category that still has products assigned.');
      return;
    }

    pushNotice('success', `${category.name} was removed from the category list.`);
  };

  const handleBrandSubmit = (event) => {
    event.preventDefault();

    if (!brandDraft.name.trim()) {
      pushNotice('error', 'Add a brand name before saving.');
      return;
    }

    const isEditing = Boolean(brandDraft.id);

    saveBrand({
      id: brandDraft.id || undefined,
      name: brandDraft.name.trim(),
    });

    setBrandDraft({ id: '', name: '' });
    pushNotice('success', isEditing ? 'Brand updated successfully.' : 'Brand created successfully.');
  };

  const handleDeleteBrand = (brand) => {
    const confirmed = window.confirm(`Delete the "${brand.name}" brand?`);

    if (!confirmed) {
      return;
    }

    const didDelete = deleteBrand(brand.id);

    if (!didDelete) {
      pushNotice('error', 'Cannot delete a brand that still has products assigned.');
      return;
    }

    pushNotice('success', `${brand.name} was removed from the brand directory.`);
  };

  const openBannerEditor = (banner = null) => {
    setEditingBanner(banner);
    setBannerEditorOpen(true);
  };

  const handleSaveBanner = (bannerInput) => {
    saveHeroBanner(bannerInput);
    setBannerEditorOpen(false);
    setEditingBanner(null);
    pushNotice('success', `${bannerInput.title} is now live in the hero rotation.`);
  };

  const handleDeleteBanner = (banner) => {
    const confirmed = window.confirm(`Delete the "${banner.title}" hero banner?`);

    if (!confirmed) {
      return;
    }

    deleteHeroBanner(banner.id);
    pushNotice('success', `${banner.title} was removed from the storefront hero.`);
  };

  const handleExportCatalog = () => {
    const snapshot = {
      version: CATALOG_SNAPSHOT_VERSION,
      exportedAt: new Date().toISOString(),
      products,
      categories,
      brands,
      heroBanners,
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mobimax-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    pushNotice('success', 'Catalog snapshot exported successfully.');
  };

  const handleImportCatalog = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const snapshot = JSON.parse(raw);

      importCatalogSnapshot(snapshot);
      setCategoryDraft({ id: '', name: '', icon: 'Package', subcategories: '' });
      setBrandDraft({ id: '', name: '' });
      pushNotice('success', 'Catalog snapshot imported successfully.');
    } catch {
      pushNotice('error', 'The selected file is not a valid Mobimax catalog snapshot.');
    } finally {
      event.target.value = '';
    }
  };

  const handleResetCatalog = () => {
    const confirmed = window.confirm(
      'Reset the catalog back to the seeded default state? This will replace your current locally saved catalog.'
    );

    if (!confirmed) {
      return;
    }

    resetCatalog();
    setCategoryDraft({ id: '', name: '', icon: 'Package', subcategories: '' });
    setBrandDraft({ id: '', name: '' });
    pushNotice('success', 'Catalog restored to the default Mobimax seed data.');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <ProductEditorModal
        open={editorOpen}
        initialProduct={editingProduct}
        categories={categories}
        brands={brands}
        onClose={() => {
          setEditorOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      <HeroBannerEditorModal
        open={bannerEditorOpen}
        initialBanner={editingBanner}
        onClose={() => {
          setBannerEditorOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
      />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-950 px-6 py-8 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">Mobimax Admin</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
                Operations Console
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Signed In
            </p>
            <p className="mt-3 text-sm font-black uppercase tracking-tight text-white">
              {username || 'Admin'}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Run the storefront, manage inventory, and keep merchandising polished from one dashboard.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-black uppercase tracking-[0.18em] transition',
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-10 grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Catalog Health
              </p>
              <p className="mt-4 text-3xl font-black tracking-tighter text-white">
                {products.length}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Products live across {categories.length} categories, {brands.length} brands, and{' '}
                {heroBanners.length} hero banners.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-200 transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="px-4 py-6 md:px-8 lg:px-10 lg:py-8">
          <NoticeBanner notice={notice} />

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Performance Snapshot"
                title="Dashboard Overview"
                description="A top-level view of the commercial health of the storefront, from inventory and merchandising to recent order activity."
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <MetricCard
                  icon={Boxes}
                  label="Catalog Products"
                  value={products.length}
                  hint="Active storefront items currently available to browse."
                  tone="bg-emerald-500/10 text-emerald-600"
                />
                <MetricCard
                  icon={ChartNoAxesColumn}
                  label="Inventory Value"
                  value={formatCurrency(inventoryValue)}
                  hint="Approximate stock value based on price × on-hand quantity."
                  tone="bg-blue-500/10 text-blue-600"
                />
                <MetricCard
                  icon={CreditCard}
                  label="Paid Revenue"
                  value={formatCurrency(paidRevenue)}
                  hint="Revenue from locally recorded confirmed orders."
                  tone="bg-amber-500/10 text-amber-600"
                />
                <MetricCard
                  icon={ShoppingBag}
                  label="Orders"
                  value={orders.length}
                  hint="Customer orders recorded through the checkout flow."
                  tone="bg-violet-500/10 text-violet-600"
                />
                <MetricCard
                  icon={Users}
                  label="Customers"
                  value={customers.length}
                  hint="Unique customer profiles derived from confirmed order records."
                  tone="bg-pink-500/10 text-pink-600"
                />
                <MetricCard
                  icon={ImagePlus}
                  label="Hero Banners"
                  value={heroBanners.length}
                  hint="Merchandising slides currently feeding the homepage carousel."
                  tone="bg-slate-900/10 text-slate-700"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">
                        Recent Orders
                      </p>
                      <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-slate-950">
                        Latest Checkout Activity
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      Orders <ChevronRight size={14} />
                    </button>
                  </div>

                  {recentOrders.length > 0 ? (
                    <div className="mt-6 space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                              {order.reference || order.id}
                            </p>
                            <p className="mt-2 text-base font-black uppercase tracking-tight text-slate-950">
                              {(order.customer?.firstName || 'Guest')}{' '}
                              {(order.customer?.lastName || 'Customer')}
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-500">
                              {order.items?.length || 0} item(s) • {formatCurrency(order.totals?.total || 0)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">
                              {order.paymentStatus}
                            </span>
                            <span className="rounded-full bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel
                      title="No Orders Yet"
                      description="Orders will appear here as soon as checkout completes and records a payment-confirmed order."
                    />
                  )}
                </section>

                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">
                    Inventory Alerts
                  </p>
                  <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-slate-950">
                    Low Stock Watchlist
                  </h3>

                  {lowStockProducts.length > 0 ? (
                    <div className="mt-6 space-y-3">
                      {lowStockProducts.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-4"
                        >
                          <p className="text-sm font-black uppercase tracking-tight text-slate-950">
                            {product.name}
                          </p>
                          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
                            {product.stockQuantity} left in stock
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel
                      title="No low stock alerts right now."
                      description="All catalog items have comfortable stock levels at the moment."
                    />
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Catalog Control"
                title="Product Management"
                description="Create, edit, price, stock, flag, and merchandise products that feed the storefront."
                action={
                  <button
                    type="button"
                    onClick={() => openProductEditor()}
                    className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
                  >
                    <PackagePlus size={16} />
                    Add Product
                  </button>
                }
              />

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full max-w-xl">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={productQuery}
                      onChange={(event) => setProductQuery(event.target.value)}
                      placeholder="Search by name, brand, category, or SKU"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-950 outline-none transition focus:border-emerald-400"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                      {filteredProducts.length} results
                    </span>
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-700">
                      {lowStockProducts.length} low stock
                    </span>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[960px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Flags', 'Actions'].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const availability = getProductAvailability(product);

                        return (
                          <tr key={product.id} className="border-b border-slate-100">
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] bg-slate-50 p-3">
                                  <img
                                    src={product.image || PRODUCT_IMAGE_FALLBACK}
                                    alt={product.name}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-black uppercase tracking-tight text-slate-950">
                                    {product.name}
                                  </p>
                                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {product.brand} • {product.sku}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5 text-sm font-bold capitalize text-slate-600">
                              {product.category}
                              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                                {product.subcategory || 'General'}
                              </div>
                            </td>
                            <td className="px-4 py-5 text-sm font-black text-slate-950">
                              {formatCurrency(product.price)}
                              {product.oldPrice ? (
                                <div className="mt-1 text-xs font-bold text-slate-400 line-through">
                                  {formatCurrency(product.oldPrice)}
                                </div>
                              ) : null}
                            </td>
                            <td className="px-4 py-5 text-sm font-black text-slate-950">
                              {product.stockQuantity}
                            </td>
                            <td className="px-4 py-5">
                              <span
                                className={clsx(
                                  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em]',
                                  availability.tone,
                                  availability.dot === 'bg-brand-green'
                                    ? 'bg-emerald-50'
                                    : availability.dot === 'bg-amber-400'
                                      ? 'bg-amber-50'
                                      : availability.dot === 'bg-red-500'
                                        ? 'bg-red-50'
                                        : 'bg-blue-50'
                                )}
                              >
                                <span className={clsx('h-2 w-2 rounded-full', availability.dot)}></span>
                                {availability.label}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex flex-wrap gap-2">
                                {product.isNew && (
                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                    New
                                  </span>
                                )}
                                {product.flags?.isFeatured && (
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                                    Featured
                                  </span>
                                )}
                                {product.flags?.isHotDeal && (
                                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                                    Hot
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => openProductEditor(product)}
                                  className="rounded-2xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="rounded-2xl border border-red-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Taxonomy"
                title="Category Management"
                description="Maintain the storefront navigation structure and keep subcategories aligned with the products shoppers browse."
              />

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <form
                  onSubmit={handleCategorySubmit}
                  className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">
                    {categoryDraft.id ? 'Edit Category' : 'Add Category'}
                  </p>
                  <div className="mt-6 space-y-4">
                    <input
                      type="text"
                      value={categoryDraft.name}
                      onChange={(event) =>
                        setCategoryDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-950 outline-none transition focus:border-emerald-400"
                      placeholder="Category name"
                    />
                    <input
                      type="text"
                      value={categoryDraft.icon}
                      onChange={(event) =>
                        setCategoryDraft((current) => ({ ...current, icon: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-950 outline-none transition focus:border-emerald-400"
                      placeholder="Lucide icon name"
                    />
                    <textarea
                      rows="4"
                      value={categoryDraft.subcategories}
                      onChange={(event) =>
                        setCategoryDraft((current) => ({
                          ...current,
                          subcategories: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-medium text-slate-950 outline-none transition focus:border-emerald-400"
                      placeholder="Comma-separated subcategories"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
                    >
                      {categoryDraft.id ? 'Save Category' : 'Create Category'}
                    </button>
                  </div>
                </form>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-4">
                    {categoryProductCounts.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-lg font-black uppercase tracking-tight text-slate-950">
                              {category.name}
                            </p>
                            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                              {category.count} product(s)
                            </p>
                            <p className="mt-3 text-sm font-medium text-slate-500">
                              {(category.subcategories || []).join(', ') || 'No subcategories yet.'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setCategoryDraft({
                                  id: category.id,
                                  name: category.name,
                                  icon: category.icon || 'Package',
                                  subcategories: (category.subcategories || []).join(', '),
                                })
                              }
                              className="rounded-2xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(category)}
                              className="rounded-2xl border border-red-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Brand Directory"
                title="Brand Management"
                description="Control which brands are available in the catalog and keep the storefront brand taxonomy clean and searchable."
              />

              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <form
                  onSubmit={handleBrandSubmit}
                  className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">
                    {brandDraft.id ? 'Edit Brand' : 'Add Brand'}
                  </p>
                  <div className="mt-6 space-y-4">
                    <input
                      type="text"
                      value={brandDraft.name}
                      onChange={(event) =>
                        setBrandDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-950 outline-none transition focus:border-emerald-400"
                      placeholder="Brand name"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
                    >
                      {brandDraft.id ? 'Save Brand' : 'Create Brand'}
                    </button>
                  </div>
                </form>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {brandProductCounts.map((brand) => (
                      <div
                        key={brand.id}
                        className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5"
                      >
                        <p className="text-lg font-black uppercase tracking-tight text-slate-950">
                          {brand.name}
                        </p>
                        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {brand.count} product(s)
                        </p>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setBrandDraft({ id: brand.id, name: brand.name })}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBrand(brand)}
                            className="rounded-2xl border border-red-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Fulfilment Desk"
                title="Order Management"
                description="Track customer orders, review payment state, and keep fulfilment status aligned with delivery progress."
              />

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Fulfilment'].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-slate-100">
                            <td className="px-4 py-5">
                              <p className="text-sm font-black uppercase tracking-tight text-slate-950">
                                {order.reference || order.id}
                              </p>
                              <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </td>
                            <td className="px-4 py-5">
                              <p className="text-sm font-black uppercase tracking-tight text-slate-950">
                                {(order.customer?.firstName || 'Guest')}{' '}
                                {(order.customer?.lastName || 'Customer')}
                              </p>
                              <p className="mt-2 text-sm font-medium text-slate-500">
                                {order.customer?.phone ? `+${String(order.customer.phone).replace(/^\+/, '')}` : 'No phone'}
                              </p>
                            </td>
                            <td className="px-4 py-5 text-sm font-bold text-slate-600">
                              {order.items?.length || 0} item(s)
                            </td>
                            <td className="px-4 py-5 text-sm font-black text-slate-950">
                              {formatCurrency(order.totals?.total || 0)}
                            </td>
                            <td className="px-4 py-5">
                              <select
                                value={order.paymentStatus}
                                onChange={(event) =>
                                  updatePaymentStatus(order.id, event.target.value)
                                }
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 outline-none transition focus:border-emerald-400"
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                              </select>
                            </td>
                            <td className="px-4 py-5">
                              <select
                                value={order.status}
                                onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 outline-none transition focus:border-emerald-400"
                              >
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyPanel
                    title="No Orders Recorded Yet"
                    description="Orders will appear here after the checkout flow confirms payment and records them into the store state."
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Customer Desk"
                title="Customer Overview"
                description="Review your active customer base, spending patterns, and the latest fulfilment touchpoints from recorded orders."
              />

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full max-w-xl">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={customerQuery}
                      onChange={(event) => setCustomerQuery(event.target.value)}
                      placeholder="Search by name, phone, city, address, or order reference"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-950 outline-none transition focus:border-emerald-400"
                    />
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                    {filteredCustomers.length} customer profile(s)
                  </span>
                </div>

                {filteredCustomers.length > 0 ? (
                  <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-lg font-black uppercase tracking-tight text-slate-950">
                              {customer.name}
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-500">
                              {customer.phone ? `+${customer.phone.replace(/^\+/, '')}` : 'No phone captured'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {customer.paymentStates.map((state) => (
                              <span
                                key={state}
                                className={clsx(
                                  'rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em]',
                                  state === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : state === 'failed'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                                )}
                              >
                                {state}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-[18px] bg-white px-4 py-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                              Orders
                            </p>
                            <p className="mt-2 text-xl font-black tracking-tight text-slate-950">
                              {customer.ordersCount}
                            </p>
                          </div>
                          <div className="rounded-[18px] bg-white px-4 py-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                              Total Spend
                            </p>
                            <p className="mt-2 text-xl font-black tracking-tight text-slate-950">
                              {formatCurrency(customer.totalSpent)}
                            </p>
                          </div>
                          <div className="rounded-[18px] bg-white px-4 py-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                              Last Order
                            </p>
                            <p className="mt-2 text-sm font-black uppercase tracking-tight text-slate-950">
                              {new Date(customer.lastOrderAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[18px] bg-white px-4 py-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                            Delivery Details
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-700">
                            {customer.city} • {customer.address}
                          </p>
                          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Latest reference: {customer.lastReference}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyPanel
                    title="No customer profiles matched"
                    description="Customer records appear automatically as soon as orders are recorded through checkout."
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'storefront' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Merchandising"
                title="Storefront Hero Management"
                description="Control the homepage hero rotation so campaigns, launches, and seasonal promotions stay fresh and intentional."
                action={
                  <button
                    type="button"
                    onClick={() => openBannerEditor()}
                    className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
                  >
                    <ImagePlus size={16} />
                    Add Hero Banner
                  </button>
                }
              />

              {heroBanners.length > 0 ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  {heroBanners.map((banner) => (
                    <article
                      key={banner.id}
                      className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={banner.bg || PRODUCT_IMAGE_FALLBACK}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
                        <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                            {banner.eyebrow}
                          </p>
                          <h3 className="mt-4 text-3xl font-black uppercase tracking-tight text-white">
                            {banner.title}
                          </h3>
                          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-200">
                            {banner.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 p-6">
                        <div className="rounded-[20px] bg-slate-50 px-4 py-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                            Destination
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-700">{banner.link}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => openBannerEditor(banner)}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                          >
                            Edit Banner
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(banner)}
                            className="rounded-2xl border border-red-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-50"
                          >
                            Delete Banner
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyPanel
                  title="No hero banners configured"
                  description="Add the first hero banner to power the homepage carousel with campaign-ready merchandising."
                />
              )}
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-8">
              <SectionTitle
                eyebrow="Safety Net"
                title="Catalog Backups & Recovery"
                description="Move catalog state between browsers, recover merchandising work quickly, and keep an exportable snapshot of the storefront dataset."
              />

              <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-700">
                  Important Note
                </p>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-amber-900">
                  The current admin catalog persists in local browser storage. These backup tools make that safer and more portable, but they do not replace a shared multi-user database yet.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-emerald-500/10 text-emerald-600">
                    <Download size={22} />
                  </div>
                  <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-slate-950">
                    Export Snapshot
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                    Download the current products, categories, brands, and hero banners as a versioned JSON snapshot.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportCatalog}
                    className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-slate-800"
                  >
                    <Download size={16} />
                    Export Catalog
                  </button>
                </section>

                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-blue-500/10 text-blue-600">
                    <Upload size={22} />
                  </div>
                  <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-slate-950">
                    Import Snapshot
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                    Restore a previously exported Mobimax catalog file and replace the current local catalog state.
                  </p>
                  <label className="mt-6 inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-500">
                    <Upload size={16} />
                    Import Catalog
                    <input
                      type="file"
                      accept="application/json"
                      hidden
                      onChange={handleImportCatalog}
                    />
                  </label>
                </section>

                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-500/10 text-red-600">
                    <RefreshCcw size={22} />
                  </div>
                  <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-slate-950">
                    Reset to Seed
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                    Restore the original seeded catalog if you need a clean baseline for demos, QA, or recovery.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetCatalog}
                    className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-red-500"
                  >
                    <RefreshCcw size={16} />
                    Reset Catalog
                  </button>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
