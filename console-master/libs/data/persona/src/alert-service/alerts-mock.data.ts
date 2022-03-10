import { v4 as uuidv4 } from 'uuid'

import { getRandomIntNumber, takeRandomArrayItem } from '../utils'
import type {
  AlertListItem,
  AlertListResponse,
  GetAlertsWithTrustScoreParams,
  GetPersonaScoreLogParams,
  PersonaAlertWithTrustScoreItem,
  PersonaScoreLogItem,
} from './alerts-types'
import { PersonaAlertStatus, PersonaScoreType, PersonaSeverity } from './alerts-types'

const SIZE_OF_DATASET = 100
const MILLISECONDS_IN_MINUTE = 60000
const MINUTES_IN_24_HRS = 24 * 60
const MINUTES_IN_30_DAYS = MINUTES_IN_24_HRS * 30

const PERSONA_EVENT_IDENTIFIERS_MAP = {
  USER_FAILED_LOGON: 4625,
  MALICIOUS_RULE_HIT: 10100,
  FORCED_STEP_UP: 30200,
  USER_FAILED_2FA_LOGON: 40110,
}

const PERSONA_SEVERITY_LEVELS = [
  1, // PERSONA_SEVERITY_LEVEL_INFORMATIONAL:
  2, // PERSONA_SEVERITY_LEVEL_LOW:
  3, // PERSONA_SEVERITY_LEVEL_MEDIUM:
  4, // PERSONA_SEVERITY_LEVEL_HIGH:
  5, // PERSONA_SEVERITY_LEVEL_CRITICAL:
]
// Only define relevant event IDs
const PERSONA_EVENT_IDENTIFIERS = [
  4625, // PERSONA_USER_FAILED_LOGON: // No Associated Value
  10100, // PERSONA_MALICIOUS_RULE_HIT: // Value: CAE Rule ID
  30200, // PERSONA_FORCED_STEP_UP: // Value: User overall trust score [0-100]
  40110, // PERSONA_USER_FAILED_2FA_LOGON: // Value: 1: Google Auth, 2: FIDO
]

const getRandomSeverityLevel = () => {
  return takeRandomArrayItem(PERSONA_SEVERITY_LEVELS)
}

const getRandomEventId = () => {
  return takeRandomArrayItem(PERSONA_EVENT_IDENTIFIERS)
}

const mockDevice1 = {
  id: uuidv4(),
  name: 'WIN_TEST_01',
}

const mockDevice2 = {
  id: uuidv4(),
  name: 'WIN_TEST_02',
}

const mockUser1 = {
  id: uuidv4(),
  name: 'Chris Vargas',
}

const mockUser2 = {
  id: uuidv4(),
  name: 'Freddy Koss',
}

const createAlert = (
  id: string,
  eventId: number,
  severity: PersonaSeverity,
  status: PersonaAlertStatus,
  timestamp: string,
  device,
  user,
): AlertListItem => ({
  alertId: id,
  deviceId: device.id,
  deviceName: device.name,
  domainName: 'blackberry.com',
  eventId,
  severity,
  status,
  timestamp,
  trustScore: Math.random() * 100,
  userId: user.id,
  userName: user.name,
})

const mockAlertsList = [
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.CRITICAL,
    PersonaAlertStatus.NEW,
    '2021-07-08T20:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.CRITICAL,
    PersonaAlertStatus.NEW,
    '2021-07-08T19:00:00Z',
    mockDevice2,
    mockUser2,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.CRITICAL,
    PersonaAlertStatus.NEW,
    '2021-07-08T18:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.CRITICAL,
    PersonaAlertStatus.IN_PROGRESS,
    '2021-07-08T17:00:00Z',
    mockDevice2,
    mockUser2,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.CRITICAL,
    PersonaAlertStatus.IN_PROGRESS,
    '2021-07-08T16:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.NEW,
    '2021-07-08T15:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.FORCED_STEP_UP,
    PersonaSeverity.HIGH,
    PersonaAlertStatus.NEW,
    '2021-07-08T14:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.NEW,
    '2021-07-08T13:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.NEW,
    '2021-07-08T12:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.NEW,
    '2021-07-08T11:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.NEW,
    '2021-07-08T10:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.IN_PROGRESS,
    '2021-07-08T09:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.FALSE_POSITIVE,
    '2021-07-08T08:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_2FA_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.FALSE_POSITIVE,
    '2021-07-08T07:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.REVIEWED,
    '2021-07-08T06:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.FALSE_POSITIVE,
    '2021-07-08T05:00:00Z',
    mockDevice1,
    mockUser1,
  ),
  createAlert(
    uuidv4(),
    PERSONA_EVENT_IDENTIFIERS_MAP.USER_FAILED_LOGON,
    PersonaSeverity.LOW,
    PersonaAlertStatus.REVIEWED,
    '2021-07-08T04:00:00Z',
    mockDevice1,
    mockUser1,
  ),
]

export const getAlertListResponse = ({ includeMeta = false }): AlertListResponse => {
  let response: AlertListResponse = {
    data: mockAlertsList,
  }

  if (includeMeta) {
    response = {
      ...response,
      meta: {
        page: 1,
        pageSize: 15,
        lastPage: 2,
        total: mockAlertsList.length,
      },
    }
  }
  return response
}

const generateTrustScore = (type: PersonaScoreType): number => {
  switch (type) {
    // Sample trust scores between 70-90
    case PersonaScoreType.TRUSTSCORE:
      return Math.floor(Math.random() * 20) + 70
    // Sample meta scores between 0-100
    case PersonaScoreType.META:
    case PersonaScoreType.CONDUCT:
    case PersonaScoreType.KEYBOARD:
    case PersonaScoreType.MOUSE:
    case PersonaScoreType.NETWORK:
    case PersonaScoreType.LOGON:
      return Math.random() * 100
    default:
      return -1
  }
}

const generateScoresLog = ({
  fromTime,
  toTime,
  scoreType,
}: {
  fromTime: string
  toTime: string
  scoreType: PersonaScoreType
}): PersonaScoreLogItem[] => {
  const startTime = new Date(fromTime)
  const endTime = new Date(toTime)

  // Determine if request is for data within last 24 hours.
  // If not then return data within last 30 days.
  const isLast24Hours = endTime.getTime() - startTime.getTime() <= MINUTES_IN_24_HRS * MILLISECONDS_IN_MINUTE

  const values: PersonaScoreLogItem[] = []
  const interval = (isLast24Hours ? MINUTES_IN_24_HRS : MINUTES_IN_30_DAYS) / SIZE_OF_DATASET
  const nullsToAdd = Math.floor(Math.random() * 25)

  for (let i = 0; i <= SIZE_OF_DATASET; i++) {
    const timestamp = new Date(endTime)
    timestamp.setMinutes(timestamp.getMinutes() - i * interval)
    const score = generateTrustScore(scoreType)

    values.unshift({ timestamp: timestamp.toISOString(), score: score })
  }

  for (let i = nullsToAdd; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (values.length - 1))
    values[randomIndex].score = null
  }

  return values
}

const createScoreForAlert = (score: number, scoreType: PersonaScoreType, timestamp, user, device): PersonaScoreLogItem => ({
  timestamp,
  score,
  scoreType,
  userId: user.id,
  deviceId: device.id,
})

const scoresForAlertTimestamp = '2021-07-08T19:30:00Z'
export const GetScoresForAlertResponse = [
  createScoreForAlert(30, PersonaScoreType.TRUSTSCORE, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(99.52720999717712, PersonaScoreType.META, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(0, PersonaScoreType.KEYBOARD, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(47.38597384334531, PersonaScoreType.MOUSE, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(25.939849019050598, PersonaScoreType.CONDUCT, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(50.1, PersonaScoreType.NETWORK, scoresForAlertTimestamp, mockUser1, mockDevice1),
  createScoreForAlert(62.53, PersonaScoreType.LOGON, scoresForAlertTimestamp, mockUser1, mockDevice1),
]

export const getScoreLogResponse = (params: GetPersonaScoreLogParams) => generateScoresLog(params)

export const getAlertsWithTrustScoreResponse = (params: GetAlertsWithTrustScoreParams): PersonaAlertWithTrustScoreItem[] => {
  const modifiedParams = { ...params, scoreType: PersonaScoreType.TRUSTSCORE }
  const scores = generateScoresLog(modifiedParams)
  // Take 3 points: middle, two half middles
  // Since the dataset is always 100.
  const sampleIndexList = [25, 50, 75]
  const sampleScores = sampleIndexList.map(v => scores[v])

  return sampleScores.map(val => ({
    timestamp: val.timestamp,
    trustScore: val.score,
    eventId: getRandomEventId(),
    severity: getRandomSeverityLevel(),
    id: uuidv4(),
  }))
}

export const AlertDetailsMockResponse = {
  id: uuidv4(),
  userId: uuidv4(),
  deviceId: uuidv4(),
  userName: 'blair-short',
  domainName: 'domainName1',
  userZoneName: 'userZoneName1',
  deviceName: 'DRPES-11-XX',
  ipAddress: '1.1.1.1',
  timestamp: '2020-12-06T21:04:20.311Z',
  eventId: 10100,
  severity: PersonaSeverity.MEDIUM,
  status: PersonaAlertStatus.NEW,
  trustScore: 31,
  lowestTrustScore: 25,
}

export const GetAlertHistoryAndCommentsResponse = [
  {
    id: 'abcd-0205',
    created: '2021-05-11T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a262',
    content: 'This is short Comment from someone else',
  },
  {
    id: 'abcd-0204',
    created: '2021-05-10T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a262',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur rem voluptates corporis, sint cupiditate pariatur aut veritatis. Facere, molestias natus, eos fuga ipsum, doloremque quae expedita numquam recusandae sint sequi possimus provident sed ullam culpa. Earum dolor a corporis cumque porro vero assumenda aspernatur quod consectetur, odit blanditiis debitis ratione.',
  },
  {
    id: 'abcd-0283',
    created: '2021-05-06T21:04:20.311Z',
    ownerName: 'AlertableSOR',
    ownerId: '',
    content: 'Status of alert was changed from REVIEWED to FALSE_POSITIVE by user: test@test.com',
  },
  {
    id: 'abcd-0263',
    created: '2021-05-09T21:04:20.311Z',
    ownerName: 'AlertableSOR',
    ownerId: '',
    content: 'Status of alert was changed from IN_PROGRESS to REVIEWED by user: test@test.com',
  },
  {
    id: 'abcd-0273',
    created: '2021-05-09T21:04:20.311Z',
    ownerName: 'AlertableSOR',
    ownerId: '',
    content: 'Status of alert was changed from NEW to IN_PROGRESS by user: test@test.com',
  },
  {
    id: 'abcd-0202',
    created: '2021-05-05T21:04:20.311Z',
    ownerName: 'AlertableSOR',
    ownerId: '',
    content: 'New alert was created',
  },
  {
    id: 'abcd-02041',
    created: '2021-05-07T21:04:20.312Z',
    ownerName: 'Chris Vagras',
    ownerId: '17c29e5a473b4260a0035cc8eb37a261',
    content: 'This is short Comment created by me',
  },
  {
    id: 'abcd-02042',
    created: '2021-05-06T21:04:20.312Z',
    ownerName: 'Chris Vagras',
    ownerId: '17c29e5a473b4260a0035cc8eb37a261',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur rem voluptates corporis, sint cupiditate pariatur aut veritatis. Facere, molestias natus, eos fuga ipsum, doloremque quae expedita numquam recusandae sint sequi possimus provident sed ullam culpa. Earum dolor a corporis cumque porro vero assumenda aspernatur quod consectetur, odit blanditiis debitis ratione.',
  },
  {
    id: 'abcd-02043',
    created: '2021-05-10T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment3',
  },
  {
    id: 'abcd-02044',
    created: '2021-05-11T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment4',
  },
  {
    id: 'abcd-02045',
    created: '2021-05-12T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment5',
  },
  {
    id: 'abcd-02046',
    created: '2021-05-13T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment6',
  },
  {
    id: 'abcd-0207',
    created: '2021-05-14T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment7',
  },
  {
    id: 'abcd-0208',
    created: '2021-05-15T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment8',
  },
  {
    id: 'abcd-0209',
    created: '2021-05-16T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment9',
  },
  {
    id: 'abcd-020410',
    created: '2021-05-17T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment10',
  },
  {
    id: 'abcd-020411',
    created: '2021-05-18T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment11',
  },
  {
    id: 'abcd-020412',
    created: '2021-05-19T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment12',
  },
  {
    id: 'abcd-020413',
    created: '2021-05-20T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment13',
  },
  {
    id: 'abcd-020414',
    created: '2021-05-08T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment14',
  },
  {
    id: 'abcd-020416',
    created: '2021-05-08T21:04:20.312Z',
    ownerName: 'John Doe',
    ownerId: '17c29e5a473b4260a0035cc8eb37a265',
    content: 'This is short Comment16',
  },
]

export const getPersonaTenantAlertsCountResponse = query => {
  const { toTime, interval, alertableType } = query

  const endTime = new Date(toTime)
  const isLast24Hours = interval === 'hour'
  const dataSetSize = isLast24Hours ? 24 : 30
  const hoursCount = isLast24Hours ? 1 : 24

  const alertTypeIndex = PERSONA_EVENT_IDENTIFIERS.findIndex(value => value == alertableType)

  const values = []

  for (let i = 0; i <= dataSetSize; i++) {
    const timestamp = new Date(endTime)
    timestamp.setHours(timestamp.getHours() - i * hoursCount, 0, 0, 0)
    // get different bounds depending on the alert type
    const count = getRandomIntNumber(250 * (alertTypeIndex + 1), 250 * (alertTypeIndex + 2))

    values.unshift({ timestamp, count })
  }

  return { count: values }
}
