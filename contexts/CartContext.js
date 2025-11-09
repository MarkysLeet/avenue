import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'avenue-cart';

const CartContext = createContext({
  items: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  total: 0,
  count: 0
});

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;
    case 'ADD': {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    }
    case 'UPDATE':
      return state
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'INITIALIZE', payload: parsed });
        }
      } catch (error) {
        console.warn('Ошибка чтения корзины', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD',
      payload: { ...product, quantity }
    });
  };

  const updateQuantity = (id, quantity) => {
    const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
    dispatch({
      type: 'UPDATE',
      payload: { id, quantity: safeQuantity }
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = useMemo(
    () => state.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state]
  );

  const count = useMemo(
    () => state.reduce((sum, item) => sum + item.quantity, 0),
    [state]
  );

  const value = useMemo(
    () => ({
      items: state,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      total,
      count
    }),
    [state, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
