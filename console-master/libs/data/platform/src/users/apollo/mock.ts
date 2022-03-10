import type { PlatformUser, UserInfoAggregated } from '../../shared/types'
import { usersMock } from '../common/users-mock'

export function mockUser({ id }): PlatformUser {
  const userFromMockData = usersMock.elements.find(e => e.id === id)
  const [firstName, lastName] = userFromMockData.displayName.split(' ')
  return {
    id,
    ...userFromMockData,
    firstName,
    lastName,
    tenantId: 'mock',
    created: mockDate(100000),
    updated: mockDate(10000),
  }
}

export function mockAggregatedUser({ id }): UserInfoAggregated {
  const userFromMockData = usersMock.elements.find(e => e.id === id)
  return {
    userId: id,
    ...userFromMockData,
    tenantId: 'mock',
    devices: Math.floor(Math.random() * 10),
    dataSource: userFromMockData.dataSource.toUpperCase(),
    expiry: mockDate(-10000).toISOString(),
  }
}

function mockDate(offset: number): Date {
  const d = new Date()
  d.setTime(Date.now() - offset)
  return d
}
