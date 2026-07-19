/**
 * StepCard — numbered step used in "How it works" style sections.
 *
 * Usage:
 *   <StepCard number={1} icon={Zap} title="Pay as usual" description="..." />
 */
export default function StepCard({ number, icon: Icon, title, description }) {
  return (
    <div className="relative bg-surface border border-border rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5">
      <span className="absolute top-5 right-5 text-3xl font-display font-extrabold text-border select-none">
        {String(number).padStart(2, '0')}
      </span>
      <div className="h-11 w-11 rounded-xl bg-teal flex items-center justify-center mb-4">
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-display font-bold text-base text-navy mb-1.5">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed pr-6">{description}</p>
    </div>
  );
}