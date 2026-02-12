import { create } from 'zustand';

interface NotificationsStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  unreadCount: 3,
  setUnreadCount: (count: number) => set({ unreadCount: count })
}));
