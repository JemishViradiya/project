import 'cross-fetch/polyfill'

import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import path from 'path'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { LogLevel, PactOptions } from '@pact-foundation/pact'
import { Pact } from '@pact-foundation/pact'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nxProject = __JEST_NX_PROJECT
export const PACT_LOGS_BASE_DIR = `test-results/${nxProject}/pact/logs`
export const PACT_PACTS_BASE_DIR = `test-results/${nxProject}/pact/pacts`

export const PACT_PROVIDER_HOST = '127.0.0.1'

export const HTTP_STATUS_CODE_OK = 200
export const HTTP_STATUS_CODE_CREATED = 201
export const HTTP_STATUS_CODE_NO_CONTENT = 204

export const AUTHORIZATION_TOKEN_MOCK = 'Bearer 2019-01-14T11:34:18.045Z'

export const JSON_CONTENT_TYPE = 'application/json'

const makePactPortOption = () => {
  const min = 20000
  const max = 50000

  return Math.round(Math.random() * (max - min) + min)
}

export const pactProviderFactory = ({ consumer, provider, ...options }: Partial<PactOptions>): Pact => {
  const baseOptions: Partial<PactOptions> = {
    cors: true,
    dir: path.resolve(process.cwd(), PACT_PACTS_BASE_DIR),
    host: PACT_PROVIDER_HOST,
    log: path.resolve(process.cwd(), PACT_LOGS_BASE_DIR, `${consumer}-${provider}.log`),
    logLevel: (process.env.NX_PACT_LOG_LEVEL as LogLevel) || 'info',
    pactfileWriteMode: 'update',
    port: makePactPortOption(),
    spec: 2,
  }

  return new Pact({ consumer, provider, ...baseOptions, ...options })
}

export const pactMockAxiosConfigFactory = <TPactProvidersConfig extends Record<string, ReturnType<typeof pactProviderFactory>>>(
  pactProvidersConfig: TPactProvidersConfig,
  options: AxiosRequestConfig = {},
) => (pactProviderKey: keyof TPactProvidersConfig, baseUrl = '') => {
  const provider = pactProvidersConfig[pactProviderKey]

  const instance = axios.create({
    baseURL: `http://${provider.opts.host}:${provider.opts.port}`,
    headers: {
      Authorization: AUTHORIZATION_TOKEN_MOCK,
      ...options,
    },
  })

  const axiosInstance = () => instance

  return { axiosInstance, baseUrl }
}

export const pactMockApolloConfigFactory = (provider: ReturnType<typeof pactProviderFactory>, baseUrl: string) =>
  new ApolloClient({
    uri: `http://${provider.opts.host}:${provider.opts.port}${baseUrl}`,
    cache: new InMemoryCache({ addTypename: false }),
  })
