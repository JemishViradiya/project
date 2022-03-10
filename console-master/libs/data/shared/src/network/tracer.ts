import { trace } from '@opentelemetry/api'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger'
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'

import { ConsoleApi, EID_URL, UESAPI_URL } from '@ues-data/network'

export const getPropagateUrls = () => [
  new RegExp(`^${UESAPI_URL}/api`),
  new RegExp(`^${EID_URL}/api`),
  new RegExp(ConsoleApi.apiResolver()),
]

const ignoreUrls = [new RegExp('/uc/session-context')]

export const registerTelemetry = () => {
  const provider = new WebTracerProvider()

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())) // Provide proper exporter
  provider.register({ propagator: new JaegerPropagator() })

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: getPropagateUrls(),
        clearTimingResources: true,
        ignoreUrls,
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: getPropagateUrls(),
        clearTimingResources: true,
        ignoreUrls,
      }),
    ],
    tracerProvider: provider,
  })

  trace.setGlobalTracerProvider(provider)
}
