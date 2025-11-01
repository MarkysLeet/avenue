import styles from '../styles/Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Современная косметика для сияния каждый день</h1>
        <p>
          Avenue Beauty — магазин, где встречаются инновационные формулы и нежные оттенки.
          Выбирайте продукты для идеального маникюра и создавайте ритуалы ухода дома.
        </p>
        <a className={styles.button} href="#catalog">
          Открыть коллекции
        </a>
      </div>
      <div className={styles.decor}>
        <div className={styles.bubbleOne} />
        <div className={styles.bubbleTwo} />
        <div className={styles.bubbleThree} />
      </div>
    </section>
  );
};

export default Hero;
