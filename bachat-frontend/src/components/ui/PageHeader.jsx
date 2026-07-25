/**
 * PageHeader — consistent title block used at the top of every
 * dashboard-area page (Payment, Wallet, Investments, etc.).
 *
 * Usage:
 *   <PageHeader title="Wealth Wallet" subtitle="Track your round-up savings" />
 */
export default function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="mb-8 flex items-start justify-between flex-wrap gap-3 relative">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy leading-tight">{title}</h1>
          {badge && (
            <span className="text-xs font-semibold text-mint bg-mint-light px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-text-muted text-sm md:text-[15px] mt-1.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
