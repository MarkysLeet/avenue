import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import styles from '../styles/ProductCard.module.css';

let avCardObserver;

const getCardObserver = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!avCardObserver) {
    avCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            if (avCardObserver) {
              avCardObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  return avCardObserver;
};

const ProductCard = ({ product, className = '' }) => {
  const router = useRouter();
  const { items, addToCart, removeFromCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [flight, setFlight] = useState(null);
  const [isFavoritePulsing, setIsFavoritePulsing] = useState(false);
  const [isFavoriteDenied, setIsFavoriteDenied] = useState(false);
  const buttonTimerRef = useRef(null);
  const flightTimerRef = useRef(null);
  const frameRef = useRef(null);
  const favoriteTimerRef = useRef(null);
  const deniedTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isClient, setIsClient] = useState(false);
  const favoriteActive = isAuthenticated && isFavorite(product.id);
  const inCart = items.some((item) => item.id === product.id);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const node = cardRef.current;
    if (!node) {
      return undefined;
    }

    const observer = getCardObserver();
    if (!observer) {
      return undefined;
    }

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    return () => {
      isMountedRef.current = false;
      if (buttonTimerRef.current) {
        clearTimeout(buttonTimerRef.current);
      }
      if (flightTimerRef.current) {
        clearTimeout(flightTimerRef.current);
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (favoriteTimerRef.current) {
        clearTimeout(favoriteTimerRef.current);
      }
      if (deniedTimerRef.current) {
        clearTimeout(deniedTimerRef.current);
      }
    };
  }, []);

  const triggerButtonAnimation = () => {
    if (buttonTimerRef.current) {
      clearTimeout(buttonTimerRef.current);
    }
    setIsButtonAnimating(true);
    buttonTimerRef.current = setTimeout(() => {
      setIsButtonAnimating(false);
    }, 220);
  };

  const triggerFlightAnimation = () => {
    if (typeof window === 'undefined' || !buttonRef.current) {
      return;
    }

    const cartTarget = document.querySelector('[data-av-cart-target="icon"]');
    if (!cartTarget) {
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const cartRect = cartTarget.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const flightData = {
      key: Date.now(),
      left: startX + scrollX,
      top: startY + scrollY,
      deltaX: endX - startX,
      deltaY: endY - startY
    };

    if (flightTimerRef.current) {
      clearTimeout(flightTimerRef.current);
    }

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setFlight(null);

    frameRef.current = window.requestAnimationFrame(() => {
      if (!isMountedRef.current) {
        return;
      }
      setFlight(flightData);
      frameRef.current = null;
      flightTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setFlight(null);
        }
      }, 450);
    });
  };

  useEffect(() => {
    if (!flight) {
      return undefined;
    }

    const handleResize = () => {
      if (isMountedRef.current) {
        setFlight(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [flight]);

  const handleAddToCart = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (inCart) {
      removeFromCart(product.id);
      toast({
        type: 'success',
        message: `${product.name} удалён из корзины`
      });
      return;
    }

    addToCart(product, 1);
    triggerButtonAnimation();
    triggerFlightAnimation();
    toast({
      type: 'success',
      message: `${product.name} добавлен в корзину`
    });
  };

  const handleToggleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      setIsFavoriteDenied(true);
      if (deniedTimerRef.current) {
        clearTimeout(deniedTimerRef.current);
      }
      deniedTimerRef.current = setTimeout(() => {
        setIsFavoriteDenied(false);
      }, 320);
      toast({
        type: 'warning',
        message: 'Войдите в аккаунт, чтобы добавлять в избранное',
        actionLabel: 'Войти',
        onAction: () => {
          router.push('/auth/login?returnTo=/favorites');
        }
      });
      return;
    }

    const willBeFavorite = toggleFavorite(product.id);
    if (favoriteTimerRef.current) {
      clearTimeout(favoriteTimerRef.current);
    }
    setIsFavoritePulsing(true);
    favoriteTimerRef.current = setTimeout(() => {
      setIsFavoritePulsing(false);
    }, 220);
    toast({
      type: 'success',
      message: willBeFavorite ? 'Товар добавлен в избранное' : 'Товар удалён из избранного'
    });
  };

  return (
    <div
      ref={cardRef}
      data-av-card
      className={`${styles.card} av-card av-card-w av-card-hover ${className}`.trim()}
    >
      <div className={`av-card-media ${styles.imageWrapper}`}>
        {typeof product.rating === 'number' ? (
          <span
            className={styles.avRatingBadge}
            aria-label={`Средняя оценка ${product.rating.toFixed(1)} из 5`}
          >
            {product.rating?.toFixed(1) ?? '—'} ★
          </span>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          className="av-card-img"
          style={{ objectFit: 'contain' }}
        />
        <button
          type="button"
          className={`${styles['av-fav-btn']} ${favoriteActive ? styles['av-fav-btn-active'] : ''} ${
            isFavoritePulsing ? styles['av-fav-btn-pulse'] : ''
          } ${
            isFavoriteDenied ? styles['av-fav-btn-shake'] : ''
          }`}
          aria-pressed={favoriteActive}
          aria-label={favoriteActive ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={handleToggleFavorite}
        >
          <svg
            className={styles['av-fav-icon']}
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
          >
            <path d="M12 20.7 10.55 19.4C5.4 14.8 2 11.7 2 8A5 5 0 0 1 7 3a4.5 4.5 0 0 1 5 3 4.5 4.5 0 0 1 5-3 5 5 0 0 1 5 5c0 3.7-3.4 6.8-8.55 11.4Z" />
          </svg>
        </button>
      </div>
      <div className={`av-card-body ${styles.content}`}>
        <h3 className="av-clamp-2">{product.name}</h3>
        <p className={`${styles.description} av-clamp-3`}>{product.description}</p>
        <div className={`${styles.footer} av-card-footer`}>
          <span className={styles.price}>{product.price.toLocaleString()} ₺</span>
          <div className={`${styles.actions} av-card-actions`}>
            <button
              type="button"
              ref={buttonRef}
              className={`${styles.cartButton} ${
                inCart ? styles['av-in-cart'] : ''
              } ${isButtonAnimating ? styles['av-cart-button-pulse'] : ''}`.trim()}
              onClick={handleAddToCart}
              aria-label={
                inCart
                  ? `Удалить ${product.name} из корзины`
                  : `Добавить ${product.name} в корзину`
              }
            >
              {inCart ? 'В корзине' : 'В корзину'}
            </button>
            <Link href={`/products/${product.id}`} className={`${styles.more} av-btn-center`}>
              Подробнее
            </Link>
          </div>
        </div>
      </div>
      {isClient && flight
        ? createPortal(
            <span
              key={flight.key}
              className={`${styles['av-flyer']} ${styles['av-flyer-active']}`}
              style={{
                left: `${flight.left}px`,
                top: `${flight.top}px`,
                '--av-flyer-x': `${flight.deltaX}px`,
                '--av-flyer-y': `${flight.deltaY}px`
              }}
              aria-hidden="true"
            />,
            document.body
          )
        : null}
    </div>
  );
};

export default ProductCard;
