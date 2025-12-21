import { globalModalContentType } from '@/constants/interface';
import { create } from 'zustand';

interface GlobalModalStore {
  contentString: globalModalContentType | '';
  isGlobalModalOpen: boolean;
  isMainContentScalable: boolean;
  openGlobalModal: (contentString: globalModalContentType, isMainContentScalable?: boolean) => void;
  closeGlobalModal: () => void;
}

export const useGlobalModalStore = create<GlobalModalStore>((set) => ({
  contentString: '',
  isGlobalModalOpen: false,
  isMainContentScalable: false,

  openGlobalModal: (contentString, isMainContentScalable = false) => {
    set({ isGlobalModalOpen: true, contentString, isMainContentScalable });
  },

  closeGlobalModal: () => {
    set({ isGlobalModalOpen: false });
  }
}));
