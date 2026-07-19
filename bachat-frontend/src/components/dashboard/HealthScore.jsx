// ============================================
// HealthScore — Circular progress ring (0–100)
// ============================================
// Displays a financial health score calculated from:
//   • Base: 30 points (everyone starts here)
//   • +1 per transaction (max 30 bonus points)
//   • +1 per ₹10 invested (max 40 bonus points)
//
// Total max: 30 + 30 + 40 = 100
//
// The circular ring animates on load and when the score changes.
// Color shifts: red (<40) → yellow (40–69) → green (≥70)
// ============================================

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import Card from '../ui/Card.jsx';

// SVG circle math
const SIZE = 120;           // SVG viewport size
const STROKE_WIDTH = 10;    // Ring thickness
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;  // Full circle length

// Calculate the score (0–100)
function calculateScore(investmentWallet, transactionCount) {
  const base = 30;
  const txBonus = Math.min(transactionCount, 30);         // +1 per tx, max 30
  const investBonus = Math.min(Math.floor(investmentWallet / 10), 40); // +1 per ₹10, max 40
  return Math.min(base + txBonus + investBonus, 100);
}

// Get color based on score tier
function getScoreColor(score) {
  if (score < 40) return { ring: '#e5484d', bg: 'bg-danger/10', text: 'text-danger', label: 'Needs Attention' };
  if (score < 70) return { ring: '#f5a524', bg: 'bg-warning/10', text: 'text-warning', label: 'Good Progress' };
  return { ring: '#02c39a', bg: 'bg-mint/10', text: 'text-mint', label: 'Excellent' };
}

export default function HealthScore({ investmentWallet, transactionCount }) {
  const score = calculateScore(investmentWallet, transactionCount);
  const colors = getScoreColor(score);

  // Animate the ring fill
  const progress = useSpring(0, { stiffness: 60, damping: 20 });
  const strokeDashoffset = useTransform(
    progress,
    (latest) => CIRCUMFERENCE - (latest / 100) * CIRCUMFERENCE
  );

  // Animate the score number
  const scoreNodeRef = useRef(null);
  const displayScore = useTransform(progress, (latest) => Math.round(latest));

  useEffect(() => {
    progress.set(score);
  }, [score, progress]);

  // Update score number via DOM for performance
  useEffect(() => {
    const unsubscribe = displayScore.on('change', (latest) => {
      if (scoreNodeRef.current) {
        scoreNodeRef.current.textContent = latest;
      }
    });
    return unsubscribe;
  }, [displayScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="flex flex-col items-center gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 self-start">
          <Heart size={16} className="text-danger" />
          <h3 className="font-semibold text-sm text-navy">Financial Health</h3>
        </div>

        {/* Circular progress ring */}
        <div className="relative">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
          >
            {/* Background ring (grey track) */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              className="text-border"
            />

            {/* Animated foreground ring */}
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={colors.ring}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset }}
            />
          </svg>

          {/* Score number in the center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              ref={scoreNodeRef}
              className={`font-display font-extrabold text-2xl ${colors.text}`}
            >
              {score}
            </span>
            <span className="text-[10px] text-text-muted font-medium">/ 100</span>
          </div>
        </div>

        {/* Score label */}
        <div className={`${colors.bg} rounded-full px-3 py-1`}>
          <span className={`text-xs font-semibold ${colors.text}`}>
            {colors.label}
          </span>
        </div>

        {/* Breakdown */}
        <div className="w-full space-y-2 mt-1">
          <ScoreRow
            label="Base Score"
            value={30}
            max={30}
          />
          <ScoreRow
            label="Transactions"
            value={Math.min(transactionCount, 30)}
            max={30}
          />
          <ScoreRow
            label="Investment"
            value={Math.min(Math.floor(investmentWallet / 10), 40)}
            max={40}
          />
        </div>
      </Card>
    </motion.div>
  );
}

// Mini progress bar row for the breakdown section
function ScoreRow({ label, value, max }) {
  const percent = (value / max) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-muted w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-full bg-mint rounded-full"
        />
      </div>
      <span className="text-xs text-text-muted w-10 text-right shrink-0">
        {value}/{max}
      </span>
    </div>
  );
}
