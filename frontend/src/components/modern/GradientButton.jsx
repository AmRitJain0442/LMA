import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const GradientButton = ({
  children,
  variant = 'duotone',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon
}) => {
  const variants = {
    duotone: 'btn-gradient',
    outline: 'btn-outline',
    primary: 'bg-gradient-primary text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg hover:-translate-y-0.5',
    accent: 'bg-gradient-accent text-white hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 border border-transparent hover:border-primary-200'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

GradientButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['duotone', 'outline', 'primary', 'secondary', 'accent', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.elementType
};

export default GradientButton;
