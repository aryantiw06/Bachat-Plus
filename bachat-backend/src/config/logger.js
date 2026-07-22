// ============================================
// logger.js — Extensible Application Logger
// ============================================
// Reusable logging utility that formats logs in console.
// Structured to easily integrate traceId/spanId context from
// OpenTelemetry / SigNoz context propagation in the future.

import env from './env.js';

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const colors = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[90m', // Gray
  RESET: '\x1b[0m',
};

class Logger {
  constructor() {
    this.logLevel = env.isProduction ? 'INFO' : 'DEBUG';
  }

  // Prepares the log object with standard format.
  // Extensible for future OpenTelemetry trace context aggregation.
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    
    // Placeholder trace/span context to be injected by OpenTelemetry hook later
    const traceContext = {
      traceId: meta.traceId || undefined,
      spanId: meta.spanId || undefined,
    };

    const logObject = {
      timestamp,
      level,
      message,
      ...traceContext,
      metadata: Object.keys(meta).length ? meta : undefined,
    };

    if (env.isProduction) {
      // Production: Structured JSON logging
      return JSON.stringify(logObject);
    } else {
      // Development: Human readable colored logs
      const color = colors[level] || '';
      const reset = colors.RESET;
      const metaString = Object.keys(meta).length ? ` | meta: ${JSON.stringify(meta)}` : '';
      const traceString = traceContext.traceId ? ` [trace_id: ${traceContext.traceId}]` : '';
      return `${color}[${timestamp}] [${level}]${reset}${traceString} — ${message}${metaString}`;
    }
  }

  log(level, message, meta = {}) {
    if (levels[level] <= levels[this.logLevel]) {
      const formatted = this.formatMessage(level, message, meta);
      if (level === 'ERROR') {
        console.error(formatted);
      } else if (level === 'WARN') {
        console.warn(formatted);
      } else {
        console.log(formatted);
      }
    }
  }

  error(message, errorOrMeta = {}) {
    let meta = {};
    if (errorOrMeta instanceof Error) {
      meta = {
        error: errorOrMeta.message,
        stack: errorOrMeta.stack,
      };
    } else {
      meta = errorOrMeta;
    }
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }
}

export const logger = new Logger();
export default logger;
