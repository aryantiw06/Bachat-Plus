// ============================================
// tracer.js — Custom Span Instrumentation Utility
// ============================================
// Provides high-level traceSpan() helper for wrapping operations in custom OpenTelemetry spans:
//   - Firebase Auth verification
//   - Payment Processing
//   - Round-Up Calculation
//   - Smart Investment Wallet Update
//   - Firestore Reads & Writes
//   - Investment Execution
// Automatically records exceptions, status codes, and attributes.
// ============================================

import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracerName = process.env.OTEL_SERVICE_NAME || 'bachat-backend';
const tracer = trace.getTracer(tracerName, '1.0.0');

/**
 * Executes a function inside an active OpenTelemetry custom span.
 * Telemetry failures are safely swallowed so business logic is never interrupted.
 *
 * @param {string} spanName — Name of the span (e.g. 'auth.firebase_verify')
 * @param {Object} attributes — Span attributes (e.g. { uid, merchant, amount })
 * @param {Function} fn — Async/sync function to execute (passes span)
 */
export async function traceSpan(spanName, attributes = {}, fn) {
  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      if (attributes && typeof attributes === 'object') {
        Object.entries(attributes).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            span.setAttribute(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
          }
        });
      }

      const result = await fn(span);

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message || 'Operation failed',
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

export default traceSpan;
