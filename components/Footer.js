import Link from 'next/link';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <SectionWrapper as="footer" className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} Avenue Beauty. Все права защищены.</p>
        <p className={styles.caption}>
          Создаем салонное настроение дома: косметика, техника и сервис премиум-класса.
        </p>
        <div className={styles.links}>
          <Link href="/catalog/nail-polish">Лаки</Link>
          <Link href="/catalog/manicure-tools">Оборудование</Link>
          <Link href="/auth/login">Вход / Регистрация</Link>
        </div>
        <div className={styles.socials}>
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="Pinterest">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21c-4.97 0-9-3.807-9-8.5S7.03 4 12 4s9 3.807 9 8.5c0 3.233-1.977 6.02-4.896 7.32" />
              <path d="M12 21c-.296-1.845-.52-3.182.935-4.961 1.758-2.15 2.385-6.054-.935-6.404-3.132-.332-4.52 4.006-2.166 5.568" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 8s-.2-1.5-.8-2.2c-.7-.8-1.5-.8-1.8-.8C16.4 5 12 5 12 5s-4.4 0-6.4.2c-.3 0-1.1 0-1.8.8C3.2 6.5 3 8 3 8s-.2 1.6-.2 3.3v1.4C2.8 14.4 3 16 3 16s.2 1.5.8 2.2c.7.8 1.6.8 2 .9 1.4.1 6.2.2 6.2.2s4.4 0 6.4-.2c.3 0 1.1 0 1.8-.8.6-.7.8-2.2.8-2.2s.2-1.6.2-3.3V11c0-1.7-.2-3-.2-3z" />
              <path d="M10 9.75v4.5L14.5 12z" />
            </svg>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Footer;
