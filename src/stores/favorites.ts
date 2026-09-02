import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id) =>
        set((state) => (state.favoriteIds.includes(id) ? state : { favoriteIds: [...state.favoriteIds, id] })),
      removeFavorite: (id) => set((state) => ({ favoriteIds: state.favoriteIds.filter((atual) => atual !== id) })),
      toggleFavorite: (id) => {
        const { favoriteIds, addFavorite, removeFavorite } = get();
        if (favoriteIds.includes(id)) removeFavorite(id);
        else addFavorite(id);
      },
    }),
    { name: "imovel-favorites" },
  ),
);
