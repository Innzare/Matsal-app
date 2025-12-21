export type globalModalContentType = 'settings' | 'addresses' | 'orders' | 'addAddress';
export type globalBottomSheetContentType = 'menu_sections';

export const GLOBAL_MODAL_CONTENT = {
  SETTINGS: 'settings' as globalModalContentType,
  ADDRESSES: 'addresses' as globalModalContentType,
  ADD_ADDRESS: 'add_address' as globalModalContentType,
  ORDERS: 'orders' as globalModalContentType
};

export const GLOBAL_BOTTOM_SHEET_CONTENT = {
  MENU_SECTIONS: 'menu_sections' as globalBottomSheetContentType
};
