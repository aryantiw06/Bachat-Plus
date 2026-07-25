/**
 * Reusable Button component.
 *
 * Usage:
 *   <Button>Click me</Button>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="ghost" size="sm">Skip</Button>
 *   <Button variant="danger">Delete</Button>
 *   <Button loading>Saving...</Button>
 *   <Button fullWidth>Continue</Button>
 */
const VARIANT_STYLES = {
  primary:
    'bg-navy text-white hover:bg-navy-light active:bg-navy-dark shadow-md shadow-navy/20',
  accent:
    'bg-mint text-navy hover:brightness-95 active:brightness-90 shadow-md shadow-mint/30',
  secondary:
    'bg-white text-navy border border-border hover:border-navy/40 hover:bg-navy/5',
  ghost:
    'bg-transparent text-navy hover:bg-navy/5',
  danger:
    'bg-danger text-white hover:brightness-95 active:brightness-90',
};

const SIZE_STYLES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-base px-7 py-3.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        min-h-10 transition-all duration-200 ease-out
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
