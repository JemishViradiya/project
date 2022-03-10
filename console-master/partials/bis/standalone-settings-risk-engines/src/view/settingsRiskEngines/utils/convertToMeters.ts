import UnitTypes from '../static/UnitTypes'

const YARD_IN_METER = 0.9144
const METERS_IN_KILOMETER = 1000
const YARDS_IN_MILE = 1760

const isNil = value => value == null

const validate = (value, unit) => {
  if (isNil(value) || isNil(unit) || !Object.values(UnitTypes).includes(unit)) {
    throw new Error(`Unable to make conversion to meters. Input: value=${value}, unit=${unit}.`)
  }
}

export default (value, unit) => {
  validate(value, unit)

  switch (unit) {
    case UnitTypes.miles:
      return value * YARDS_IN_MILE * YARD_IN_METER
    case UnitTypes.kilometers:
      return value * METERS_IN_KILOMETER
    case UnitTypes.yards:
      return value * YARD_IN_METER
    default:
      return value
  }
}
