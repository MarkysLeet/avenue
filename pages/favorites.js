import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import styles from '../styles/FavoritesPage.module.css';
import { products } from '../data/products';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [sort, setSort] = useState('new');

  const sortedFavorites = useMemo(() => {
    const mapped = favorites
      .map((entry) => {
        const product = products.find((item) => item.id === entry.id);
        return product ? { product, addedAt: entry.addedAt } : null;
      })
      .filter(Boolean);

    const next = [...mapped].sort((a, b) =>
      sort === 'new' ? b.addedAt - a.addedAt : a.addedAt - b.addedAt
    );

    return next;
  }, [favorites, sort]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast({ type: 'success', message: `${product.name} добавлен в корзину` });
  };

  const handleRemoveFavorite = (product) => {
    const remainsFavorite = toggleFavorite(product.id);
    if (!remainsFavorite) {
      toast({ type: 'success', message: `${product.name} удалён из избранного` });
    }
  };

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
        ) : sortedFavorites.length === 0 ? (
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
          <>
            <div className={styles['av-fav-toolbar']}>
              <select
                id="favorites-sort"
                className={styles['av-fav-sort']}
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Сортировка по дате добавления"
              >
                <option value="new">Сначала новые</option>
                <option value="old">Сначала старые</option>
              </select>
            </div>
            <ul className={styles['av-fav-list']}>
              {sortedFavorites.map(({ product }) => (
                <li key={product.id} className={styles['av-fav-list-item']}>
                  <div className={styles['av-fav-item']}>
                    <div className={styles['av-fav-item-main']}>
                      <div className={styles['av-fav-item-image']}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 30vw, 120px"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className={styles['av-fav-item-info']}>
                        <Link
                          href={`/products/${product.id}`}
                          className={styles['av-fav-item-link']}
                        >
                          {product.name}
                        </Link>
                        <p className={styles['av-fav-item-description']}>
                          {product.description}
                        </p>
                        <span className={styles['av-fav-item-price']}>
                          {product.price.toLocaleString()} ₺
                        </span>
                      </div>
                    </div>
                    <div className={styles['av-fav-item-actions']}>
                      <button
                        type="button"
                        className={styles['av-fav-action']}
                        onClick={() => handleAddToCart(product)}
                        aria-label={`Добавить ${product.name} в корзину`}
                      >
                        В корзину
                      </button>
                      <button
                        type="button"
                        className={styles['av-fav-action-secondary']}
                        onClick={() => handleRemoveFavorite(product)}
                        aria-label={`Удалить ${product.name} из избранного`}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </Layout>
  );
};

export default FavoritesPage;
