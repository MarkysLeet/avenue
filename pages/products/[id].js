import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { getProductById } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import styles from '../../styles/ProductPage.module.css';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? getProductById(id) : null;
  const { addToCart } = useCart();

  if (!product) {
    return (
      <Layout title="Товар не найден">
        <div className={styles.empty}>
          <p>Товар не найден или загружается...</p>
        </div>
      </Layout>
    );
  }

  const handleAdd = () => {
    addToCart(product, 1);
    router.push('/cart');
  };

  return (
    <Layout title={`${product.name} — Avenue Beauty`}>
      <section className={styles.productSection}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
          <button className={styles.addButton} onClick={handleAdd}>
            Добавить в корзину
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default ProductPage;
