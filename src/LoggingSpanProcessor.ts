import { ReadableSpan, Span, SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { log } from "./log.js";


/**
 * This processor ensures that all spans are associated with the appropriate
 * product ID
 */
export class LoggingSpanProcessor implements SpanProcessor {
  
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }
  onStart(span: Span): void {
    log(`Starting span ${span.name}`);
  }
  onEnd(span:ReadableSpan): void {
    log(`Ending span ${span.name}`);
  }
  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}
