import PropTypes from 'prop-types'
import { Loader } from 'lucide-react'

/**
 * NeumorphicButton - Tactile button with soft shadows and press animation
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 */
export default function NeumorphicButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClasses = {
    primary: 'neu-button neu-text-accent hover:neu-text-accent-light',
    secondary: 'neu-button neu-text-primary',
    success: 'bg-neu-success text-white shadow-neu hover:shadow-neu-lg',
    warning: 'bg-neu-warning text-white shadow-neu hover:shadow-neu-lg',
    danger: 'bg-neu-error text-white shadow-neu hover:shadow-neu-lg',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const baseClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    font-display
    font-semibold
    inline-flex
    items-center
    justify-center
    rounded-neu-sm
    transition-all
    duration-300
    ease-out
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'active:shadow-neu-inset-sm active:translate-y-0.5'}
  `

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader className="animate-spin h-4 w-4 mr-2" />
      )}
      {children}
    </button>
  )
}

NeumorphicButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
}
