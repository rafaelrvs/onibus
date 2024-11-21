import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';
import { textos } from '@/app/data';


const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000); // Muda a cada 10 segundos
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % textos.length;
    setCurrentIndex(newIndex);
    if (newIndex >= startIndex + itemsPerPage) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + textos.length) % textos.length;
    setCurrentIndex(newIndex);
    if (newIndex < startIndex) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <h3>Dicas e informativos</h3>
      <p className={styles.texto}>{textos[currentIndex].descricao}</p>

      <div className={styles.controls}>
        {startIndex > 0 && (
          <button onClick={prevSlide}>&lt;</button>
        )}
        {textos.slice(startIndex, startIndex + itemsPerPage).map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index + startIndex === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index + startIndex)}
          ></span>
        ))}
        {startIndex + itemsPerPage < textos.length && (
          <button onClick={nextSlide}>&gt;</button>
        )}
      </div>
    </div>
  );
};

export default Carousel;
