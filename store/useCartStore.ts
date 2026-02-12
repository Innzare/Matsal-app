import { create } from 'zustand';

export interface CartItemModifier {
  id: string;
  label: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  modifiers: CartItemModifier[];
}

export interface RestaurantCart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
}

interface CartStore {
  carts: Record<string, RestaurantCart>;
  activeRestaurantId: string | null;

  setActiveRestaurant: (restaurantId: string) => void;
  addItem: (restaurantId: string, restaurantName: string, item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (restaurantId: string, itemId: string) => void;
  updateQuantity: (restaurantId: string, itemId: string, quantity: number) => void;
  clearCart: (restaurantId: string) => void;
  getTotal: (restaurantId: string) => number;
  getDeliveryPrice: (restaurantId: string) => number;
  getItemsCount: (restaurantId: string) => number;
  getCartItems: (restaurantId: string) => CartItem[];
  getAllCarts: () => RestaurantCart[];
}

export const useCartStore = create<CartStore>((set, get) => ({
  carts: {},
  activeRestaurantId: null,

  setActiveRestaurant: (restaurantId) => {
    set({ activeRestaurantId: restaurantId });
  },

  addItem: (restaurantId, restaurantName, item) => {
    const { carts } = get();
    const cart = carts[restaurantId] || { restaurantId, restaurantName, items: [] };
    const existingIndex = cart.items.findIndex(
      (i) =>
        i.id === item.id &&
        JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
    );

    let updatedItems: CartItem[];
    if (existingIndex >= 0) {
      updatedItems = [...cart.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + (item.quantity || 1)
      };
    } else {
      updatedItems = [...cart.items, { ...item, quantity: item.quantity || 1 }];
    }

    set({
      carts: {
        ...carts,
        [restaurantId]: { restaurantId, restaurantName, items: updatedItems }
      }
    });
  },

  removeItem: (restaurantId, itemId) => {
    const { carts } = get();
    const cart = carts[restaurantId];
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.id !== itemId);

    if (updatedItems.length === 0) {
      const { [restaurantId]: _, ...rest } = carts;
      set({ carts: rest });
    } else {
      set({
        carts: {
          ...carts,
          [restaurantId]: { ...cart, items: updatedItems }
        }
      });
    }
  },

  updateQuantity: (restaurantId, itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(restaurantId, itemId);
      return;
    }
    const { carts } = get();
    const cart = carts[restaurantId];
    if (!cart) return;

    set({
      carts: {
        ...carts,
        [restaurantId]: {
          ...cart,
          items: cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }
      }
    });
  },

  clearCart: (restaurantId) => {
    const { carts } = get();
    const { [restaurantId]: _, ...rest } = carts;
    set({ carts: rest });
  },

  getTotal: (restaurantId) => {
    const cart = get().carts[restaurantId];
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      const modifiersTotal = item.modifiers.reduce((s, m) => s + m.price, 0);
      return sum + (item.price + modifiersTotal) * item.quantity;
    }, 0);
  },

  getDeliveryPrice: (restaurantId) => {
    const total = get().getTotal(restaurantId);
    return total >= 500 ? 0 : 99;
  },

  getItemsCount: (restaurantId) => {
    const cart = get().carts[restaurantId];
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartItems: (restaurantId) => {
    return get().carts[restaurantId]?.items || [];
  },

  getAllCarts: () => {
    return Object.values(get().carts).filter((c) => c.items.length > 0);
  }
}));