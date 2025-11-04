import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/FavoritesPage.module.css';
import { products } from '../data/products';

const FavoritesPage = () => {
  const { favoriteIds } = useFavorites();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds]
  );

  return (
    <Layout title="Избранное — Avenue Professional">
      <section className={styles['av-fav-section']}>
        <header className={styles['av-fav-header']}>
          <h1>Избранное</h1>
          <p>Сохраняйте любимые продукты и возвращайтесь к ним, когда будете готовы к покупке.</p>
        </header>
        {!isAuthenticated ? (
          <div className={styles['av-fav-guard']}>
            <p>Войдите в аккаунт, чтобы просматривать и сохранять избранное.</p>
            <button
              type="button"
              className={styles['av-fav-cta']}
              onClick={() => router.push('/auth/login?returnTo=/favorites')}
            >
              Войти
            </button>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className={styles['av-fav-empty']}>
            <p>Пока здесь пусто. Добавьте товары в избранное, чтобы быстрее находить их позже.</p>
            <button
              type="button"
              className={styles['av-fav-cta']}
              onClick={() => router.push('/categories')}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className={styles['av-fav-grid']}>
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default FavoritesPage;
