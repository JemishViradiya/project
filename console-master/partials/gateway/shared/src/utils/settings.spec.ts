import { ConnectorConfigInfo, TargetSet, NetworkServiceEntityPartial } from '@ues-data/gateway'
import { isConnectorNotEnrolled, isDestinationsValid } from './settings'

describe('isConnectorNotEnrolled', () => {
  it('should return true when connector is not enrolled', () => {
    const connector = { connectorId: 'test-123', enrolled: { value: false } } as ConnectorConfigInfo
    expect(isConnectorNotEnrolled(connector)).toEqual(true)
  })

  it('should return false rue when connector is enrolled', () => {
    const connector = { connectorId: 'test-123', enrolled: { value: true } } as ConnectorConfigInfo
    expect(isConnectorNotEnrolled(connector)).toEqual(false)
  })
})

describe('isDestinationsValid', () => {
  it('should return true when one of required destination is provided', () => {
    const targetSet = [
      {
        addressSet: ['10.0.0.0/24'],
        portSet: [
          {
            protocol: 'TCP',
            min: 5,
            max: 20,
          },
        ],
      },
    ] as TargetSet[]
    const networkServices = [
      {
        id: '667dea75-g123-47i5-b34u-2978a66u989d',
        name: 'blackberrysquare',
      },
    ] as NetworkServiceEntityPartial[]

    expect(isDestinationsValid({ networkServices, targetSet: [] })).toEqual(true)
    expect(isDestinationsValid({ networkServices: [], targetSet })).toEqual(true)
    expect(isDestinationsValid({ networkServices, targetSet })).toEqual(true)
  })

  it('should return false when destinations are not provided', () => {
    expect(isDestinationsValid({ networkServices: [], targetSet: [] })).toEqual(false)
    expect(isDestinationsValid(undefined)).toEqual(false)
  })
})
