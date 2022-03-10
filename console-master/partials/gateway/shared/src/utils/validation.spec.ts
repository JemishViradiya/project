//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import {
  HTTP_PROTOCOLS,
  isIPHost,
  isValidDNSDomain,
  isValidDomainsAndFQDNs,
  isValidIPAddress,
  isValidIPAddresses,
  isValidIPsOrRanges,
  isValidUrl,
  isIPInTargetArray,
  isValidPort,
  isPathValid,
  isValidIPV4CIDR,
} from './validation'

const IPV4_RANGES = ['192.168.0.0/24', '192.168.3.1-192.168.3.24', '192.168.2.1']
const IPV6_RANGES = ['fd12:3456:789a:1::/64', 'fdf8:f53b:82e4::53', '001:db8:1234::1-2001:db8:1234::4']

describe('Validate', () => {
  describe('DNS Domains', () => {
    describe('Should return false when', () => {
      it('Has two periods', () => {
        expect(isValidDNSDomain('foo..bar')).toBe(false)
        expect(isValidDNSDomain('..foo.bar')).toBe(false)
      })
      it('Has invalid < U+0080 characters', () => {
        expect(isValidDNSDomain('foo/bar')).toBe(false)
        expect(isValidDNSDomain(',foo.bar')).toBe(false)
        expect(isValidDNSDomain('foo,bar')).toBe(false)
      })
    })
  })
  describe('Should return true when', () => {
    it('Is the TLD', () => {
      expect(isValidDNSDomain('test')).toBe(true)
    })
    it('Has a leading .', () => {
      expect(isValidDNSDomain('.test')).toBe(true)
    })
    it('Has > U+0080 characters', () => {
      expect(isValidDNSDomain('我们走吧.Letx')).toBe(true)
    })
  })

  describe('FQDNs', () => {
    describe('Should return false when', () => {
      it('Has no TLD', () => {
        expect(isValidDomainsAndFQDNs(['test'])).toBe(false)
      })
      it('Begin or ends with hyphen -', () => {
        expect(isValidDomainsAndFQDNs(['-test.com', 'test-.com'])).toBe(false)
      })
      it('Not starts with [A-Za-z0-9]', () => {
        expect(isValidDomainsAndFQDNs(['.com'])).toBe(false)
      })
      it('Includes comma', () => {
        expect(isValidDomainsAndFQDNs(['test,com'])).toBe(false)
      })
      it('Wildcard is invalid', () => {
        expect(isValidDomainsAndFQDNs(['test.*.com'])).toBe(false)
      })
      it('More than one leading wildcard', () => {
        expect(isValidDomainsAndFQDNs(['**.test.com'])).toBe(false)
      })
      it('More than one wildcard', () => {
        expect(isValidDomainsAndFQDNs(['*.test.*.com'])).toBe(false)
      })
      it('Wildcard within domain', () => {
        expect(isValidDomainsAndFQDNs(['test*.com'])).toBe(false)
      })
    })
    describe('should return true when', () => {
      it('Domain is valid', () => {
        expect(isValidDomainsAndFQDNs(['test.com'])).toBe(true)
      })
      it('Includes subdomains', () => {
        expect(isValidDomainsAndFQDNs(['test.big.com'])).toBe(true)
      })
      it('Includes wildcards', () => {
        expect(isValidDomainsAndFQDNs(['*.big.com'])).toBe(true)
      })
    })
  })

  describe('IP', () => {
    describe('Should return false when', () => {
      it('IP includes less than 4 octets', () => {
        expect(isValidIPAddress('255')).toBe(false)
      })
      it('IP includes characters', () => {
        expect(isValidIPAddress('1.1.y.y')).toBe(false)
      })
      it('IP includes CIDR', () => {
        expect(isValidIPAddress('127.0.0.1/10')).toBe(false)
        expect(isValidIPAddress('2001:db8:1234::/10')).toBe(false)
      })
      it('IP is range', () => {
        expect(isValidIPAddress('192.168.0.1-192.168.1.255')).toBe(false)
        expect(isValidIPAddress('2001:db8:1234::1-2001:db8:1234:0:0:0:0:1')).toBe(false)
      })
      it('IP includes port', () => {
        expect(isValidIPAddress('127.0.0.1:3000')).toBe(false)
        expect(isValidIPAddress('[2001:db8::ff00:42]:8329')).toBe(false)
      })
      it('IP is IPv6 dual address', () => {
        expect(isValidIPAddress('2001:db8:3333:4444:5555:6666:1.2.3.4')).toBe(false)
        expect(isValidIPAddress('::11.22.33.44')).toBe(false)
        expect(isValidIPAddress('2001:db8::123.123.123.123')).toBe(false)
        expect(isValidIPAddress('::1234:5678:91.123.4.56')).toBe(false)
        expect(isValidIPAddress('::1234:5678:1.2.3.4')).toBe(false)
        expect(isValidIPAddress('2001:db8::1234:5678:5.6.7.8')).toBe(false)
      })
    })
    describe('Should return true for valid', () => {
      it('IPv4 address', () => {
        expect(isValidIPAddress('127.0.0.1')).toBe(true)
      })
      it('IPv6 address', () => {
        expect(isValidIPAddress('2001:db8:1234::1')).toBe(true)
      })
    })
  })

  describe('IPs', () => {
    describe('Should return false when', () => {
      it('IP includes less than 4 octets', () => {
        expect(isValidIPsOrRanges(['255'])).toBe(false)
        expect(isValidIPAddresses(['255'])).toBe(false)
      })
      it('IP includes characters', () => {
        expect(isValidIPsOrRanges(['y.y.y.y'])).toBe(false)
        expect(isValidIPAddresses(['y.y.y.y'])).toBe(false)
      })
      it('One of the digits is bigger than 255', () => {
        expect(isValidIPsOrRanges(['11.10.1111.1'])).toBe(false)
        expect(isValidIPAddresses(['11.10.1111.1'])).toBe(false)
      })
      it('One IP from range is invalid', () => {
        expect(isValidIPsOrRanges(['11.10.1111.1-10.11'])).toBe(false)
      })
      it('Range with same IPv4 addresses must fail', () => {
        expect(isValidIPsOrRanges(['127.0.0.1-127.0.0.1'])).toBe(false)
      })
      it('Range with same IPv6 addresses must fail', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::1-2001:db8:1234::1'])).toBe(false)
        expect(isValidIPsOrRanges(['2001:db8:1234::4-2001:db8:1234:0:0:0:0:1'])).toBe(false)
      })
      it('One IP from range is IPv4 and second IPv6', () => {
        expect(isValidIPsOrRanges(['127.0.0.1-2001:db8:1234::1'])).toBe(false)
      })
      it('Range with right IPv4 address smaller than left one must fail', () => {
        expect(isValidIPsOrRanges(['127.0.0.2-127.0.0.1'])).toBe(false)
        expect(isValidIPsOrRanges(['5.5.5.5-9.1.1.1'])).toBe(false)
      })
      it('Range with right IPv6 address smaller than left one must fail', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::2-2001:db8:1234::1'])).toBe(false)
        expect(isValidIPsOrRanges(['2001:db8:1235::1-2001:db8:1234::4'])).toBe(false)
      })
      it('One item in array is invalid', () => {
        expect(isValidIPsOrRanges(['127.0.0.1', '115.42.150.37', 'xyz'])).toBe(false)
        expect(isValidIPAddresses(['127.0.0.1', '115.42.150.37', 'xyz'])).toBe(false)
      })
      it('Array contains duplicate IPs', () => {
        expect(isValidIPsOrRanges(['127.0.0.1', '127.0.0.1', '127.0.0.2'])).toBe(false)
        expect(isValidIPAddresses(['127.0.0.1', '127.0.0.1', '127.0.0.2'])).toBe(false)
      })
      it('Contains CDIR', () => {
        expect(isValidIPAddresses(['2001:db8:1234::/10'])).toBe(false)
      })
      it('Contains ip range', () => {
        expect(isValidIPAddresses(['127.0.0.2-127.0.0.1'])).toBe(false)
        expect(isValidIPAddresses(['2001:db8:1235::1-2001:db8:1237::4'])).toBe(false)
      })
    })
    describe('Should return true for valid', () => {
      it('IPv4 address', () => {
        expect(isValidIPsOrRanges(['127.0.0.1'])).toBe(true)
        expect(isValidIPAddresses(['127.0.0.1'])).toBe(true)
        expect(isValidIPAddresses(['127.0.0.1', '122.0.1.2'])).toBe(true)
      })
      it('IPv6 address', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::1'])).toBe(true)
        expect(isValidIPAddresses(['2001:db8:1234::1'])).toBe(true)
      })
      it('IP address is valid and includes CIDR', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::/10'])).toBe(true)
      })
      it('IP address with CIDR', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::1/10'])).toBe(true)
      })
      it('IPv4 ranges', () => {
        expect(isValidIPsOrRanges(['192.168.0.1-192.168.1.255'])).toBe(true)
        expect(isValidIPsOrRanges(['1.1.0.0-2.0.0.0'])).toBe(true)
      })
      it('IPv4 ranges with spaces', () => {
        expect(isValidIPsOrRanges(['192.168.0.1 - 192.168.1.255'])).toBe(true)
        expect(isValidIPsOrRanges(['192.168.0.1 -192.168.1.255'])).toBe(true)
        expect(isValidIPsOrRanges(['192.168.0.1- 192.168.1.255'])).toBe(true)
      })
      it('IPv6 ranges', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::1-2001:db8:1234::4'])).toBe(true)
        expect(isValidIPsOrRanges(['2001:db8:1234::1-2001:db8:1234:0:0:0:0:1'])).toBe(true)
        expect(isValidIPsOrRanges(['2001:db8:1234::1-2001:db9:1234:0:0:0:0:1'])).toBe(true)
      })
      it('IPv6 ranges with spaces', () => {
        expect(isValidIPsOrRanges(['2001:db8:1234::1 - 2001:db8:1234::4'])).toBe(true)
        expect(isValidIPsOrRanges(['2001:db8:1234::1 -2001:db8:1234::4'])).toBe(true)
        expect(isValidIPsOrRanges(['2001:db8:1234::1- 2001:db8:1234::4'])).toBe(true)
      })
      it('IP items in an array', () => {
        expect(isValidIPsOrRanges(['2001:470:8:66::1', '2001:db8:1234::1-2001:db8:1234::4', '110.234.52.124/12'])).toBe(true)
      })
    })
  })

  describe('Url', () => {
    describe('Should return false when', () => {
      it('Has no protocol', () => {
        expect(isValidUrl('test.com')).toBe(false)
      })
      it('Has invalid protocol', () => {
        expect(isValidUrl('htt://test.com')).toBe(false)
        expect(isValidUrl('ftp://test.com')).toBe(false)
      })
      it('Has invalid domain', () => {
        expect(isValidUrl('http://test')).toBe(false)
        expect(isValidUrl('http://.com')).toBe(false)
      })
    })
    describe('Should return true when', () => {
      HTTP_PROTOCOLS.forEach(protocol =>
        it(`Domain is valid and has ${protocol} protocol`, () => {
          expect(isValidUrl(`${protocol}://test.com`)).toBe(true)
          expect(isValidUrl(`${protocol}://test.com/`)).toBe(true)
          expect(isValidUrl(`${protocol}://test.com/foo`)).toBe(true)
          expect(isValidUrl(`${protocol}://test.com/foo.html`)).toBe(true)
          expect(isValidUrl(`${protocol}://test.com/foo/bar`)).toBe(true)
          expect(isValidUrl(`${protocol}://test.com/foo/bar.html`)).toBe(true)
          expect(isValidUrl(`${protocol}://127.0.0.1:3000`)).toBe(true)
        }),
      )
    })
  })

  describe('isIPHost', () => {
    describe('Should return false when', () => {
      HTTP_PROTOCOLS.forEach(protocol =>
        it(`Domain is URL and has ${protocol} protocol`, () => {
          expect(isIPHost(`${protocol}://test.com`)).toBe(false)
          expect(isIPHost(`${protocol}://test.com/`)).toBe(false)
          expect(isIPHost(`${protocol}://test.com/foo`)).toBe(false)
          expect(isIPHost(`${protocol}://test.com/foo.html`)).toBe(false)
          expect(isIPHost(`${protocol}://test.com/foo/bar`)).toBe(false)
          expect(isIPHost(`${protocol}://test.com/foo/bar.html`)).toBe(false)
        }),
      )
    })
    describe('Should return true when', () => {
      HTTP_PROTOCOLS.forEach(protocol =>
        it(`Host is valid IP and has ${protocol} protocol and/or port`, () => {
          expect(isIPHost(`${protocol}://127.0.0.1:3000`)).toBe(true)
          expect(isIPHost(`${protocol}://127.0.0.1`)).toBe(true)
        }),
      )
    })
  })

  describe('isIPInTargetArray', () => {
    describe('IPv4', () => {
      it('should return true when a DNS Server is the same as private network IP', () => {
        expect(isIPInTargetArray('192.168.2.1', IPV4_RANGES)).toBe(true)
      })

      it('should return true when a DNS Server is in the private network range', () => {
        expect(isIPInTargetArray('192.168.3.2', IPV4_RANGES)).toBe(true)
      })

      it('should return true when a DNS Server is in the private network CIDR', () => {
        expect(isIPInTargetArray('192.168.0.20', IPV4_RANGES)).toBe(true)
      })

      it('should return false for a DNS Server not included in private network', () => {
        expect(isIPInTargetArray('1.1.1.1', IPV4_RANGES)).toBe(false)
      })
    })
  })

  describe('IPv6', () => {
    it('should return true when a DNS Server is the same as private network IP', () => {
      expect(isIPInTargetArray('fdf8:f53b:82e4::53', IPV6_RANGES)).toBe(true)
    })

    it('should return true when a DNS Server is in the private network range', () => {
      expect(isIPInTargetArray('001:db8:1234::1', IPV6_RANGES)).toBe(true)
    })

    it('should return true when a DNS Server is in the private network CIDR', () => {
      expect(isIPInTargetArray('fd12:3456:789a:1::1', IPV6_RANGES)).toBe(true)
    })

    it('should return false for a DNS Server not included in private network', () => {
      expect(isIPInTargetArray('2001:db8:3333:4444:5555:6666:1.2.3.4', IPV6_RANGES)).toBe(false)
    })
  })

  describe('Ports', () => {
    it('Should return true for a valid port', () => {
      expect(isValidPort('222')).toBe(true)
      expect(isValidPort('6101')).toBe(true)
    })

    it('Should return false for an invalid port', () => {
      expect(isValidPort('-222')).toBe(false)
      expect(isValidPort('d6101')).toBe(false)
      expect(isValidPort('test')).toBe(false)
    })
  })

  describe('Paths', () => {
    it('Should return true for a valid path', () => {
      expect(isPathValid('C:\\folder')).toBe(true)
      expect(isPathValid('D:\\folder\\subFolder')).toBe(true)
      expect(isPathValid('d:\\folder\\sub folder')).toBe(true)
      expect(isPathValid('e:\\folder\\subFolder\\file.exe')).toBe(true)
      expect(isPathValid('%AppData%\\folder')).toBe(true)
      expect(isPathValid('%HomePath%\\folder\\subFolder')).toBe(true)
      expect(isPathValid('%HomePath%\\folder\\subFolder\\file.exe')).toBe(true)
    })

    it('Should return false for an invalid path', () => {
      expect(isPathValid(':\\folder')).toBe(false)
      expect(isPathValid('\\folder')).toBe(false)
      expect(isPathValid('path:\\folder')).toBe(false)
      expect(isPathValid('c:\\folder.')).toBe(false)
      expect(isPathValid('C:\\folder\\')).toBe(false)
      expect(isPathValid('c:\\folder\\subFolder%')).toBe(false)
      expect(isPathValid('C:\\folder\\subFolder/')).toBe(false)
      expect(isPathValid('C:\\folder\\subFolder*.*')).toBe(false)
      expect(isPathValid(`d:\\custom\\${'subFolder\\'.repeat(32)}app.exe`)).toBe(false)
      expect(isPathValid('d:\\%HomePath%\\folder\\subFolder')).toBe(false)
      expect(isPathValid('%HomePath%\\folder\\subFolder\\file.exe.')).toBe(false)
    })
  })

  describe('isValidIPV4CIDR', () => {
    it('Should return true for a valid IPv4 CIDR', () => {
      expect(isValidIPV4CIDR('192.168.0.0/24')).toBe(true)
    })

    it('Should return false for an invalid IPv4 CIDR', () => {
      expect(isValidIPV4CIDR('1.1.1.')).toBe(false)
      expect(isValidIPV4CIDR('168.10.1.1')).toBe(false)
      expect(isValidIPV4CIDR('1.1.1.1/8/16')).toBe(false)
      expect(isValidIPV4CIDR('fd12:3456:789a:1::/64')).toBe(false)
    })

    it('Should return true for a suffix less than max', () => {
      expect(isValidIPV4CIDR('1.1.1.1/10', 15)).toBe(true)
    })

    it('Should return false for a suffix greater than max', () => {
      expect(isValidIPV4CIDR('1.1.1.1/17', 15)).toBe(false)
    })
  })
})
