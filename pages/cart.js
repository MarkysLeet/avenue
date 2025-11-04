import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/CartPage.module.css';

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout title="Корзина — Avenue Beauty">
      <section className={styles.section}>
        <h1>Корзина</h1>
        {items.length === 0 ? (
          <p className={styles.empty}>Ваша корзина пуста. Добавьте товары из каталога.</p>
        ) : (
          <div className={styles.cartWrapper}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <aside className={styles.summary}>
              <h2>Итого</h2>
              <p className={styles.total}>{total.toLocaleString()} ₽</p>
              <button className={styles.checkoutButton} onClick={clearCart}>
                Очистить корзину
              </button>
              <p className={styles.notice}>
                Оплата появится позже. Мы уже готовим интеграцию с платежной системой.
              </p>
            </aside>
          </div>
        )}
        {!isAuthenticated && items.length > 0 ? (
          <section className={styles['av-auth-hint']}>
            <div className={styles['av-auth-hint__icon']} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3a5 5 0 0 1 5 5v2h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V8a5 5 0 0 1 5-5Z" />
                <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
              </svg>
            </div>
            <div className={styles['av-auth-hint__content']}>
              <h3>Чтобы оформить покупку и сохранить корзину, войдите в аккаунт</h3>
              <button
                type="button"
                className={styles['av-auth-hint__cta']}
                onClick={() => router.push('/auth?returnTo=/cart')}
              >
                Войти
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </Layout>
  );
};

export default CartPage;
