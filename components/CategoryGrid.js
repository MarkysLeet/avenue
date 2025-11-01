import Link from 'next/link';
import styles from '../styles/CategoryGrid.module.css';

const CategoryGrid = ({ categories }) => {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <Link key={category.id} href={`/catalog/${category.id}`} className={styles.card}>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
          <span className={styles.cta}>Перейти в каталог</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
