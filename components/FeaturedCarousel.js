import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/FeaturedCarousel.module.css';

const AUTO_DELAY = 5000;

const FeaturedCarousel = ({ products }) => {
  const trackRef = useRef(null);
  const focusWithinRef = useRef(false);
  const scrollAnimationFrame = useRef(null);
  const [activeIndexState, setActiveIndexState] = useState(0);
  const activeIndexRef = useRef(0);
  const setActiveIndex = useCallback((value) => {
    const base = activeIndexRef.current;
    const next = typeof value === 'function' ? value(base) : value;
    activeIndexRef.current = next;
    setActiveIndexState(next);
  }, []);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesMeta, setSlidesMeta] = useState([]);
  const liveMessageRef = useRef(null);
  const activeIndex = activeIndexState;

  useEffect(() => {
    activeIndexRef.current = activeIndexState;
  }, [activeIndexState]);

  const validProducts = useMemo(() => products.filter(Boolean), [products]);

  const recalcSlides = useCallback(() => {
    if (!trackRef.current) {
      return;
    }

    const items = Array.from(trackRef.current.children);
    const meta = items.map((item) => ({
      left: item.offsetLeft
    }));

    setSlidesMeta(meta);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(recalcSlides);
    return () => cancelAnimationFrame(id);
  }, [recalcSlides, validProducts]);

  useEffect(() => {
    const handleResize = () => recalcSlides();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [recalcSlides]);

  useEffect(() => {
    if (!trackRef.current || slidesMeta.length === 0) {
      return;
    }

    const targetIndex = Math.min(activeIndex, slidesMeta.length - 1);
    trackRef.current.scrollTo({
      left: slidesMeta[targetIndex].left,
      behavior: 'auto'
    });
    setActiveIndex(targetIndex);
  }, [activeIndex, slidesMeta, setActiveIndex]);

  const goToIndex = useCallback(
    (index, { smooth = true } = {}) => {
      if (!trackRef.current || slidesMeta.length === 0) {
        return;
      }

      const total = slidesMeta.length;
      if (total === 0) {
        return;
      }

      const normalized = ((index % total) + total) % total;
      trackRef.current.scrollTo({
        left: slidesMeta[normalized].left,
        behavior: smooth ? 'smooth' : 'auto'
      });
      setActiveIndex(normalized);
    },
    [slidesMeta, setActiveIndex]
  );

  useEffect(() => {
    if (isPaused || focusWithinRef.current || slidesMeta.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      if (!trackRef.current || slidesMeta.length === 0) {
        return;
      }
      const total = slidesMeta.length;
      const nextIndex = (activeIndexRef.current + 1) % total;
      trackRef.current.scrollTo({
        left: slidesMeta[nextIndex].left,
        behavior: 'smooth'
      });
      setActiveIndex(nextIndex);
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, slidesMeta, setActiveIndex]);

  const syncActiveIndex = useCallback(() => {
    if (!trackRef.current || slidesMeta.length === 0) {
      return;
    }

    const { scrollLeft } = trackRef.current;
    let closestIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    slidesMeta.forEach((slide, index) => {
      const distance = Math.abs(scrollLeft - slide.left);
      if (distance < minDistance) {
        closestIndex = index;
        minDistance = distance;
      }
    });

    setActiveIndex(closestIndex);
  }, [setActiveIndex, slidesMeta]);

  const handleScroll = () => {
    if (scrollAnimationFrame.current) {
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
    scrollAnimationFrame.current = requestAnimationFrame(syncActiveIndex);
  };

  useEffect(() => {
    if (!liveMessageRef.current || !validProducts[activeIndex]) {
      return;
    }
    liveMessageRef.current.textContent = `Показана рекомендация ${validProducts[activeIndex].name}`;
  }, [activeIndex, validProducts]);

  useEffect(() => () => {
    if (scrollAnimationFrame.current) {
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
  }, []);

  const handleFocusCapture = () => {
    focusWithinRef.current = true;
    setIsPaused(true);
  };

  const handleBlurCapture = (event) => {
    if (!trackRef.current) {
      return;
    }

    const nextFocused = event.relatedTarget;
    if (!trackRef.current.contains(nextFocused)) {
      focusWithinRef.current = false;
      setIsPaused(false);
    }
  };

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

  if (validProducts.length === 0) {
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
    >
      <div
        className={styles.track}
        ref={trackRef}
        onScroll={handleScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Новинки и рекомендации"
      >
        {validProducts.map((product) => (
          <div key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {slidesMeta.length > 1 && (
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
            {validProducts.map((product, index) => (
              <li key={product.id} role="presentation">
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
