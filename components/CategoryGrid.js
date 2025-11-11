import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../styles/CategoryGrid.module.css';

const motionProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const CategoryGrid = ({ categories }) => {
  return (
    <motion.div className={styles.grid} {...motionProps}>
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
    </motion.div>
  );
};

export default CategoryGrid;
