import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ensureDefaultAddress, readAddresses } from '../utils/addressStorage';
import styles from '../styles/CartPage.module.css';

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    const stored = readAddresses();
    const normalized = ensureDefaultAddress(stored.addresses);
    setAddresses(normalized.addresses);
    const defaultAddress = normalized.addresses.find((address) => address.isDefault);
    setSelectedAddressId(defaultAddress ? defaultAddress.id : '');
  }, []);

  const handleAddressChange = (event) => {
    setSelectedAddressId(event.target.value);
  };

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

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
              <p className={styles.total}>{total.toLocaleString()} ₺</p>
              {addresses.length > 0 ? (
                <div className={styles['av-cart-address']}>
                  <label htmlFor="cart-address-select">Адрес доставки</label>
                  <select
                    id="cart-address-select"
                    value={selectedAddressId}
                    onChange={handleAddressChange}
                    className={styles['av-cart-address__select']}
                  >
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label}
                      </option>
                    ))}
                  </select>
                  {selectedAddress ? (
                    <p className={styles['av-cart-address__preview']}>
                      {[selectedAddress.country, selectedAddress.city, selectedAddress.street]
                        .filter(Boolean)
                        .join(', ') || 'Уточните адрес в личном кабинете'}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className={styles['av-cart-address-empty']}>
                  <p>Добавьте адрес доставки в личном кабинете, чтобы выбрать его при оформлении.</p>
                  <button
                    type="button"
                    className={styles['av-cart-address-empty__cta']}
                    onClick={() => router.push('/account?tab=address')}
                  >
                    Добавить адрес
                  </button>
                </div>
              )}
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
                onClick={() => router.push('/auth/login?returnTo=/cart')}
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
