import { create } from 'zustand';

interface OrdersStore {
  activeOrdersCount: number;
  setActiveOrdersCount: (count: number) => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  activeOrdersCount: 2,
  setActiveOrdersCount: (count: number) => set({ activeOrdersCount: count })
}));
