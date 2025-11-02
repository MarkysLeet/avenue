import Image from 'next/image';
import styles from '../styles/CartItem.module.css';

const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className={styles.item}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 25vw, 120px"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className={styles.info}>
        <h4>{item.name}</h4>
        <p className={styles.price}>{item.price.toLocaleString()} ₽</p>
      </div>
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
