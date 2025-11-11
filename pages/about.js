import Link from 'next/link';
import Layout from '../components/Layout';
import FloatingShapes from '../components/FloatingShapes';
import SectionWrapper from '../components/SectionWrapper';
import styles from '../styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <Layout title="О нас — Avenue Professional">
      <main className={styles['av-about-page']}>
        <FloatingShapes />
        <SectionWrapper className={styles['av-about-hero']}>
          <h1 className="av-hero-title">О нас</h1>
          <p>
            Avenue Professional — бренд профессиональной косметики для маникюра, сочетающий качество,
            стиль и заботу о мастерах.
          </p>
        </SectionWrapper>
        <SectionWrapper className={styles['av-about-infoGrid']}>
          <div className={styles['av-about-card']}>
            <h3>Çalışma Saatlerimiz</h3>
            <p>Pazartesi–Cuma : 10:00–19:00</p>
            <p>Cumartesi : 10:00–19:00</p>
          </div>
          <div className={styles['av-about-card']}>
            <h3>Adresimiz</h3>
            <p>Fener Mahallede, Bülent Ecevit Blv 2B, Laura AVM. Giriş kat. Muratpaşa / Antalya</p>
            <p>+90 531 270 5539</p>
            <Link
              href="https://www.instagram.com/avenue_professional_official"
              target="_blank"
              rel="noreferrer"
              className={styles['av-about-link']}
            >
              Instagram
            </Link>
          </div>
        </SectionWrapper>
        <SectionWrapper className={styles['av-about-contact']}>
          <h3>Свяжитесь с нами</h3>
          <form className={styles['av-about-form']}>
            <label className={styles['av-sr-only']} htmlFor="about-name">
              Ваше имя
            </label>
            <input id="about-name" type="text" placeholder="Ваше имя" required className={styles['av-about-input']} />
            <label className={styles['av-sr-only']} htmlFor="about-email">
              Email
            </label>
            <input id="about-email" type="email" placeholder="Email" required className={styles['av-about-input']} />
            <label className={styles['av-sr-only']} htmlFor="about-message">
              Сообщение
            </label>
            <textarea
              id="about-message"
              placeholder="Сообщение..."
              rows={4}
              required
              className={styles['av-about-textarea']}
            />
            <button type="submit" className={styles['av-about-submit']}>
              Отправить
            </button>
          </form>
        </SectionWrapper>
      </main>
    </Layout>
  );
};

export default AboutPage;
