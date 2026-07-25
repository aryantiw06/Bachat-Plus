// ============================================
// tracing.js — OpenTelemetry SDK & SigNoz OTLP Bootstrap
// ============================================
// Initialized BEFORE Express starts in server.js.
// Configured to send traces to OTLP HTTP endpoint (default: http://localhost:4318)
// Telemetry failures are safely caught and logged without affecting core backend.
// ============================================

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable OpenTelemetry internal diagnostics ONLY if OTEL_LOG_LEVEL is explicitly set
if (process.env.OTEL_LOG_LEVEL) {
  const levelMap = {
    debug: DiagLogLevel.DEBUG,
    info: DiagLogLevel.INFO,
    warn: DiagLogLevel.WARN,
    error: DiagLogLevel.ERROR,
    verbose: DiagLogLevel.VERBOSE,
  };
  const level = levelMap[process.env.OTEL_LOG_LEVEL.toLowerCase()] || DiagLogLevel.INFO;
  diag.setLogger(new DiagConsoleLogger(), level);
}

const serviceName = process.env.OTEL_SERVICE_NAME || 'bachat-backend';
const rawEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
const otlpEndpointUrl = rawEndpoint.endsWith('/v1/traces')
  ? rawEndpoint
  : `${rawEndpoint.replace(/\/$/, '')}/v1/traces`;

let sdk = null;

try {
  const traceExporter = new OTLPTraceExporter({
    url: otlpEndpointUrl,
  });

  const spanProcessor = new SimpleSpanProcessor(traceExporter);

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    spanProcessor,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable fs auto-instrumentation to prevent noisy span clutter
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();
  if (process.env.OTEL_LOG_LEVEL === 'debug') {
    console.log(`[OTEL] OpenTelemetry SDK started for service "${serviceName}" -> ${otlpEndpointUrl}`);
  }
} catch (error) {
  console.warn('[OTEL] OpenTelemetry SDK initialization skipped/failed (application continues normally):', error?.message || error);
}

// Graceful shutdown helper
const shutdownSDK = async () => {
  if (sdk) {
    try {
      await sdk.shutdown();
    } catch {
      // Ignore shutdown errors on exit
    }
  }
};

process.on('SIGTERM', shutdownSDK);
process.on('SIGINT', shutdownSDK);
