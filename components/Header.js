import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Header.module.css';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/categories', label: 'Категории' }
];

const Header = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchPanelId = useId();

  const closeSearch = useCallback(
    (options = { shouldFocusButton: true, shouldResetTerm: false }) => {
      setIsSearchOpen(false);
      if (options.shouldResetTerm) {
        setSearchTerm('');
      }
      if (options.shouldFocusButton && searchButtonRef.current) {
        searchButtonRef.current.focus();
      }
    },
    []
  );

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    const handleDocumentKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch({ shouldResetTerm: false });
      }
    };

    const handleClickOutside = (event) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        closeSearch({ shouldFocusButton: false, shouldResetTerm: false });
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearch, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [router.asPath]);

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      closeSearch({ shouldResetTerm: false });
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    closeSearch({ shouldFocusButton: false, shouldResetTerm: true });
    router.push(`/catalog?query=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch({ shouldResetTerm: false });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <Link href="/" className={styles.logo}>
          Avenue Professional
        </Link>
        <p className={styles.tagline}>Мир нежности и сияния</p>
      </div>
      <nav className={styles.nav}>
        {navLinks.map((link) => {
          const isExactMatch = router.pathname === link.href;
          const isStartsWith = link.href !== '/' && router.asPath.startsWith(link.href);
          const isActive = isExactMatch || isStartsWith;
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
          <div className={styles.searchControl}>
            <button
              type="button"
              ref={searchButtonRef}
              className={styles.iconButton}
              aria-label="Поиск"
              aria-expanded={isSearchOpen}
              aria-controls={searchPanelId}
              onClick={handleSearchToggle}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="6" />
                <line x1="20" y1="20" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <div
              id={searchPanelId}
              ref={searchPanelRef}
              className={
                isSearchOpen
                  ? `${styles.searchPanel} ${styles.searchPanelOpen}`
                  : styles.searchPanel
              }
              role="search"
              aria-hidden={!isSearchOpen}
            >
              <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
                <input
                  ref={searchInputRef}
                  type="search"
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Поиск по каталогу"
                  name="query"
                  aria-label="Поиск по каталогу"
                  onKeyDown={handleSearchKeyDown}
                />
                <button type="submit" className={styles.searchSubmit}>
                  Найти
                </button>
              </form>
            </div>
          </div>
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
