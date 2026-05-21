import { useEffect, useState } from 'react';

function Slider() {
  const images = [
    '/slide1.jpg',
    '/slide2.jpg',
    '/slide3.jpg',
    '/slide4.jpg'
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => {
        if (current === images.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  function nextSlide() {
    if (index === images.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }

  function prevSlide() {
    if (index === 0) {
      setIndex(images.length - 1);
    } else {
      setIndex(index - 1);
    }
  }

  return (
    <div className="slider">
      <img src={images[index]} alt="Слайд" />

      <div className="slider-buttons">
        <button onClick={prevSlide}>Назад</button>
        <button onClick={nextSlide}>Вперед</button>
      </div>
    </div>
  );
}

export default Slider;
