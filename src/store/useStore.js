import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  wishlist: [],
  compare: [],
  
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((item) => 
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.some(item => item.id === product.id);
    if (exists) {
      return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
    }
    return { wishlist: [...state.wishlist, product] };
  }),

  clearWishlist: () => set({ wishlist: [] }),

  toggleCompare: (product) => set((state) => {
    const exists = state.compare.some(item => item.id === product.id);
    if (exists) {
      return { compare: state.compare.filter(item => item.id !== product.id) };
    }
    if (state.compare.length >= 4) {
      return state; // max 4 items to compare
    }
    return { compare: [...state.compare, product] };
  })
}));
