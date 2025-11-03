import Link from 'next/link';
import styles from '../styles/CategoryGrid.module.css';

const CategoryGrid = ({ categories }) => {
  return (
    <div className={styles.grid}>
      {categories.map((category) => {
        const targetSlug = category.id || category.slug;
        const href = targetSlug ? `/categories/${targetSlug}` : '/categories';
        return (
          <Link key={category.id || category.slug} href={href} className={styles.card}>
            {category.badge ? <span className={styles.badge}>{category.badge}</span> : null}
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span className={styles.cta}>Перейти в каталог</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
