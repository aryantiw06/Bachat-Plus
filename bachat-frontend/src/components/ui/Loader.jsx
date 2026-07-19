/**
 * Spinner — a small inline loading indicator.
 * Usage: <Spinner /> or <Spinner size={32} />
 */
export function Spinner({ size = 20, className = '' }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-block rounded-full border-2 border-teal/25 border-t-teal animate-spin ${className}`}
    />
  );
}

/**
 * PageLoader — a full-height centered loader, used while a page's
 * data is being fetched. Placeholder pages don't need this yet, but
 * every future data-driven page will import it.
 */
export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Spinner size={32} />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}