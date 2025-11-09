import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';
import styles from '../../styles/Catalog.module.css';

const normalizeString = (value = '') => value.toString().trim().toLowerCase();

const CatalogIndexPage = () => {
  const router = useRouter();
  const queryParam = Array.isArray(router.query.query)
    ? router.query.query[0]
    : router.query.query || '';
  const normalizedQuery = normalizeString(queryParam);

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.name} ${product.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <Layout title="Каталог — Avenue Professional">
      <section className={styles.section}>
        <h1>Каталог</h1>
        {normalizedQuery ? (
          <p className={styles.description}>
            Результаты по запросу «{queryParam}». Найдено {filteredProducts.length} товар(ов).
          </p>
        ) : (
          <p className={styles.description}>
            Изучите весь ассортимент Avenue Professional и подберите идеальный набор для ухода.
          </p>
        )}
        <div className="av-grid-shell">
          <div className={`${styles.grid} av-grid-products`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        {filteredProducts.length === 0 && (
          <p className={styles.empty}>По вашему запросу ничего не найдено. Попробуйте изменить критерии.</p>
        )}
      </section>
    </Layout>
  );
};

export default CatalogIndexPage;
