import shorten, { dropZeros } from './shorten'

const t = global.T()

describe('drop zeros', () => {
  expect(dropZeros('1.')).toBe('1')
  expect(dropZeros('0.')).toBe('0')
  expect(dropZeros('80.0000')).toBe('80')
  expect(dropZeros('2234.002100')).toBe('2234.0021')
  expect(dropZeros('mumble0123.')).toBe('mumble0123')
  expect(dropZeros('fooz123.00oops000')).toBe('fooz123.00oops')
})

describe('number shortening', () => {
  test('some bad cases', () => {
    expect(() => shorten(undefined, t)).toThrow(Error)
    expect(() => shorten({}, t)).toThrow(Error)
    expect(() => shorten([], t)).toThrow(Error)
    expect(() => shorten('not a number', t)).toThrow(Error)
    expect(() => shorten(1.5, t)).toThrow(Error)
    expect(() => shorten(-1, t)).toThrow(Error)
    expect(() => shorten(-10, t)).toThrow(Error)
  })

  test('no rounding', () => {
    expect(shorten(0, t)).toBe('0')
    expect(shorten(1, t)).toBe('1')
    expect(shorten(21, t)).toBe('21')
    expect(shorten(555, t)).toBe('555')
    expect(shorten(4321, t)).toBe('4.32k')
    expect(shorten(54321, t)).toBe('54.3k')
    expect(shorten(654321, t)).toBe('654k')
    expect(shorten(4444444, t)).toBe('4.44M')
    expect(shorten(32103210, t)).toBe('32.1M')
    expect(shorten(432104321, t)).toBe('432M')
    expect(shorten(5432154321, t)).toBe('5.43B')
    expect(shorten(45432154321, t)).toBe('45.4B')
    expect(shorten(345432154321, t)).toBe('345B')
    expect(shorten(2343432154321, t)).toBe('2.34T')
    expect(shorten(12345432154321, t)).toBe('12.3T')
    expect(shorten(212345432154321, t)).toBe('212T')
    expect(shorten(3212345432154321, t)).toBe('3.21e+15')
  })

  test('rounding, just one digit affected', () => {
    expect(shorten(5559, t)).toBe('5.56k')
    expect(shorten(5555559, t)).toBe('5.56M')
    expect(shorten(5555555559, t)).toBe('5.56B')
    expect(shorten(5555555555559, t)).toBe('5.56T')

    expect(shorten(55559, t)).toBe('55.6k')
    expect(shorten(55555559, t)).toBe('55.6M')
    expect(shorten(55555555559, t)).toBe('55.6B')
    expect(shorten(55555555555559, t)).toBe('55.6T')

    expect(shorten(555559, t)).toBe('556k')
    expect(shorten(555555559, t)).toBe('556M')
    expect(shorten(555555555559, t)).toBe('556B')
    expect(shorten(555555555555559, t)).toBe('556T')

    expect(shorten(5555555555555559, t)).toBe('5.56e+15')
  })

  test('rounding, all digits bumped up', () => {
    expect(shorten(999, t)).not.toBe('1k') // except NOT this one

    expect(shorten(9995, t)).toBe('10k')
    expect(shorten(9995000, t)).toBe('10M')
    expect(shorten(9995000000, t)).toBe('10B')
    expect(shorten(9995000000000, t)).toBe('10T')

    expect(shorten(99500, t)).toBe('100k')
    expect(shorten(99500000, t)).toBe('100M')
    expect(shorten(99500000000, t)).toBe('100B')
    expect(shorten(99500000000000, t)).toBe('100T')

    expect(shorten(999500, t)).toBe('1M')
    expect(shorten(999500000, t)).toBe('1B')
    expect(shorten(999500000000, t)).toBe('1T')

    expect(shorten(999500000000000, t)).toBe('1.00e+15')
  })
})
