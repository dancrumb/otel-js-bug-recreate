# JS OTel Bug Recreate

This repo contains an SSCCE to show an issue that I've seen with the Open Telemetry SDK for JS in the browser.

This is for https://github.com/open-telemetry/opentelemetry-js/issues/5373

## Install

```
npm install
```

## Configure

Create a `./src/env.json` file that contains the following variables:

```json
{
    "OTEL_EXPORTER_OTLP_ENDPOINT": "<the URL of your OTel Collector>",
    "OTEL_EXPORTER_OTLP_HEADERS": "<any headers needed for authentication>"
}
```

## Execute

First, build the bundle

```
npm run build
```

Next, run the server.

```
npm run start
```

You should see the following log output:

```
Starting test...
Loading environment variables...
- Setting OTEL_EXPORTER_OTLP_ENDPOINT to https://api.honeycomb.io/
- Setting OTEL_EXPORTER_OTLP_HEADERS to x-honeycomb-team=hcaik_01jjf4k7s9x577tw6d9tr3x0hdrxds7ja6tyzt5k192v48qny0am3an4c3,x-honeycomb-dataset=otel-bug-recreate
Loaded environment variables...
Starting span Test Parent
Starting span Test Child 1
Ending span Test Child 1
Starting span Test Child 2
Ending span Test Child 2
Ending span Test Parent
Test complete.
Go check your OTel platform.
```

## Expected result

In your OTel Platform, you should see a trace with three spans; a parent with two children

```ascii
.
└── Test Parent
    ├── Test Child 1
    └── Test Child 2
```

## Observed result

Instead, you get two traces, with the second child span becoming a root span

```ascii
.
├── Test Parent
│   └── Test Child 1
└── Test Child 2
```