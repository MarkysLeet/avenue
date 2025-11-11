import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { getProductById, products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/ProductPage.module.css';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? getProductById(id) : null;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product]);

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
    toast({ type: 'success', message: `${product.name} добавлен в корзину` });
    router.push('/cart');
  };

  return (
    <Layout title={`${product.name} — Avenue Beauty`}>
      <section className={`${styles.productSection} av-top-trim`}>
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
          <p className={styles.price}>{product.price.toLocaleString()} ₺</p>
          <button className={styles.addButton} onClick={handleAdd}>
            Добавить в корзину
          </button>
        </div>
      </section>
      {relatedProducts.length > 0 && (
        <section className={styles['av-related']}>
          <h2>Похожие товары</h2>
          <div className="av-grid-shell">
            <div className="av-grid-products">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
          <p className={styles['av-related-hint']}>
            {isAuthenticated
              ? 'Оцените товар или добавьте его в избранное ❤️'
              : 'Войдите, чтобы оценивать и добавлять в избранное'}
          </p>
        </section>
      )}
    </Layout>
  );
};

export default ProductPage;
