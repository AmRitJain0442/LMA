import PropTypes from 'prop-types'

/**
 * NeumorphicBadge - Status badge with soft shadows
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 * @param {'neutral'|'success'|'warning'|'danger'|'accent'} props.variant - Badge color variant
 * @param {'sm'|'md'|'lg'} props.size - Badge size
 * @param {boolean} props.inset - Use inset shadow
 */
export default function NeumorphicBadge({
  children,
  className = '',
  variant = 'neutral',
  size = 'md',
  inset = false,
  ...props
}) {
  const variantClasses = {
    neutral: 'bg-gradient-to-br from-neu-bg-start to-neu-bg-end neu-text-primary',
    success: 'bg-success-gradient text-white',
    warning: 'bg-warning-gradient text-white',
    danger: 'bg-error-gradient text-white',
    accent: 'bg-accent-gradient text-white',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const shadowClass = inset ? 'shadow-neu-inset-sm' : 'shadow-neu-sm'

  const baseClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${variant === 'neutral' ? shadowClass : 'shadow-md'}
    inline-flex
    items-center
    justify-center
    rounded-full
    font-display
    font-medium
    whitespace-nowrap
  `

  return (
    <span
      className={`${baseClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
}

NeumorphicBadge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['neutral', 'success', 'warning', 'danger', 'accent']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  inset: PropTypes.bool,
}
