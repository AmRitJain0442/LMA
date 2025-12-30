import PropTypes from 'prop-types'

/**
 * NeumorphicCard - Extruded card surface with soft shadows
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content inside the card
 * @param {string} props.className - Additional CSS classes
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Shadow depth size
 * @param {boolean} props.inset - Use inset shadow instead of extruded
 * @param {boolean} props.hover - Enable hover animation
 * @param {function} props.onClick - Click handler
 */
export default function NeumorphicCard({
  children,
  className = '',
  size = 'md',
  inset = false,
  hover = false,
  onClick,
  ...props
}) {
  const sizeClasses = {
    sm: inset ? 'shadow-neu-inset-sm' : 'shadow-neu-sm',
    md: inset ? 'shadow-neu-inset' : 'shadow-neu',
    lg: inset ? 'shadow-neu-inset-lg' : 'shadow-neu-lg',
    xl: 'shadow-neu-xl',
  }

  const baseClasses = `
    bg-neu-bg
    ${sizeClasses[size]}
    rounded-neu
    transition-all
    duration-300
    ${hover ? 'hover:shadow-neu-lg hover:-translate-y-1' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

NeumorphicCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  inset: PropTypes.bool,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
}
