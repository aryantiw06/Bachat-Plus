// ============================================
// AnimatedCounter — Smooth number roll-up animation
// ============================================
// Displays a number that animates from its previous value to the
// new value using a spring physics curve. Used across the dashboard
// for wallet amounts, health scores, and round-up displays.
//
// Usage:
//   <AnimatedCounter value={1234} prefix="₹" />
//   <AnimatedCounter value={85} suffix="%" />
// ============================================

import { useEffect, useRef } from 'react';
import { useSpring, useTransform, motion } from 'framer-motion';

export default function AnimatedCounter({
  value,            // The target number to animate to
  prefix = '',      // Text before the number (e.g. "₹")
  suffix = '',      // Text after the number (e.g. "%")
  duration = 0.8,   // Animation duration in seconds
  className = '',   // Additional CSS classes
  decimals = 0,     // Decimal places to show
}) {
  // useRef to access the DOM element for updating text content
  const nodeRef = useRef(null);

  // useSpring creates a physics-based animated value.
  // It smoothly transitions from the current number to the new one.
  // stiffness + damping control the spring feel:
  //   higher stiffness = snappier, higher damping = less bounce
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  // useTransform maps the spring value (a float) to a rounded integer.
  // This runs on every animation frame, giving us smooth counting.
  const displayValue = useTransform(springValue, (latest) =>
    latest.toFixed(decimals)
  );

  // When the target `value` changes, update the spring's target.
  // The spring will automatically animate from current → new value.
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  // Subscribe to the animated value and update the DOM directly.
  // This is more performant than re-rendering React on every frame.
  useEffect(() => {
    const unsubscribe = displayValue.on('change', (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
    return unsubscribe;
  }, [displayValue, prefix, suffix]);

  return (
    <motion.span ref={nodeRef} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </motion.span>
  );
}
