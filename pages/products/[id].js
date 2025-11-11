import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { getProductById, products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import SectionWrapper from '../../components/SectionWrapper';
import styles from '../../styles/ProductPage.module.css';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? getProductById(id) : null;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(product?.rating || 0);
  const [hoverRating, setHoverRating] = useState(null);

  useEffect(() => {
    if (product) {
      setRating(product.rating || 0);
    }
  }, [product]);

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

  const displayedRating = hoverRating != null ? hoverRating : rating || 0;

  const handleRate = (value) => {
    if (!isAuthenticated) {
      toast({
        type: 'warning',
        message: 'Только авторизованные пользователи могут ставить оценку'
      });
      setHoverRating(null);
      return;
    }
    setRating(value);
    setHoverRating(null);
    toast({ type: 'success', message: `Спасибо за оценку ${value} из 5` });
  };

  return (
    <Layout title={`${product.name} — Avenue Beauty`}>
      <SectionWrapper className={`${styles.productSection} av-top-trim`}>
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
          <div className={styles['av-product-rating']}>
            <h3>Оцените этот товар</h3>
            <div className={styles['av-stars']} role="radiogroup" aria-label="Оценка товара">
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = displayedRating >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles['av-star']} ${isActive ? styles['av-star-active'] : ''}`.trim()}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(null)}
                    onFocus={() => setHoverRating(value)}
                    onBlur={() => setHoverRating(null)}
                    onClick={() => handleRate(value)}
                    role="radio"
                    aria-label={`Оценить на ${value} из 5`}
                    aria-checked={rating === value}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                );
              })}
            </div>
            {!isAuthenticated ? (
              <p className={styles['av-rating-note']}>Только авторизованные пользователи могут ставить оценку</p>
            ) : null}
          </div>
        </div>
      </SectionWrapper>
      {relatedProducts.length > 0 && (
        <SectionWrapper className={styles['av-related']}>
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
        </SectionWrapper>
      )}
    </Layout>
  );
};

export default ProductPage;
