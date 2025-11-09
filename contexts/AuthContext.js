import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'avenue-auth';

const AuthContext = createContext({
  user: null,
  register: () => {},
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  changeEmail: () => {},
  changePassword: () => {}
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

  const register = ({ name, email, password, firstName = '', lastName = '', phone = '' }) => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { users: [], currentUser: null };

    const exists = data.users.find((item) => item.email === email);
    if (exists) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    const newUser = {
      name,
      email,
      password,
      firstName,
      lastName,
      phone
    };
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

  const withStoredData = (callback) => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { users: [], currentUser: null };
    if (!data.currentUser) {
      throw new Error('Пользователь не авторизован');
    }
    const result = callback(data);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return result;
  };

  const updateProfile = (updates) => {
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }
    const result = withStoredData((data) => {
      const updatedUser = { ...data.currentUser, ...updates };
      data.users = data.users.map((item) =>
        item.email === data.currentUser.email ? updatedUser : item
      );
      data.currentUser = updatedUser;
      setUser(updatedUser);
      return updatedUser;
    });
    return result;
  };

  const changeEmail = (newEmail) => {
    if (!newEmail) {
      throw new Error('Укажите email');
    }
    const trimmedEmail = newEmail.trim();
    const result = withStoredData((data) => {
      const currentEmail = data.currentUser.email;
      const exists = data.users.find(
        (item) => item.email === trimmedEmail && item.email !== currentEmail
      );
      if (exists) {
        throw new Error('Email уже используется другим аккаунтом');
      }
      const updatedUser = { ...data.currentUser, email: trimmedEmail };
      data.users = data.users.map((item) =>
        item.email === currentEmail ? updatedUser : item
      );
      data.currentUser = updatedUser;
      setUser(updatedUser);
      return updatedUser;
    });
    return result;
  };

  const changePassword = ({ oldPassword, newPassword }) => {
    if (!oldPassword || !newPassword) {
      throw new Error('Введите текущий и новый пароль');
    }
    const result = withStoredData((data) => {
      if (data.currentUser.password !== oldPassword) {
        throw new Error('Текущий пароль указан неверно');
      }
      const updatedUser = { ...data.currentUser, password: newPassword };
      data.users = data.users.map((item) =>
        item.email === data.currentUser.email ? updatedUser : item
      );
      data.currentUser = updatedUser;
      setUser(updatedUser);
      return true;
    });
    return result;
  };

  const value = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      updateProfile,
      changeEmail,
      changePassword,
      isAuthenticated: Boolean(user)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
