/**
 * FeatureCard — icon + title + description card used in feature
 * grids across the app (Landing, Investments, Premium).
 *
 * Usage:
 *   <FeatureCard icon={Sparkles} title="AI Advisor" description="..." />
 */
export default function FeatureCard({ icon: Icon, title, description, className = '' }) {
  return (
    <div
      className={`
        group bg-surface border border-border rounded-2xl p-6
        transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5 hover:border-teal/30
        ${className}
      `}
    >
      <div className="h-11 w-11 rounded-xl bg-navy flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-teal">
        <Icon size={20} className="text-mint group-hover:text-white transition-colors duration-200" />
      </div>
      <h3 className="font-display font-bold text-base text-navy mb-1.5">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}