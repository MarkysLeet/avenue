import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'avenue-auth';

const AuthContext = createContext({
  user: null,
  register: () => {},
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.currentUser) {
          setUser(parsed.currentUser);
        }
      } catch (error) {
        console.warn('Ошибка чтения данных авторизации', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    let data = stored ? JSON.parse(stored) : { users: [], currentUser: null };
    data.currentUser = user;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [user]);

  const register = ({ name, email, password }) => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { users: [], currentUser: null };

    const exists = data.users.find((item) => item.email === email);
    if (exists) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    const newUser = { name, email, password };
    const updated = {
      users: [...data.users, newUser],
      currentUser: newUser
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(newUser);
    return true;
  };

  const login = ({ email, password }) => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { users: [], currentUser: null };

    const existing = data.users.find(
      (item) => item.email === email && item.password === password
    );

    if (!existing) {
      throw new Error('Неверный email или пароль');
    }

    const updated = { ...data, currentUser: existing };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(existing);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      isAuthenticated: Boolean(user)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
