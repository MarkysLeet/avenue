import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/FeaturedCarousel.module.css';

const AUTO_DELAY = 5500;

const getPerSlideByWidth = (width) => {
  if (width >= 1280) {
    return 4;
  }
  if (width >= 768) {
    return 2;
  }
  return 1;
};

const FeaturedCarousel = ({ products = [] }) => {
  const focusWithinRef = useRef(false);
  const liveMessageRef = useRef(null);
  const [perSlide, setPerSlide] = useState(() => {
    if (typeof window === 'undefined') {
      return 1;
    }
    return getPerSlideByWidth(window.innerWidth);
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const updatePerSlide = () => {
      const next = getPerSlideByWidth(window.innerWidth);
      setPerSlide(next);
    };

    updatePerSlide();
    window.addEventListener('resize', updatePerSlide);
    return () => window.removeEventListener('resize', updatePerSlide);
  }, []);

  const validProducts = useMemo(() => products.filter(Boolean), [products]);

  const slides = useMemo(() => {
    const groupSize = Math.max(perSlide, 1);
    const output = [];
    for (let index = 0; index < validProducts.length; index += groupSize) {
      output.push(validProducts.slice(index, index + groupSize));
    }
    return output;
  }, [perSlide, validProducts]);

  useEffect(() => {
    if (slides.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex > slides.length - 1) {
      setActiveIndex(slides.length - 1);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (slides.length < 2 || isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const total = slides.length;
        if (total === 0) {
          return 0;
        }
        return (prev + 1) % total;
      });
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (!liveMessageRef.current) {
      return;
    }

    const currentSlide = slides[activeIndex];
    if (!currentSlide || currentSlide.length === 0) {
      liveMessageRef.current.textContent = '';
      return;
    }

    const names = currentSlide.map((product) => product.name).join(', ');
    liveMessageRef.current.textContent = `Показаны рекомендации: ${names}`;
  }, [activeIndex, slides]);

  const goToIndex = useCallback(
    (index) => {
      if (slides.length === 0) {
        return;
      }
      const total = slides.length;
      const normalized = ((index % total) + total) % total;
      setActiveIndex(normalized);
    },
    [slides.length]
  );

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    if (!focusWithinRef.current) {
      setIsPaused(false);
    }
  };

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => {
    if (!focusWithinRef.current) {
      setIsPaused(false);
    }
  };

  const handleFocusCapture = () => {
    focusWithinRef.current = true;
    setIsPaused(true);
  };

  const handleBlurCapture = (event) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      focusWithinRef.current = false;
      setIsPaused(false);
    }
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      role="region"
      aria-roledescription="carousel"
      aria-label="Новинки и рекомендации"
    >
      <div className={styles.viewport}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((group, index) => (
            <div key={`slide-${index}`} className={styles.slide}>
              <div className={styles.slideInner}>
                {group.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="Предыдущий слайд"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="Следующий слайд"
          >
            <span aria-hidden="true">›</span>
          </button>
          <ol className={styles.dots} role="tablist">
            {slides.map((_, index) => (
              <li key={`dot-${index}`} role="presentation">
                <button
                  type="button"
                  className={
                    index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot
                  }
                  onClick={() => goToIndex(index)}
                  aria-label={`Перейти к слайду ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              </li>
            ))}
          </ol>
        </>
      )}
      <p className={styles.visuallyHidden} aria-live="polite" ref={liveMessageRef} />
    </section>
  );
};

export default FeaturedCarousel;
