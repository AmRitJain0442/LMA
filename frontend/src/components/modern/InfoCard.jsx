import PropTypes from 'prop-types';
import AnimatedCard from './AnimatedCard';

const InfoCard = ({
  icon: Icon,
  title,
  description,
  accentColor = 'primary',
  iconBg = true,
  className = ''
}) => {
  const accentColors = {
    primary: {
      bg: 'bg-primary-100',
      text: 'text-primary-600',
      glow: 'primary'
    },
    secondary: {
      bg: 'bg-secondary-100',
      text: 'text-secondary-600',
      glow: 'secondary'
    },
    accent: {
      bg: 'bg-accent-100',
      text: 'text-accent-600',
      glow: 'accent'
    }
  };

  const colors = accentColors[accentColor];

  return (
    <AnimatedCard
      hoverEffect="lift"
      glowColor={colors.glow}
      className={`p-6 ${className}`}
    >
      <div className="flex flex-col items-start gap-4">
        {Icon && (
          <div
            className={`
              p-3 rounded-xl
              ${iconBg ? colors.bg : ''}
              ${colors.text}
              transition-transform duration-300
              group-hover:scale-110
            `}
          >
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark-800 mb-2">
            {title}
          </h3>
          <p className="text-dark-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accentColor: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  iconBg: PropTypes.bool,
  className: PropTypes.string
};

export default InfoCard;
