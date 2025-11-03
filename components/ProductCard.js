import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const buttonRef = useRef(null);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [flight, setFlight] = useState(null);
  const buttonTimerRef = useRef(null);
  const flightTimerRef = useRef(null);
  const frameRef = useRef(null);

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
