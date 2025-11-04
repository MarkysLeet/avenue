import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
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

  const favoriteActive = isAuthenticated && isFavorite(product.id);

  useEffect(() => {
    return () => {
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

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const flightData = {
      key: Date.now(),
      startX,
      startY,
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
      setFlight(flightData);
      frameRef.current = null;
      flightTimerRef.current = setTimeout(() => {
        setFlight(null);
      }, 450);
    });
  };

  const handleAddToCart = () => {
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
          router.push('/auth?returnTo=/account?tab=favorites');
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
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
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
      <div className={styles.content}>
        <h3>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
          <div className={styles.actions}>
            <button
              type="button"
              ref={buttonRef}
              className={
                isButtonAnimating
                  ? `${styles.cartButton} ${styles['av-cart-button-pulse']}`
                  : styles.cartButton
              }
              onClick={handleAddToCart}
            >
              В корзину
            </button>
            <Link href={`/products/${product.id}`} className={styles.more}>
              Подробнее
            </Link>
          </div>
        </div>
      </div>
      {flight ? (
        <span
          key={flight.key}
          className={`${styles['av-cart-flight']} ${styles['av-cart-flight-active']}`}
          style={{
            left: `${flight.startX}px`,
            top: `${flight.startY}px`,
            '--av-cart-flight-x': `${flight.deltaX}px`,
            '--av-cart-flight-y': `${flight.deltaY}px`
          }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
};

export default ProductCard;
