import { globalModalContentType } from '@/constants/interface';
import { create } from 'zustand';

type presentationStyleType = 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen' | undefined;
interface GlobalModalStore {
  contentString: globalModalContentType | '';
  isGlobalModalOpen: boolean;
  isMainContentScalable: boolean;
  presentationStyle: presentationStyleType;
  openGlobalModal: (
    contentString: globalModalContentType,
    isMainContentScalable?: boolean,
    presentationStyle?: presentationStyleType
  ) => void;
  closeGlobalModal: () => void;
}

export const useGlobalModalStore = create<GlobalModalStore>((set) => ({
  contentString: '',
  presentationStyle: undefined,
  isGlobalModalOpen: false,
  isMainContentScalable: false,

  openGlobalModal: (contentString, isMainContentScalable = false, presentationStyle = undefined) => {
    set({ isGlobalModalOpen: true, contentString, isMainContentScalable, presentationStyle });
  },

  closeGlobalModal: () => {
    set({ isGlobalModalOpen: false });
  }
}));
