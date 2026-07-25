/**
 * Reusable Card component — the base surface used across dashboards,
 * forms, and stat blocks throughout Bachat+.
 *
 * Usage:
 *   <Card>Content</Card>
 *   <Card padding="lg" hoverable>Content</Card>
 */
export default function Card({
  children,
  padding = 'md',
  hoverable = false,
  className = '',
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-surface/95 backdrop-blur-sm border border-border/90 rounded-2xl shadow-[0_1px_2px_rgba(10,46,92,0.025)]
        ${paddingStyles[padding]}
        ${hoverable ? 'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy/8 hover:border-navy/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
