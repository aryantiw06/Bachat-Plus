/**
 * StatBlock — a big number + label, used in stat strips on Landing
 * and summary rows on Dashboard.
 *
 * Usage:
 *   <StatBlock value="300M+" label="UPI users in India" />
 */
export default function StatBlock({ value, label, tone = 'light' }) {
  const valueColor = tone === 'dark' ? 'text-mint' : 'text-navy';
  const labelColor = tone === 'dark' ? 'text-white/70' : 'text-text-muted';

  return (
    <div>
      <p className={`font-display font-extrabold text-3xl md:text-4xl ${valueColor}`}>{value}</p>
      <p className={`text-sm mt-1 ${labelColor}`}>{label}</p>
    </div>
  );
}