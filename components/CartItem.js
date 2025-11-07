import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/CartItem.module.css';

const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className={styles.item}>
      <Link
        href={`/products/${item.id}`}
        className={styles['av-cart-link']}
        aria-label={`Перейти к товару ${item.name}`}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 25vw, 120px"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <span className={styles['av-cart-title']}>{item.name}</span>
      </Link>
      <p className={styles.price}>{item.price.toLocaleString()} ₺</p>
      <div className={styles.controls}>
        <label className={styles.quantityLabel}>
          Количество
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) => onUpdate(item.id, Number(event.target.value))}
          />
        </label>
        <button className={styles.removeButton} onClick={() => onRemove(item.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default CartItem;
