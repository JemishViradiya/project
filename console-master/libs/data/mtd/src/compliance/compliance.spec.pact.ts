//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { Interaction, Matchers } from '@pact-foundation/pact'

import { complianceProvider, MTD_COMPLIANCE_PACT_CONSUMER_NAME, MTD_COMPLIANCE_PACT_PROVIDER_NAME } from '../config.pact'
import { Compliance, makeEndpoint } from './compliance'

const JSON_CONTENT_TYPE = 'application/json'
const DEVICE_ID = 'b6e8ff6e-aec7-4137-bac5-444efe9653fb'
const USER_ID = 'e6e8ff6e-aec7-4138-bac5-444efe9653fb'
const HTTP_STATUS_NOT_FOUND = 404
const HTTP_STATUS_CODE_OK = 200

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('complianceProvider'))

const notFoundScenario = (providerState: string, description: string) => {
  beforeAll(() => {
    const interaction = new Interaction()
      .given(providerState)
      .uponReceiving(description)
      .withRequest({
        method: 'GET',
        path: makeEndpoint(USER_ID, DEVICE_ID),
      })
      .willRespondWith({
        status: HTTP_STATUS_NOT_FOUND,
      })
    return complianceProvider.addInteraction(interaction)
  })

  afterAll(() => complianceProvider.verify())

  it('should return 404 HTTP Error with error JSON reply', async () => {
    const error = await Compliance.getCompliance(USER_ID, DEVICE_ID).catch(error => error)
    expect(error.response.status).toEqual(HTTP_STATUS_NOT_FOUND)
  })
}

describe(`${MTD_COMPLIANCE_PACT_CONSUMER_NAME}-${MTD_COMPLIANCE_PACT_PROVIDER_NAME} compliance pact`, () => {
  beforeAll(async () => await complianceProvider.setup())
  afterAll(async () => await complianceProvider.finalize())

  describe('get compliance for non existing device', () =>
    notFoundScenario('device is not exist', 'request to get compliance for non existing device'))

  describe('get compliance for device with non existing policy', () =>
    notFoundScenario('device policy is not exist', 'request to get compliance for device with non existing policy'))

  describe('get compliance for compliant device', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given('device is compliant')
        .uponReceiving('request to get compliance for compliant device')
        .withRequest({
          method: 'GET',
          path: makeEndpoint(USER_ID, DEVICE_ID),
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: {
            policyId: Matchers.string('c8ad0bd4-d5e8-4618-b9df-a50fe89ad108'),
            policyName: Matchers.string('Some policy name'),
            complianceList: [],
          },
        })

      return complianceProvider.addInteraction(interaction)
    })

    afterAll(() => complianceProvider.verify())

    it('should return empty compliance list array', async () => {
      const response = await Compliance.getCompliance(USER_ID, DEVICE_ID)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual({
        policyId: expect.any(String),
        policyName: expect.any(String),
        complianceList: [],
      })
    })
  })

  describe('get compliance for non compliant device', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given('device is not compliant')
        .uponReceiving('request to get compliance for non compliant device')
        .withRequest({
          method: 'GET',
          path: makeEndpoint(USER_ID, DEVICE_ID),
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: {
            policyId: Matchers.string('c8ad0bd4-d5e8-4618-b9df-a50fe89ad108'),
            policyName: Matchers.string('Some policy name'),
            complianceList: [
              {
                threatType: 'maliciousApplication',
                remediationTime: Matchers.integer(1621865386237),
                threats: [
                  {
                    id: Matchers.string('65013978-b8e9-4b12-ba46-1f22786a3191'),
                    eventValues: [
                      {
                        key: 'applicationSha256',
                        value: Matchers.string('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'),
                      },
                      {
                        key: 'applicationName',
                        value: Matchers.string('Brown Fox'),
                      },
                      {
                        key: 'packageName',
                        value: Matchers.string('org.fox'),
                      },
                      {
                        key: 'packageVersion',
                        value: Matchers.string('1.1'),
                      },
                    ],
                  },
                  {
                    id: Matchers.string('2764c6f6-cd02-4476-9b66-b72c8f09bc64'),
                    eventValues: [
                      {
                        key: 'applicationSha256',
                        value: Matchers.string('g7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd6'),
                      },
                      {
                        key: 'applicationName',
                        value: Matchers.string('Lazy Dog'),
                      },
                      {
                        key: 'packageName',
                        value: Matchers.string('org.dog'),
                      },
                      {
                        key: 'packageVersion',
                        value: Matchers.string('1.2'),
                      },
                    ],
                  },
                ],
                notifications: {
                  totalCount: 3,
                  sentCount: 3,
                  lastSentTime: Matchers.integer(1617113386358),
                },
              },
              {
                threatType: 'jailbrokenOrRooted',
                remediationTime: Matchers.integer(1621865386237),
                threats: [
                  {
                    id: Matchers.string('13cdf8bc-37b9-4fc8-8add-2fa4488f9d4e'),
                    eventValues: [
                      {
                        key: 'osName',
                        value: Matchers.string('Android'),
                      },
                      {
                        key: 'osVersion',
                        value: Matchers.string('9'),
                      },
                    ],
                  },
                ],
              },
              {
                threatType: 'unsupportedOS',
                remediationTime: Matchers.integer(1621865386237),
                threats: [
                  {
                    id: Matchers.string('4923aa11-efe8-4e3e-aab4-0e17ef4b08e4'),
                    eventValues: [
                      {
                        key: 'osName',
                        value: Matchers.string('Android'),
                      },
                      {
                        key: 'osVersion',
                        value: Matchers.string('9'),
                      },
                    ],
                  },
                ],
                notifications: {
                  totalCount: 3,
                  sentCount: 0,
                  nextSentTime: Matchers.integer(1617113386358),
                },
              },
              {
                threatType: 'insecureWiFi',
                remediationTime: Matchers.integer(1621865386237),
                threats: [
                  {
                    id: Matchers.string('63d40ef9-e950-4e43-9b69-4b91625ca9ad'),
                  },
                ],
                notifications: {
                  totalCount: 3,
                  sentCount: 1,
                  lastSentTime: Matchers.integer(1617113386358),
                  nextSentTime: Matchers.integer(1617113386358),
                },
              },
            ],
          },
        })

      return complianceProvider.addInteraction(interaction)
    })

    afterAll(() => complianceProvider.verify())

    it('should return compliance list array', async () => {
      const response = await Compliance.getCompliance(USER_ID, DEVICE_ID)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual({
        policyId: expect.any(String),
        policyName: expect.any(String),
        complianceList: [
          {
            threatType: 'maliciousApplication',
            remediationTime: expect.any(Number),
            threats: [
              {
                id: expect.any(String),
                eventValues: [
                  {
                    key: 'applicationSha256',
                    value: expect.any(String),
                  },
                  {
                    key: 'applicationName',
                    value: expect.any(String),
                  },
                  {
                    key: 'packageName',
                    value: expect.any(String),
                  },
                  {
                    key: 'packageVersion',
                    value: expect.any(String),
                  },
                ],
              },
              {
                id: expect.any(String),
                eventValues: [
                  {
                    key: 'applicationSha256',
                    value: expect.any(String),
                  },
                  {
                    key: 'applicationName',
                    value: expect.any(String),
                  },
                  {
                    key: 'packageName',
                    value: expect.any(String),
                  },
                  {
                    key: 'packageVersion',
                    value: expect.any(String),
                  },
                ],
              },
            ],
            notifications: {
              totalCount: 3,
              sentCount: 3,
              lastSentTime: expect.any(Number),
            },
          },
          {
            threatType: 'jailbrokenOrRooted',
            remediationTime: expect.any(Number),
            threats: [
              {
                id: expect.any(String),
                eventValues: [
                  {
                    key: 'osName',
                    value: expect.any(String),
                  },
                  {
                    key: 'osVersion',
                    value: expect.any(String),
                  },
                ],
              },
            ],
          },
          {
            threatType: 'unsupportedOS',
            remediationTime: expect.any(Number),
            threats: [
              {
                id: expect.any(String),
                eventValues: [
                  {
                    key: 'osName',
                    value: expect.any(String),
                  },
                  {
                    key: 'osVersion',
                    value: expect.any(String),
                  },
                ],
              },
            ],
            notifications: {
              totalCount: 3,
              sentCount: 0,
              nextSentTime: expect.any(Number),
            },
          },
          {
            threatType: 'insecureWiFi',
            remediationTime: expect.any(Number),
            threats: [
              {
                id: expect.any(String),
              },
            ],
            notifications: {
              totalCount: 3,
              sentCount: 1,
              lastSentTime: expect.any(Number),
              nextSentTime: expect.any(Number),
            },
          },
        ],
      })
    })
  })
})
