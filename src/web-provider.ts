import { trace as TraceApi } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { LoggingSpanProcessor } from "./LoggingSpanProcessor.js";


export const loadWebProvider = ({
  serviceName,
  otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    "http://localhost:4318",
}: {
  serviceName: string;
  otelEndpoint?: string;
}): WebTracerProvider | null => {
  if (otelEndpoint.endsWith('/')) {
    otelEndpoint = otelEndpoint.slice(0, -1)
  }
  const headers = (process.env.OTEL_EXPORTER_OTLP_HEADERS ?? '').split(',').reduce((acc, header) => {
    const [key, value] = header.split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  try {
    const traceExporter = new OTLPTraceExporter({
      url: `${otelEndpoint}/v1/traces`,
      headers,
    });

    const spanProcessor = new BatchSpanProcessor(traceExporter, {
      maxExportBatchSize: 16,
      maxQueueSize: 4096,
      // This makes sure that you don't need to wait too long to see the spans in Honeycomb
      scheduledDelayMillis: 1000,
    });

    const provider = new WebTracerProvider({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
      }),
      spanProcessors:[
        new LoggingSpanProcessor(),
        spanProcessor
      ],
    });
    
    provider.register({ contextManager: new ZoneContextManager() });
    TraceApi.setGlobalTracerProvider(provider);

    console.debug("Observability started");
    return provider;
  } catch (e) {
    console.warn("Observability failed to start", e);
    return null;
  }
};
