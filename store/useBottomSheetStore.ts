import { globalBottomSheetContentType } from '@/constants/interface';
import { create } from 'zustand';

// type IContent = {
//   content: React.ReactNode | null;
//   header?: React.ReactNode | null;
//   footer?: React.ReactNode | null;
// };

type BottomSheetStore = {
  content: React.ReactNode | null;
  // header: React.ReactNode | null;
  // footer: React.ReactNode | null;
  // contentType: globalBottomSheetContentType | '';
  snaps?: string[];
  position?: number;
  isBackgroundScalable?: boolean;
  isIndicatorVisible: boolean;
  isGlobalBottomSheetOpen: boolean;
  openGlobalBottomSheet: (options: {
    content: React.ReactNode;
    snaps?: string[];
    isBackgroundScalable?: boolean;
    isIndicatorVisible?: boolean;
  }) => void;
  // openGlobalBottomSheet: (contentType: globalBottomSheetContentType) => void;
  closeGlobalBottomSheet: () => void;
};

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  content: null,
  // header: null,
  // footer: null,
  // contentType: '',
  snaps: [],
  position: 0,
  isBackgroundScalable: false,
  isIndicatorVisible: true,
  isGlobalBottomSheetOpen: false,

  // openGlobalBottomSheet: (contentType) => {
  //   set({ isGlobalBottomSheetOpen: true, contentType });
  // },

  // closeGlobalBottomSheet: () => {
  //   set({ isGlobalBottomSheetOpen: false, contentType: '' });
  // }

  openGlobalBottomSheet: (options) => {
    const { content, snaps = [], isBackgroundScalable = false, isIndicatorVisible = true } = options;

    set({ content, snaps, isBackgroundScalable, isIndicatorVisible });

    setTimeout(() => {
      set({ isGlobalBottomSheetOpen: true });
    }, 0);
  },

  closeGlobalBottomSheet: () => {
    set({ isGlobalBottomSheetOpen: false, snaps: [] });
  }
}));
