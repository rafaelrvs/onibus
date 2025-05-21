import React, { useState, useEffect, useCallback } from 'react';
import styles from './Carousel.module.css';
import { textos } from '@/app/data';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  // 1) nextSlide é memoizado apenas uma vez (textos é estático)
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const newIndex = (prev + 1) % textos.length;
      setStartIndex(si =>
        newIndex >= si + itemsPerPage ? si + 1 : si
      );
      return newIndex;
    });
  }, []); // ❌ textos.length removido das deps

  // 2) Intervalo dispara nextSlide a cada 10s
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = (prev - 1 + textos.length) % textos.length;
      setStartIndex(si => (newIndex < si ? si - 1 : si));
      return newIndex;
    });
  };

  return (
    <div className={styles.carouselContainer}>
      <h3>Dicas e informativos</h3>
      <p className={styles.texto}>{textos[currentIndex].descricao}</p>

      <div className={styles.controls}>
        {startIndex > 0 && <button onClick={prevSlide}>&lt;</button>}
        {textos
          .slice(startIndex, startIndex + itemsPerPage)
          .map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${
                idx + startIndex === currentIndex ? styles.active : ''
              }`}
              onClick={() => setCurrentIndex(idx + startIndex)}
            />
          ))}
        {startIndex + itemsPerPage < textos.length && (
          <button onClick={nextSlide}>&gt;</button>
        )}
      </div>
    </div>
  );
};

export default Carousel;
