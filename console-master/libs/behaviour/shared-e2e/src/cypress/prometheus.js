const { Agent } = require('https')
const { Counter, exponentialBuckets, Histogram, Pushgateway } = require('prom-client')

const Labels = ['state', 'suite', 'test', 'project']

/** @typedef {import('./prometheus.d').MochaTest} MochaTest */

/** @type {{ gateway?: Pushgateway; counters?: Record<'passFail', Counter>; histograms: Record<'duration', Histogram> }} */
const locals = {}
const pushgatewayAuthorization = process.env.PUSHGATEWAY_AUTHORIZATION

class PrometheusReporter {
  static prefix = 'ues_console_cypress_'

  /** @property {Pushgateway.Parameters} gatewayParams */
  /** @property {Set<Promise<unknown>>} pending */

  /**
   * reporter for mocha.js.
   * @param {EventEmitter} runner - the test runner
   * @param {Object} options - mocha options
   */
  constructor(runner, { reporterOptions }) {
    if (reporterOptions[__filename]) reporterOptions = reporterOptions[__filename]
    if (pushgatewayAuthorization && reporterOptions.enabled !== false) {
      if (!locals.gateway) {
        console.log('Using reporter Prometheus')
        locals.gateway = new Pushgateway(
          process.env.PUSHGATEWAY_URL || 'https://ues-e2e-sup.devlab2k.testnet.rim.net/prometheus-pushgateway',
          {
            headers: {
              authorization: `Basic ${process.env.PUSHGATEWAY_AUTHORIZATION}`,
            },
            timeout: 3000, // Set the request timeout to 3sec
            agent: new Agent({
              keepAlive: true,
              honorCipherOrder: true,
              maxSockets: 5,
            }),
          },
        )
        locals.counters = {
          passFail: new Counter({
            name: PrometheusReporter.prefix + 'test_counter',
            help: 'Test results counter',
            labelNames: Labels.concat(['retry']),
          }),
        }
        locals.histograms = {
          duration: new Histogram({
            name: PrometheusReporter.prefix + 'test_duration',
            help: 'Test duration analysis',
            labelNames: Labels,
            buckets: exponentialBuckets(1, 5, 5),
          }),
        }
      }
      const { jobName, ...groupings } = reporterOptions
      /** @type {Pushgateway.Parameters} */
      this.gatewayParams = { jobName, groupings }
      this.pending = new Set()

      runner.on('test', (...args) => this._test(...args))
      runner.on('pass', (...args) => this._passed(...args))
      runner.on('fail', (...args) => this._failed(...args))
      runner.on('retry', (...args) => this._failed(...args))
      runner.on('start', () => this._init())
      runner.on('end', () => this._finishTest())
    }
  }

  /**
   * @param {MochaTest} test
   */
  _test(test) {
    test.wallClockStartedAt = test.wallClockStartedAt || new Date().toUTCString()
  }

  /**
   * @param {MochaTest} test
   * @param {'passed' | 'failed'} state
   */
  _recordTest(test, state) {
    if (!test.duration && test.wallClockStartedAt) {
      test.duration = Date.now() - new Date(test.wallClockStartedAt).valueOf()
    }

    console.log(`_${state}`, { duration: test.duration, pushMetrics: !!locals.gateway, ...this.gatewayParams })

    const retry = (typeof test.currentRetry === 'function' ? test.currentRetry() : test.currentRetry || 0) !== 0
    const labels = {
      state,
      test: titleOf(test),
      suite: titleOf(test.parent),
    }

    locals.counters.passFail.inc({ ...labels, retry })
    if (test.duration) {
      locals.histograms.duration.labels(labels).observe((test.duration || 1000) / 1000)
    }

    ;(async () => {
      /** @type {Promise<{ resp: IncomingMessage; body: string; req: ClientRequest }>} */
      let task
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        task = locals.gateway.pushAdd(this.gatewayParams).then(({ resp, body }) => {
          if (resp.statusCode < 200 || resp.statusCode > 299) {
            throw new Error(`Invalid Metrics (${resp.statusCode}): ${body}`)
          }
          return resp.statusCode
        })
        this.pending?.add(task)
        await task
      } catch (error) {
        console.log('Recording metrics failed:', error.message || error)
      } finally {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (task) this.pending?.delete(task)
      }
    })()
    return true
  }

  /** after a passed test
   * @param {MochaTest} test
   */
  _passed(test) {
    return this._recordTest(test, 'passed')
  }

  // after a failed test
  /** after a failed test
   * @param {MochaTest} test
   * @param {Error} [error]
   */
  _failed(test, error) {
    return this._recordTest(test, 'failed')
  }

  // start all tests
  _init() {
    // noop
  }

  // after all tests
  _finishTest() {
    return (async () => {
      const pending = this.pending?.values()
      if (pending) await Promise.all(Array.from(pending))
    })()
  }
}

module.exports = PrometheusReporter

function titleOf(test) {
  if (!test) return '<unknown>'
  return typeof test.fullTitle === 'function' ? test.fullTitle() : test.title
}
