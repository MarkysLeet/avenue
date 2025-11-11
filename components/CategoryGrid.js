import Link from 'next/link';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/CategoryGrid.module.css';

const CategoryGrid = ({ categories }) => {
  return (
    <SectionWrapper as="div">
      <div className={styles.grid}>
        {categories.map((category) => {
          const targetSlug = category.id || category.slug;
          const href = targetSlug ? `/categories/${targetSlug}` : '/categories';
          return (
            <article key={category.id || category.slug} className={`${styles.card} av-cat-card`}>
              {category.badge ? <span className={styles.badge}>{category.badge}</span> : null}
              <div className="av-cat-body">
                <span className={styles.icon} aria-hidden="true" />
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <Link href={href} className={`av-cat-cta ${styles.cta}`}>
                Перейти
              </Link>
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default CategoryGrid;
