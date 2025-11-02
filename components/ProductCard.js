import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className={styles.content}>
        <h3>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
          <div className={styles.actions}>
            <button type="button" className={styles.cartButton} onClick={handleAddToCart}>
              В корзину
            </button>
            <Link href={`/products/${product.id}`} className={styles.more}>
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
