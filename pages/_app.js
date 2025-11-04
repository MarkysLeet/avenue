import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ToastProvider } from '../contexts/ToastContext';

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Component {...pageProps} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;
