import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.kicker}>Премиальный уход дома</span>
        <h1>Профессиональный уход. Салонное качество. Дома.</h1>
        <p>
          Соберите безупречный маникюрный ритуал с Avenue Beauty: от шелковых лаков до
          умных девайсов. Выберите продукты, которые подчеркнут вашу индивидуальность.
        </p>
        <div className={styles.ctaGroup}>
          <Link className={styles.primaryCta} href="/categories">
            Смотреть каталог
          </Link>
          <a className={styles.secondaryCta} href="#featured">
            Новинки
          </a>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.stage}>
          <div className={styles.glow} />
          <Image
            src="/images/manicure-uv-lamp.svg"
            alt="Маникюрная лампа"
            width={260}
            height={220}
            className={styles.heroImage}
          />
          <Image
            src="/images/nail-polish-rose-veil.svg"
            alt="Лак Rose Veil"
            width={140}
            height={140}
            className={styles.secondaryImage}
          />
          <div className={styles.accentBubble} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
