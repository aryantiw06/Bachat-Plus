/**
 * Footer — shown at the bottom of public/marketing pages.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Bachat+. Built for HyperFusion 2026.
        </p>
        <p className="text-sm text-text-muted">
          Har Payment Mein Bachat. Har Bachat Mein Investment.
        </p>
      </div>
    </footer>
  );
}