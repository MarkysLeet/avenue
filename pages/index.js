import Link from 'next/link';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedCarousel from '../components/FeaturedCarousel';
import FloatingShapes from '../components/FloatingShapes';
import SectionWrapper from '../components/SectionWrapper';
import { categories, products } from '../data/products';
import styles from '../styles/Home.module.css';

const features = [
  {
    title: 'Авторские формулы',
    description: 'Мы создаем текстуры вместе с технологами салонов, чтобы результат радовал и дома.'
  },
  {
    title: 'Экологичный подход',
    description: 'Упаковка из переработанных материалов и безопасные составы без компромиссов.'
  },
  {
    title: 'Консьерж-сервис',
    description: 'Поддержка 7/7, персональные рекомендации и сопровождение после покупки.'
  }
];

const Home = () => {
  const featured = products.slice(0, 12);

  return (
    <Layout>
      <Hero />
      <SectionWrapper as="section" className={styles.section} id="catalog">
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.sectionHeader}>
            <h2>Категории</h2>
            <p>Выберите направление ухода и соберите собственный салон красоты дома.</p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </SectionWrapper>
      <SectionWrapper
        as="section"
        className={`${styles.section} ${styles.softSection} av-scroll-margin`}
        id="featured"
      >
        <div className={styles.sectionHeader}>
          <h2>Новинки &amp; рекомендации</h2>
          <p>Подборка продуктов, которые наши клиенты выбирают снова и снова.</p>
        </div>
        <FeaturedCarousel products={featured} />
      </SectionWrapper>
      <SectionWrapper as="section" className={`${styles.section} ${styles.whySection}`}>
        <div className={styles.sectionHeaderCentered}>
          <h2>Почему нас выбирают</h2>
          <p>Уделяем внимание каждой детали — от флакона до сервиса.</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper as="section" className={`${styles.section} ${styles.promoSection}`}>
        <div className={styles.promoContent}>
          <div className={styles.promoVisual} aria-hidden="true" />
          <div className={styles.promoText}>
            <h2>Салон на расстоянии клика.</h2>
            <p>Соберите профессиональный набор оборудования и создайте студию в любимом уголке дома.</p>
            <Link href="/catalog/manicure-tools" className={styles.promoCta}>
              Каталог оборудования
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </Layout>
  );
};

export default Home;
