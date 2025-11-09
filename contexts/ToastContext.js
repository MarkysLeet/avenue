import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toaster from '../components/Toaster';

const ToastContext = createContext(null);

const createId = () => `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options) => {
    if (!options || !options.message) {
      return null;
    }

    const id = createId();
    const duration = Number.isFinite(options.duration) ? Math.max(options.duration, 1000) : 3600;
    const toastData = {
      id,
      title: options.title || '',
      message: options.message,
      type: options.type || 'info',
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      duration
    };

    setToasts((prev) => [...prev, toastData]);
    return id;
  }, []);

  const contextValue = useMemo(
    () => ({
      toast,
      dismiss,
      toasts
    }),
    [toast, dismiss, toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }
  return { toast: context.toast, dismiss: context.dismiss };
};

export const useToastState = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastState должен использоваться внутри ToastProvider');
  }
  return context.toasts;
};
