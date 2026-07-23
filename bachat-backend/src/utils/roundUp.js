// ============================================
// roundUp.js — Round-Up Calculation Helper
// ============================================

const ROUND_TO = 10;

/**
 * Calculate round-up amount to the nearest ₹10.
 * roundUp = Math.ceil(amount / 10) * 10 - amount
 */
export function calculateRoundUp(amount) {
  const rounded = Math.ceil(amount / ROUND_TO) * ROUND_TO;
  const roundUp = rounded - amount;
  return Math.round(roundUp * 100) / 100;
}

export default calculateRoundUp;
