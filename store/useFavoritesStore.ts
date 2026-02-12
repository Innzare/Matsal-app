import { create } from 'zustand';

interface FavoritesStore {
  favoriteRestaurants: number[];
  favoriteGroceries: number[];
  toggleFavorite: (id: number) => void;
  toggleGroceryFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favoriteRestaurants: [],
  favoriteGroceries: [],

  toggleFavorite: (id: number) => {
    set(({ favoriteRestaurants }) => ({
      favoriteRestaurants: favoriteRestaurants.includes(id)
        ? favoriteRestaurants.filter((fId) => fId !== id)
        : [...favoriteRestaurants, id]
    }));
  },

  toggleGroceryFavorite: (id: number) => {
    set(({ favoriteGroceries }) => ({
      favoriteGroceries: favoriteGroceries.includes(id)
        ? favoriteGroceries.filter((fId) => fId !== id)
        : [...favoriteGroceries, id]
    }));
  }
}));