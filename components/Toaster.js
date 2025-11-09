import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../styles/Toast.module.css';

const typeIcon = {
  success: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 7-7 1.4 1.4-8.4 8.4z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 1 22h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 1 22h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
};

const ToastItem = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 3600;
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const remainingRef = useRef(duration);
  const closingRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerDismiss = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;
    setIsClosing(true);
    clearTimer();
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  }, [onDismiss, toast.id]);

  const startTimer = useCallback(() => {
    if (!Number.isFinite(duration) || duration <= 0 || closingRef.current) {
      return;
    }
    startRef.current = Date.now();
    clearTimer();
    timerRef.current = setTimeout(() => {
      triggerDismiss();
    }, remainingRef.current);
  }, [duration, triggerDismiss]);

  useEffect(() => {
    remainingRef.current = duration;
    startTimer();
    return () => {
      clearTimer();
    };
  }, [duration, startTimer]);

  const handleMouseEnter = () => {
    if (!timerRef.current || !startRef.current) {
      return;
    }
    const elapsed = Date.now() - startRef.current;
    remainingRef.current = Math.max(1200, remainingRef.current - elapsed);
    clearTimer();
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  const handleAction = () => {
    if (toast.onAction) {
      toast.onAction();
    }
    triggerDismiss();
  };

  const handleClose = () => {
    triggerDismiss();
  };

  const role = toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status';
  const ariaLive = toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite';

  return (
    <div
      className={`${styles['av-toast']} ${styles[`av-toast-${toast.type}`] || ''} ${
        isClosing ? styles['av-toast-leave'] : styles['av-toast-enter']
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={role}
      aria-live={ariaLive}
    >
      <div className={styles['av-toast-icon']} aria-hidden="true">
        {typeIcon[toast.type] || typeIcon.info}
      </div>
      <div className={styles['av-toast-content']}>
        {toast.title ? <p className={styles['av-toast-title']}>{toast.title}</p> : null}
        <p className={styles['av-toast-message']}>{toast.message}</p>
        {toast.actionLabel ? (
          <button type="button" className={styles['av-toast-action']} onClick={handleAction}>
            {toast.actionLabel}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className={styles['av-toast-close']}
        onClick={handleClose}
        aria-label="Закрыть уведомление"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 7 10 10m0-10L7 17" />
        </svg>
      </button>
    </div>
  );
};

const Toaster = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="av-toaster fixed right-4 bottom-4 z-[2000] md:right-6 md:bottom-6">
      <div className={styles['av-toaster']}>
        <div
          className={styles['av-toast-viewport']}
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toaster;
