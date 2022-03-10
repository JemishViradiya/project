import { sanitizeDomain } from './sanitization'

describe('sanitize domain', () => {
  it('should remove leading space', () => {
    expect(sanitizeDomain('.foo')).toStrictEqual('foo')
    expect(sanitizeDomain('.foo.com')).toStrictEqual('foo.com')
    expect(sanitizeDomain('.foo.bar.com')).toStrictEqual('foo.bar.com')
    expect(sanitizeDomain('.我们走吧')).toStrictEqual('我们走吧')
    expect(sanitizeDomain('.我们走吧.Letx')).toStrictEqual('我们走吧.Letx')
  })

  it('should remove trailing space', () => {
    expect(sanitizeDomain('foo.')).toStrictEqual('foo')
    expect(sanitizeDomain('foo.com.')).toStrictEqual('foo.com')
    expect(sanitizeDomain('foo.bar.com.')).toStrictEqual('foo.bar.com')
    expect(sanitizeDomain('我们走吧.')).toStrictEqual('我们走吧')
    expect(sanitizeDomain('我们走吧.Letx.')).toStrictEqual('我们走吧.Letx')
  })

  it('should remove leading and trailing space', () => {
    expect(sanitizeDomain('.foo.')).toStrictEqual('foo')
    expect(sanitizeDomain('.foo.com.')).toStrictEqual('foo.com')
    expect(sanitizeDomain('.foo.bar.com.')).toStrictEqual('foo.bar.com')
    expect(sanitizeDomain('.我们走吧.')).toStrictEqual('我们走吧')
    expect(sanitizeDomain('.我们走吧.Letx.')).toStrictEqual('我们走吧.Letx')
  })
})
