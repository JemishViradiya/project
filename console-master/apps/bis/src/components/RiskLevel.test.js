import { RiskLevel } from './RiskLevel'

const compare = RiskLevel.compare
const CRITICAL = RiskLevel.CRITICAL
const HIGH = RiskLevel.HIGH
const MEDIUM = RiskLevel.MEDIUM
const LOW = RiskLevel.LOW
const JUNK = 'not a real risk level'
const MORE_JUNK = 'still not a real risk level'

const EQ = '='
const GT = '>'
const LT = '<'

const truthTable = [
  // all levels are equal to themselves
  [CRITICAL, EQ, CRITICAL],
  [HIGH, EQ, HIGH],
  [MEDIUM, EQ, MEDIUM],
  [LOW, EQ, LOW],
  [JUNK, EQ, JUNK],
  [JUNK, EQ, MORE_JUNK],

  // real levels are higher than junk
  [JUNK, LT, CRITICAL],
  [JUNK, LT, HIGH],
  [JUNK, LT, MEDIUM],
  [JUNK, LT, LOW],

  [CRITICAL, GT, JUNK],
  [HIGH, GT, JUNK],
  [MEDIUM, GT, JUNK],
  [LOW, GT, JUNK],

  // CRITICAL is higher than all others
  [CRITICAL, GT, HIGH],
  [CRITICAL, GT, MEDIUM],
  [CRITICAL, GT, LOW],

  [HIGH, LT, CRITICAL],
  [MEDIUM, LT, CRITICAL],
  [LOW, LT, CRITICAL],

  // next is HIGH
  [HIGH, GT, MEDIUM],
  [HIGH, GT, LOW],

  [MEDIUM, LT, HIGH],
  [LOW, LT, HIGH],

  // then MEDIUM
  [MEDIUM, GT, LOW],
  [LOW, LT, MEDIUM],

  // any bogus test case should throw an exception
  // for example, if this was in the table, we
  // ['a', 'not one of LT/GT/EQ', 'b'],
]

describe('RiskLevel compare', () => {
  const equals = truthTable.filter(([_, op]) => op === EQ)
  const lessThan = truthTable.filter(([_, op]) => op === LT)
  const greaterThan = truthTable.filter(([_, op]) => op === GT)

  describe('first == second', () => {
    equals.forEach(([a, _, b]) => {
      it(`compare(${a},${b}) is 0`, () => expect(compare(a, b)).toBe(0))
    })
  })

  describe('first < second', () => {
    lessThan.forEach(([a, _, b]) => {
      it(`compare(${a},${b}) is positive`, () => expect(compare(a, b)).toBeGreaterThan(0))
    })
  })

  describe('first > second', () => {
    greaterThan.forEach(([a, _, b]) => {
      it(`compare(${a},${b}) is negative`, () => expect(compare(a, b)).toBeLessThan(0))
    })
  })

  const junkTests = truthTable.filter(([_, op]) => [GT, LT, EQ].indexOf(op) === -1)
  it('has no junk tests', () => expect(junkTests).toHaveLength(0))
})
