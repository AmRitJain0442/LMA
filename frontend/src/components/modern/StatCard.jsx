import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AnimatedCard from './AnimatedCard';

const StatCard = ({
  icon: Icon,
  label,
  value,
  suffix = '',
  prefix = '',
  trend,
  trendValue,
  animate = true,
  accentColor = 'primary',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animate]);

  const accentColors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600'
  };

  const trendColors = {
    up: 'text-accent-600',
    down: 'text-secondary-600',
    neutral: 'text-dark-400'
  };

  return (
    <AnimatedCard
      hoverEffect="lift"
      glowColor={accentColor}
      className={`p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${accentColor}-100 to-${accentColor}-50`}>
          {Icon && <Icon className={`w-6 h-6 ${accentColors[accentColor]}`} strokeWidth={2} />}
        </div>

        {trend && trendValue && (
          <div className={`text-sm font-semibold ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-bold text-dark-900">
          {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}{suffix}
        </div>
        <div className="text-sm font-medium text-dark-500">
          {label}
        </div>
      </div>
    </AnimatedCard>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.string,
  animate: PropTypes.bool,
  accentColor: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  className: PropTypes.string
};

export default StatCard;
