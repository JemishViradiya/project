import UnitTypes from '../static/UnitTypes'
import convertToMeters from './convertToMeters'

describe('convertToMeters', () => {
  it.each`
    value      | unit                    | expectedResult
    ${253542}  | ${UnitTypes.miles}      | ${408036296.448}
    ${9236}    | ${UnitTypes.yards}      | ${8445.3984}
    ${43636}   | ${UnitTypes.kilometers} | ${43636000}
    ${9236478} | ${UnitTypes.meters}     | ${9236478}
  `('should return $expectedResult when when input value is $value $unit', ({ value, unit, expectedResult }) => {
    // when
    const result = convertToMeters(value, unit)

    // then
    expect(result).toBe(expectedResult)
  })

  it.each`
    value        | unit
    ${undefined} | ${undefined}
    ${null}      | ${null}
    ${6345}      | ${undefined}
    ${undefined} | ${UnitTypes.miles}
    ${31232}     | ${'SOME_OTHER_UNIT'}
  `('should throw error matching snapshot when value is $value and unit is $unit', ({ value, unit }) => {
    expect(() => {
      convertToMeters(value, unit)
    }).toThrowErrorMatchingSnapshot()
  })
})
