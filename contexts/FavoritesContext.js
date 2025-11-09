import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'avenue-favorites';

const FavoritesContext = createContext({
  favoriteIds: [],
  favorites: [],
  toggleFavorite: () => false,
  isFavorite: () => false
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const baseTime = Date.now();
          const normalized = parsed
            .map((entry, index) => {
              if (typeof entry === 'string') {
                return { id: entry, addedAt: baseTime + index };
              }
              if (entry && typeof entry.id === 'string') {
                const timestamp = Number(entry.addedAt);
                return {
                  id: entry.id,
                  addedAt: Number.isFinite(timestamp) ? timestamp : baseTime + index
                };
              }
              return null;
            })
            .filter(Boolean);
          setFavorites(normalized);
        }
      } catch (error) {
        console.warn('Ошибка чтения избранного', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((productId) => {
    let nextState = false;
    setFavorites((prev) => {
      const exists = prev.find((entry) => entry.id === productId);
      if (exists) {
        nextState = false;
        return prev.filter((entry) => entry.id !== productId);
      }
      const nextEntry = { id: productId, addedAt: Date.now() };
      nextState = true;
      return [...prev, nextEntry];
    });
    return nextState;
  }, []);

  const favoriteIds = useMemo(() => favorites.map((entry) => entry.id), [favorites]);

  const isFavorite = useCallback((productId) => favoriteIds.includes(productId), [favoriteIds]);

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      toggleFavorite,
      isFavorite
    }),
    [favorites, favoriteIds, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);
