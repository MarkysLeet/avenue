import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/CartPage.module.css';

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

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
      </section>
    </Layout>
  );
};

export default CartPage;
