import { addressesList } from '@/constants/addresses';
import { create } from 'zustand';

const ADDRESS_FIELD = {
  DISTRICT: 'district',
  CITY: 'city',
  STREET: 'street',
  STREET_WITH_HOUSE: 'streetWithHouse',
  HOUSE: 'house',
  ENTRANCE: 'entrance',
  FLOOR: 'floor',
  FLAT: 'flat',
  COMMENT: 'comment'
};

interface IAddress {
  id: number;
  district: string;
  city: string;
  street: string;
  streetWithHouse: string;
  house: string;
  entrance: string;
  floor: string;
  flat: string;
  point: { lon: number; lat: number };
  comment: string;
}

interface AddressesStore {
  addresses: IAddress[];
  addressForEdit: IAddress | null;
  activeAddressId: number;
  addAddress: (address: IAddress) => void;
  editAddress: (id: number, address: IAddress) => void;
  setAddressForEdit: (address: IAddress | null) => void;
  setActiveAddressId: (id: number) => void;
  getActiveAddress: () => IAddress | null;
  removeAddress: (id: number) => void;
}

export const useAddressesStore = create<AddressesStore>((set, get) => ({
  addresses: addressesList,
  activeAddressId: 0,
  addressForEdit: null,

  addAddress: (address) => {
    set(({ addresses }) => ({
      addresses: [...addresses, address]
    }));
  },

  editAddress: (id: number, address: IAddress) => {
    set(({ addresses }) => ({
      addresses: addresses.map((item, index) => (index === id ? address : item))
    }));
  },

  setAddressForEdit: (address: IAddress | null) => {
    set(() => ({
      addressForEdit: address
    }));
  },

  setActiveAddressId: (id: number) => {
    set(() => ({
      activeAddressId: id
    }));
  },

  getActiveAddress: () => {
    const { addresses, activeAddressId } = get();
    return addresses.find((address) => address.id === activeAddressId) || null;
  },

  removeAddress: (id) => {
    set(({ addresses }) => ({
      addresses: addresses.filter((address) => address.id !== id)
    }));
  }
}));
