import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ScrollSection = ({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.2
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [delay, threshold]);

  const animations = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'slide-up': 'animate-slide-up',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
    'scale-in': 'animate-scale-in',
    none: ''
  };

  return (
    <div
      ref={sectionRef}
      className={`
        transition-all duration-700
        ${isVisible ? `${animations[animation]} opacity-100` : 'opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

ScrollSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animation: PropTypes.oneOf([
    'fade-in',
    'fade-in-up',
    'fade-in-down',
    'slide-up',
    'slide-left',
    'slide-right',
    'scale-in',
    'none'
  ]),
  delay: PropTypes.number,
  threshold: PropTypes.number
};

export default ScrollSection;
