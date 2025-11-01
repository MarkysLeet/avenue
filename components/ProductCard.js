import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
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
        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
        <Link href={`/products/${product.id}`} className={styles.more}>
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
