import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Header.module.css';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/catalog/nail-polish', label: 'Лаки' },
  { href: '/catalog/manicure-tools', label: 'Техника' },
  { href: '/cart', label: 'Корзина' }
];

const Header = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <Link href="/" className={styles.logo}>
          Avenue Beauty
        </Link>
        <p className={styles.tagline}>Мир нежности и сияния</p>
      </div>
      <nav className={styles.nav}>
        {navLinks.map((link) => {
          const isActive =
            router.pathname === link.href || router.asPath.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <div className={styles.iconBar}>
          <button type="button" className={styles.iconButton} aria-label="Поиск">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link href="/auth" className={styles.iconButton} aria-label="Профиль">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
            </svg>
          </Link>
          <Link href="/cart" className={styles.iconButton} aria-label="Корзина">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h2l2 12h10l2-9H7" />
              <circle cx="10" cy="19" r="1.4" />
              <circle cx="17" cy="19" r="1.4" />
            </svg>
            {count > 0 ? <span className={styles.cartBadge}>{count}</span> : null}
          </Link>
        </div>
        <div className={styles.userArea}>
          {isAuthenticated ? (
            <>
              <span className={styles.welcome}>Привет, {user.name || user.email}!</span>
              <button className={styles.outlineButton} onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <Link href="/auth" className={styles.primaryButton}>
              Вход / Регистрация
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
