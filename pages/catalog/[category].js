import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { categories, getProductsByCategory } from '../../data/products';
import styles from '../../styles/Catalog.module.css';

const CatalogPage = () => {
  const router = useRouter();
  const { category } = router.query;

  const categoryData = categories.find((item) => item.id === category);
  const products = category ? getProductsByCategory(category) : [];

  return (
    <Layout title={`Каталог — ${categoryData ? categoryData.name : 'Avenue Beauty'}`}>
      <section className={styles.section}>
        <h1>{categoryData ? categoryData.name : 'Каталог'}</h1>
        {categoryData && <p className={styles.description}>{categoryData.description}</p>}
        <div className="av-grid-shell">
          <div className={`${styles.grid} av-grid-products`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        {products.length === 0 && (
          <p className={styles.empty}>Категория загружается или пока не содержит товаров.</p>
        )}
      </section>
    </Layout>
  );
};

export default CatalogPage;
