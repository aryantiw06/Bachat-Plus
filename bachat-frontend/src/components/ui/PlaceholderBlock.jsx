import Card from './Card.jsx';

/**
 * PlaceholderBlock — a clearly-labeled "not built yet" block used
 * inside empty pages during the UI Foundation module, so the
 * scaffolding is honest about what's real vs. what's coming.
 */
export default function PlaceholderBlock({ moduleNote }) {
  return (
    <Card padding="lg" className="border-dashed">
      <p className="text-sm text-text-muted">
        This page's content will be built in{' '}
        <span className="font-semibold text-navy">{moduleNote}</span>.
      </p>
    </Card>
  );
}