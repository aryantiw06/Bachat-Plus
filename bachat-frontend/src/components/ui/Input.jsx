/**
 * Reusable Input component with an optional label, helper text, and
 * error state. Built for controlled inputs — pass `value` and `onChange`.
 *
 * Usage:
 *   <Input label="Email" type="email" placeholder="you@example.com" />
 *   <Input label="Amount" prefix="₹" />
 *   <Input label="Password" type="password" error="Password is too short" />
 */
export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  prefix,
  icon,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-text">{label}</label>
      )}

      <div
        className={`
          flex items-center gap-2 rounded-xl border bg-surface px-4 py-2.5
          transition-colors duration-150
          ${error ? 'border-danger' : 'border-border focus-within:border-teal'}
          ${disabled ? 'opacity-60' : ''}
        `}
      >
        {icon && <span className="text-text-muted shrink-0">{icon}</span>}
        {prefix && (
          <span className="text-text-muted font-medium shrink-0">{prefix}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm text-text placeholder:text-text-muted/70"
        />
      </div>

      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-muted">{helperText}</span>
      ) : null}
    </div>
  );
}