/**
 * Badge — small pill label used for tags like "AI", "Premium", or
 * section eyebrows across the app.
 *
 * Usage:
 *   <Badge>AI</Badge>
 *   <Badge tone="navy">New</Badge>
 */
const TONE_STYLES = {
  mint: 'text-mint bg-mint-light',
  navy: 'text-white bg-navy',
  teal: 'text-white bg-teal',
  outline: 'text-navy border border-border bg-white',
};

export default function Badge({ children, tone = 'mint', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full ${TONE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}