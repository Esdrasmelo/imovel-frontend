"use client";

import { useCallback } from "react";
import { useFavoritesStore } from "@/stores/favorites";

export function useFavorites() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  return { favoriteIds, toggleFavorite, removeFavorite, isFavorite };
}
