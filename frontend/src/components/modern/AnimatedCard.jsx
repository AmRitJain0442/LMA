import { useState } from 'react';
import PropTypes from 'prop-types';

const AnimatedCard = ({
  children,
  className = '',
  hoverEffect = 'lift',
  glowColor = 'primary',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    primary: 'rgba(99, 102, 241, 0.3)',
    secondary: 'rgba(249, 115, 22, 0.3)',
    accent: 'rgba(20, 184, 166, 0.3)',
    none: 'transparent'
  };

  const hoverEffects = {
    lift: 'hover:-translate-y-2',
    scale: 'hover:scale-105',
    rotate: 'hover:rotate-1',
    none: ''
  };

  return (
    <div
      className={`glass-card transition-all duration-300 ${hoverEffects[hoverEffect]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        boxShadow: isHovered
          ? `0 12px 48px rgba(31, 38, 135, 0.2), 0 0 30px ${glowColors[glowColor]}`
          : undefined
      }}
    >
      {children}
    </div>
  );
};

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hoverEffect: PropTypes.oneOf(['lift', 'scale', 'rotate', 'none']),
  glowColor: PropTypes.oneOf(['primary', 'secondary', 'accent', 'none']),
  onClick: PropTypes.func
};

export default AnimatedCard;
