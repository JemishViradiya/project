import { Abbreviation } from './../hooks/use-bytes-formatter-resolver'
//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { formatBytes } from './formatters'

const abbreviations = Object.values(Abbreviation)

describe('Formatters', () => {
  describe('formatBytes', () => {
    it('should return properly formatted value in bytes', () => {
      const bytes = 4
      const byteIndex = abbreviations.indexOf(Abbreviation.Bytes)
      expect(formatBytes(bytes, 2, byteIndex)).toEqual(4)
    })
    it('should return properly formatted value in KB', () => {
      const bytes = 1024
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.KB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted value in MB', () => {
      const bytes = 1048576
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.MB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted value in GB', () => {
      const bytes = 1073741824
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.GB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted value in TB', () => {
      const bytes = 1099511627776
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.TB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted value in PB', () => {
      const bytes = 1125899906842624
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.PB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted in EB', () => {
      const bytes = 1152921504606847000
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.EB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted in ZB', () => {
      const bytes = 1.1805916207174113e21
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.ZB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted in YB', () => {
      const bytes = 1.2089258196146292e24
      const abbreviationIndex = abbreviations.indexOf(Abbreviation.YB)
      expect(formatBytes(bytes, 2, abbreviationIndex)).toEqual(1)
    })
    it('should return properly formatted decimal value', () => {
      const decimalPlace = 5
      const terabyteIndex = abbreviations.indexOf(Abbreviation.PB)
      expect(formatBytes(1099511627776, decimalPlace, terabyteIndex)).toEqual(0.00098)
    })
  })
})
