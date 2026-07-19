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
        bg-surface border border-border rounded-2xl
        ${paddingStyles[padding]}
        ${hoverable ? 'transition-shadow duration-200 hover:shadow-lg hover:shadow-navy/5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}