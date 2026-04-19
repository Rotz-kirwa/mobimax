import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createCatalogStateFromSnapshot,
  createCatalogSeed,
  normalizeBrandRecord,
  normalizeCategoryRecord,
  normalizeHeroBannerRecord,
  normalizeProductRecord,
} from '../lib/catalog';

const seedState = createCatalogSeed();

function sortByName(items) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      ...seedState,

      resetCatalog: () => set(createCatalogSeed()),

      importCatalogSnapshot: (snapshot) => set(createCatalogStateFromSnapshot(snapshot)),

      saveProduct: (productInput) =>
        set((state) => {
          const normalized = normalizeProductRecord(productInput);
          const existingIndex = state.products.findIndex((product) => product.id === normalized.id);
          const products =
            existingIndex >= 0
              ? state.products.map((product) =>
                  product.id === normalized.id
                    ? { ...normalized, createdAt: product.createdAt || normalized.createdAt }
                    : product
                )
              : [normalized, ...state.products];

          const brandExists = state.brands.some(
            (brand) => brand.name.toLowerCase() === normalized.brand.toLowerCase()
          );
          const brands = brandExists
            ? state.brands
            : sortByName([...state.brands, normalizeBrandRecord(normalized.brand)]);

          return {
            products,
            brands,
          };
        }),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId),
        })),

      saveCategory: (categoryInput) =>
        set((state) => {
          const normalized = normalizeCategoryRecord(categoryInput);
          const exists = state.categories.some((category) => category.id === normalized.id);

          return {
            categories: sortByName(
              exists
                ? state.categories.map((category) =>
                    category.id === normalized.id ? normalized : category
                  )
                : [...state.categories, normalized]
            ),
          };
        }),

      deleteCategory: (categoryId) => {
        const isInUse = get().products.some((product) => product.category === categoryId);

        if (isInUse) {
          return false;
        }

        set((state) => ({
          categories: state.categories.filter((category) => category.id !== categoryId),
        }));

        return true;
      },

      saveBrand: (brandInput) =>
        set((state) => {
          const normalized = normalizeBrandRecord(brandInput);
          const exists = state.brands.some((brand) => brand.id === normalized.id);

          return {
            brands: sortByName(
              exists
                ? state.brands.map((brand) => (brand.id === normalized.id ? normalized : brand))
                : [...state.brands, normalized]
            ),
          };
        }),

      deleteBrand: (brandId) => {
        const brand = get().brands.find((item) => item.id === brandId);
        const isInUse = get().products.some(
          (product) => product.brand.toLowerCase() === brand?.name.toLowerCase()
        );

        if (isInUse) {
          return false;
        }

        set((state) => ({
          brands: state.brands.filter((item) => item.id !== brandId),
        }));

        return true;
      },

      saveHeroBanner: (bannerInput) =>
        set((state) => {
          const normalized = normalizeHeroBannerRecord(bannerInput);
          const exists = state.heroBanners.some((banner) => banner.id === normalized.id);

          return {
            heroBanners: exists
              ? state.heroBanners.map((banner) =>
                  banner.id === normalized.id ? normalized : banner
                )
              : [...state.heroBanners, normalized],
          };
        }),

      deleteHeroBanner: (bannerId) =>
        set((state) => ({
          heroBanners: state.heroBanners.filter((banner) => banner.id !== bannerId),
        })),
    }),
    {
      name: 'mobimax-catalog',
      version: 1,
    }
  )
);
