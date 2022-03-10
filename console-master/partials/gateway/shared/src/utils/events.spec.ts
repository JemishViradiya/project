//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { renderHook } from '@testing-library/react-hooks'
import { Hooks } from '@ues-gateway/shared'

import { checkIsHiddenAlertType, resolveTunnelEventTransfer } from './events'
import { useTranslation } from 'react-i18next'
import { ReportingServiceAlertType, ReportingServiceTunnelEvent } from '@ues-data/gateway'
import { FeatureName } from '@ues-data/shared-types'

const { useBytesFormatterResolver } = Hooks

describe('resolveTunnelEventTransfer', () => {
  const {
    result: { current: bytesResolver },
  } = renderHook(() => useBytesFormatterResolver())
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('should compute flow event transfer, when tsTerm is defined', () => {
    const networkEvent: ReportingServiceTunnelEvent = {
      flowId: 12345,
      bytes_total: 10,
      tsTerm: '1606160728006',
    }
    const expectedResult = `${networkEvent.bytes_total} formats:fileSizes.bytes.abbreviation`

    expect(resolveTunnelEventTransfer(networkEvent, t, bytesResolver)).toStrictEqual(expectedResult)
  })

  it('should return label when tsTerm is not defined', () => {
    const networkEvent = {
      flowId: 12345,
      bytes_total: 10,
    }
    const expectedResult = 'common.inProgress'

    expect(resolveTunnelEventTransfer(networkEvent, t, bytesResolver)).toStrictEqual(expectedResult)
  })

  it('should return label when tsTerm is null', () => {
    const networkEvent = {
      flowId: 12345,
      bytes_total: null,
      tsTerm: null,
    }
    const expectedResult = 'common.inProgress'

    expect(resolveTunnelEventTransfer(networkEvent, t, bytesResolver)).toStrictEqual(expectedResult)
  })
})

describe('checkIsHiddenAlertType', () => {
  it(`should return false`, () => {
    const items = [
      {
        alertType: ReportingServiceAlertType.IpReputation,
      },
      {
        alertType: ReportingServiceAlertType.Signature,
      },
    ]
    global.localStorage.setItem(FeatureName.UESBigDnsTunnelingEnabled, 'true')

    items.forEach(item => expect(checkIsHiddenAlertType(item)).toBe(false))

    global.localStorage.setItem(FeatureName.UESBigDnsTunnelingEnabled, 'false')

    items.forEach(item => expect(checkIsHiddenAlertType(item)).toBe(false))
  })

  it(`should return true`, () => {
    const items = [
      {
        alertType: ReportingServiceAlertType.Protocol,
      },
      {
        alertType: ReportingServiceAlertType.DnsTunneling,
      },
    ]
    global.localStorage.setItem(FeatureName.UESBigDnsTunnelingEnabled, 'true')

    items.forEach(item => expect(checkIsHiddenAlertType(item)).toBe(true))
  })
})
