import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'avenue-favorites';

const FavoritesContext = createContext({
  favoriteIds: [],
  toggleFavorite: () => {},
  isFavorite: () => false
});

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed);
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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (productId) => {
    let nextState = false;
    setFavoriteIds((prev) => {
      if (prev.includes(productId)) {
        nextState = false;
        return prev.filter((id) => id !== productId);
      }
      nextState = true;
      return [...prev, productId];
    });
    return nextState;
  };

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite,
      isFavorite: (productId) => favoriteIds.includes(productId)
    }),
    [favoriteIds]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);
