import Layout from '../components/Layout';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/products';
import styles from '../styles/Home.module.css';

const Home = () => {
  const featured = products.slice(0, 4);

  return (
    <Layout>
      <Hero />
      <section className={styles.section} id="catalog">
        <h2>Категории</h2>
        <CategoryGrid categories={categories} />
      </section>
      <section className={styles.section}>
        <h2>Избранные товары</h2>
        <div className={styles.productsGrid}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
