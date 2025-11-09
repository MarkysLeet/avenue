import Link from 'next/link';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { categories, getProductsByCategory } from '../../data/products';
import styles from '../../styles/Catalog.module.css';

const CategoryDetailPage = ({ category, products }) => {
  const title = category ? `${category.name} — Avenue Professional` : 'Категория — Avenue Professional';

  return (
    <Layout title={title}>
      <section className={styles.section}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <ol>
            <li>
              <Link href="/">Главная</Link>
            </li>
            <li>
              <Link href="/categories">Категории</Link>
            </li>
            <li aria-current="page">{category ? category.name : 'Категория'}</li>
          </ol>
        </nav>
        <h1>{category ? category.name : 'Категория'}</h1>
        {category?.description ? (
          <p className={styles.description}>{category.description}</p>
        ) : null}
        <div className="av-grid-shell">
          <div className={`${styles.grid} av-grid-products`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        {products.length === 0 ? (
          <p className={styles.empty}>
            В этой категории пока нет товаров. Загляните позже или выберите другую категорию.
          </p>
        ) : null}
      </section>
    </Layout>
  );
};

export const getStaticPaths = async () => ({
  paths: categories.map((category) => ({
    params: { slug: category.id }
  })),
  fallback: false
});

export const getStaticProps = async ({ params }) => {
  const category = categories.find((item) => item.id === params.slug) || null;
  const products = getProductsByCategory(params.slug);

  return {
    props: {
      category,
      products
    }
  };
};

export default CategoryDetailPage;
