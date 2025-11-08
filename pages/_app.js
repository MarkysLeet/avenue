import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import RootLoading from '../app/loading';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ToastProvider } from '../contexts/ToastContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const loaderTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const handleStart = (url) => {
      if (url === router.asPath) {
        return;
      }
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
      loaderTimerRef.current = setTimeout(() => {
        loaderTimerRef.current = null;
        if (isMounted) {
          setIsRouteLoading(true);
        }
      }, 120);
    };

    const handleStop = () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
      if (isMounted) {
        setIsRouteLoading(false);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      isMounted = false;
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            {isRouteLoading ? <RootLoading /> : null}
            <Component {...pageProps} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;
