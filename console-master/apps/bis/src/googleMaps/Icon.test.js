import { dataURLFromSVGElement as func } from './Icon'

describe('dataURLFromSVGElement', () => {
  it('returns undefined for null, or if the element is not svg', () => {
    expect(func()).toBeUndefined()
    expect(func({ tagName: "not svg, that's for sure" })).toBeUndefined()
  })

  it('returns a data URL for an svg element', () => {
    const mockElement = {
      tagName: 'svg',
      outerHTML: '<svg><excellentcontents /></svg>',
      setAttribute: jest.fn(),
    }
    const res = func(mockElement)
    expect(mockElement.setAttribute).toBeCalled()
    expect(res.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
  })
})
