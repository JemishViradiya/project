//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { RISK_LEVEL_NUMBER } from './constants'
import { makeKeyToSliderRangeMap } from './utils'

const RANGE_KEY_FROM_SLIDER_VALUE = `${RISK_LEVEL_NUMBER.SECURED}.${RISK_LEVEL_NUMBER.LOW}`
const RANGE_KEY = `${RISK_LEVEL_NUMBER.SECURED}.${RISK_LEVEL_NUMBER.MEDIUM}`

describe('Risk Slider Utils', () => {
  describe('makeKeyToSliderRangeMap', () => {
    it('Should return a proper key for non slider value', () => {
      expect(makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.LOW])).toBe(RANGE_KEY)
    })

    it('Should return a proper key for slider value', () => {
      expect(makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.LOW], true)).toBe(RANGE_KEY_FROM_SLIDER_VALUE)
    })
  })
})
