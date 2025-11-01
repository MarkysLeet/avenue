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
              {link.href === '/cart' && count > 0 ? (
                <span className={styles.cartBadge}>{count}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
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
    </header>
  );
};

export default Header;
