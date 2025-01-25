import { loadWebProvider } from "./web-provider.js";
import env from "./env.json" assert { type: "json" };
import { log } from "./log.js";

const loadEnv = () => {
  log("Loading environment variables...");
  window.process = window.process ?? {};
  process.env = { ...(process.env ?? {}), ...env };
  Object.entries(env).forEach(([key, value]) => {
    log(` - Setting ${key} to ${value}`);
  });
  log("Loaded environment variables...");
};

const test = async () => {
  loadEnv();

  const traceProvider = loadWebProvider({
    serviceName: "otel-recreate",
  });

  if (traceProvider === null) {
    log(`Failed to load the web provider. 
    This is *not* what we're trying to recreate, so if you see this, there's a problem with the recreate code.`);
    return;
  }

  const tracer = traceProvider.getTracer("test");

  await tracer.startActiveSpan("Test Parent", async (testSpan) => {
    await tracer.startActiveSpan("Test Child 1", async (childSpan1) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      childSpan1.end();
    });
    await tracer.startActiveSpan("Test Child 2", async (childSpan2) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      childSpan2.end();
    });
    testSpan.end();
  });
};

log("Starting test...");
test()
  .then(() => {
    log("Test complete.");
    log("Go check your OTel platform.");
  })
  .catch((e) => {
    log(`Unexpected Error: ${e.message}`);
    log(`Check the console`);
    console.error(e);
  });
