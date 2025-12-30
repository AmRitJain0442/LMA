import PropTypes from 'prop-types'

/**
 * NeumorphicInput - Inset input field with soft inner shadows
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, number, email, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text below input
 */
export default function NeumorphicInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`.trim()}>
      {label && (
        <label className="block text-sm font-medium neu-text-primary mb-2 font-display">
          {label}
          {required && <span className="text-neu-error ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          neu-input
          w-full
          px-4
          py-2.5
          neu-text-primary
          placeholder:neu-text-muted
          font-body
          ${error ? 'ring-2 ring-neu-error' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `.trim()}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-neu-error font-body">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs neu-text-muted font-body">{helperText}</p>
      )}
    </div>
  )
}

NeumorphicInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
}
