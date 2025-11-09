import Layout from '../components/Layout';
import CategoryGrid from '../components/CategoryGrid';
import { categories } from '../data/products';
import styles from '../styles/CategoriesPage.module.css';

const CategoriesPage = () => {
  return (
    <Layout title="Категории — Avenue Professional">
      <section className={styles.section}>
        <div className={styles.header}> 
          <h1>Категории</h1>
          <p>
            Исследуйте наши направления ухода и соберите набор продуктов, который подчеркнёт
            вашу индивидуальность.
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </section>
    </Layout>
  );
};

export default CategoriesPage;
