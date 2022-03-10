import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import type { DeviceByUserItem, DevicesGroupedByUserListResponse, ShortDeviceItem } from '..'
import { PersonaModelStatus, ProvisioningStatus } from '..'
import { getRandomIntNumber } from '../utils'
import type {
  ShortUserItem,
  UserDetails,
  UserDeviceInfo,
  UserDevicesResponse,
  UserItem,
  UsersListResponse,
  ZoneInfo,
} from './users-types'
import { UserState } from './users-types'

const mockZone1: ZoneInfo = {
  id: uuidv4(),
  name: 'zone-winter',
}

const mockZone2: ZoneInfo = {
  id: uuidv4(),
  name: 'zone-spring',
}

const createUser = (id: string, userName: string, state: UserState, zones: ZoneInfo[] = []): UserItem => ({
  id,
  zones,
  userName,
  domainName: 'blackberry.com',
  state,
  lastEventTime: '2020-04-01T20:04:20Z',
})

const createDeviceGroupedByUserItem = (
  userId: string,
  userName: string,
  deviceId: string,
  deviceName: string,
  modelStatus: PersonaModelStatus,
  provisioningStatus: ProvisioningStatus,
): DeviceByUserItem => ({
  userId,
  userName,
  deviceId,
  deviceName,
  modelStatus,
  provisioningStatus,
})

const mockPersonaUsers: UserItem[] = [
  createUser(uuidv4(), 'Evan Vargas', UserState.ONLINE, [mockZone1, mockZone2]),
  createUser(uuidv4(), 'Clara Balistreri', UserState.ONLINE, [mockZone1, mockZone2]),
  createUser(uuidv4(), 'Dangelo Nienow', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Evan Kovacek', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Fidel DuBuque', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Francis Hayes', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Freddy Koss', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Garnett Altenwerth', UserState.OFFLINE, [mockZone1, mockZone2]),
  createUser(uuidv4(), 'Gayle Wintheiser', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Gerardo Spinka', UserState.OFFLINE, [mockZone1, mockZone2]),
  createUser(uuidv4(), 'German Krajcik', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Gianni Jaskolski', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Grayson Wiza', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Gwen Reinger', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Hanna Wiegand', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Harley Mayer', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Harry Hudson', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Heath Padberg', UserState.OFFLINE, [mockZone1]),
  createUser(uuidv4(), 'Hillard Dickinson', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Kylie Herman', UserState.ONLINE, [mockZone2]),
  createUser(uuidv4(), 'Lambert Gulgowski', UserState.OFFLINE, [mockZone1, mockZone2]),
]

const mockDeviceByUserItems: DeviceByUserItem[] = [
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Chris Vargas',
    uuidv4(),
    'ChrisV Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Clara Balistreri',
    uuidv4(),
    'Clara Laptop',
    PersonaModelStatus.PAUSED,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Dangelo Nienow',
    uuidv4(),
    'Dangelo Desktop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SKIPPED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Evan Kovacek',
    uuidv4(),
    'Evan Laptop',
    PersonaModelStatus.TRAINING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Fidel DuBuque',
    uuidv4(),
    'Fidel Laptop',
    PersonaModelStatus.TRAINING,
    ProvisioningStatus.NOT_PROVISIONED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Chris Hayes',
    uuidv4(),
    'ChrisH Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.DELETED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Freddy Koss',
    uuidv4(),
    'Freddy Desktop',
    PersonaModelStatus.PAUSED,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Garnett Altenwerth',
    uuidv4(),
    'Garnett Laptop',
    PersonaModelStatus.TRAINING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Gayle Wintheiser',
    uuidv4(),
    'Gayle Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.NOT_PROVISIONED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Gerardo Spinka',
    uuidv4(),
    'Gerardo Laptop',
    PersonaModelStatus.PAUSED,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'German Krajcik',
    uuidv4(),
    'German Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SKIPPED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Gianni Jaskolski',
    uuidv4(),
    'Gianni Laptop',
    PersonaModelStatus.TRAINING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Grayson Wiza',
    uuidv4(),
    'Grayson Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SKIPPED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Gwen Reinger',
    uuidv4(),
    'Gwen Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Hanna Wiegand',
    uuidv4(),
    'Hanna Laptop',
    PersonaModelStatus.TRAINING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Harley Mayer',
    uuidv4(),
    'Harley Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Harry Hudson',
    uuidv4(),
    'Harry Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.NOT_PROVISIONED,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Heath Padberg',
    uuidv4(),
    'Heath Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Hillard Dickinson',
    uuidv4(),
    'Hillard Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Kylie Herman',
    uuidv4(),
    'Kylie Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
  createDeviceGroupedByUserItem(
    uuidv4(),
    'Lambert Gulgowski',
    uuidv4(),
    'Lambert Laptop',
    PersonaModelStatus.SCORING,
    ProvisioningStatus.SUCCESSFUL,
  ),
]

export const UsersListResponseMock: UsersListResponse = {
  data: mockPersonaUsers,
  meta: {
    page: 1,
    pageSize: 15,
    lastPage: 2,
    total: mockPersonaUsers.length,
  },
}

export const DeviceByUserListResponseMock: DevicesGroupedByUserListResponse = {
  data: mockDeviceByUserItems,
  meta: {
    page: 1,
    pageSize: 15,
    lastPage: 2,
    total: mockDeviceByUserItems.length,
  },
}

export const UserDetailsResponseMock: UserDetails = {
  id: 'F15EA913AD264DAB9EF331EC0F54E4631',
  zones: [
    {
      id: 'B15EA913AD264DAB9EF331EC0F54EEEE',
      name: 'zone-winter',
    },
    {
      id: 'C15EA913AD264DAB9EF331EC0F544444',
      name: 'zone-spring',
    },
  ],
  userName: 'Chris Vargas',
  domainName: 'domainName-one',
}

const mockUserDevices: UserDeviceInfo[] = [
  {
    id: '825CD856BCC5483C81CC7339345BCA8D',
    deviceName: 'Laptop22-North',
    trustScore: 39,
    lastEventTime: moment().toISOString(),
  },
  {
    id: 'ff9e3cc75503493badfb3b31142c66fb',
    deviceName: 'Desktop22-South',
    trustScore: 87,
    lastEventTime: moment().subtract(1, 'days').toISOString(),
  },
]

export const UserDevicesResponseMock: UserDevicesResponse = {
  data: mockUserDevices,
}

export const UserContainsUsernameResponseMock: ShortUserItem[] = mockPersonaUsers.map(({ id, userName, domainName }) => ({
  id,
  userName,
  domainName,
}))

export const DeviceContainsDeviceNameResponseMock: ShortDeviceItem[] = mockDeviceByUserItems.map(({ deviceId, deviceName }) => ({
  deviceId,
  deviceName,
}))

export const getPersonaTenantDeviceOnlineCountResponse = query => {
  const { toTime, interval } = query

  const endTime = new Date(toTime)
  const isLast24Hours = interval === 'hour'
  const dataSetSize = isLast24Hours ? 24 : 30
  const hoursCount = isLast24Hours ? 1 : 24

  const values = []

  for (let i = 0; i <= dataSetSize; i++) {
    const timestamp = new Date(endTime)
    timestamp.setHours(timestamp.getHours() - i * hoursCount, 0, 0, 0)

    const count = getRandomIntNumber(1, 100)

    values.unshift({ timestamp, count })
  }

  return { count: values }
}

export const PersonaTenantTopLowerTrustScoreUsersMockResponse = mockPersonaUsers
  .map(({ id, userName }) => ({
    id,
    userName,
    trustScore: getRandomIntNumber(20, 50),
  }))
  .slice(0, 10)
  .sort((firstItem, secondItem) => firstItem.trustScore - secondItem.trustScore)
