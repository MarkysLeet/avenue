import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Component {...pageProps} />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
