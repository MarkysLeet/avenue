import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import styles from '../styles/AboutPage.module.css';

const fadeInProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const AboutPage = () => {
  return (
    <Layout title="О нас — Avenue Professional">
      <main className={styles['av-about']}>
        <motion.section className="av-section" {...fadeInProps}>
          <motion.h1 className={styles['av-about-title']} {...fadeInProps}>
            О нас
          </motion.h1>
          <motion.p className={styles['av-about-lead']} {...fadeInProps} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}>
            Avenue Professional — бренд профессиональной косметики для маникюра, сочетающий качество,
            стиль и заботу о мастерах.
          </motion.p>

          <motion.div className={styles['av-about-info']} {...fadeInProps} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}>
            <div className={styles['av-about-block']}>
              <h3>Çalışma Saatlerimiz</h3>
              <p>Pazartesi–Cuma : 10:00–19:00</p>
              <p>Cumartesi : 10:00–19:00</p>
            </div>

            <div className={styles['av-about-block']}>
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
          </motion.div>

          <motion.form className={styles['av-about-form']} {...fadeInProps} transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}>
            <h3>Свяжитесь с нами</h3>
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
          </motion.form>
        </motion.section>
      </main>
    </Layout>
  );
};

export default AboutPage;
