//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
const mockBuckets = [
  {
    key: 'AtuX3Hyj9T28ymX60FobmRM=',
    traffic: {
      bytes_total: 2700,
    },
  },
  {
    key: 'AgXYu1xX2ZBZ8iQsZJ61RLA=',
    traffic: {
      bytes_total: 1804,
    },
  },
  {
    key: 'BtuP3Lyj9T28ymX60FobmUI=',
    traffic: {
      bytes_total: 4510,
    },
  },
]

const mockUserInfo = [
  {
    ecoId: 'AtuX3Hyj9T28ymX60FobmRM=',
    displayName: 'hubert-blaine',
  },
  {
    ecoId: 'AgXYu1xX2ZBZ8iQsZJ61RLA=',
    displayName: 'uncle-bob',
  },
  {
    ecoId: 'BtuP3Lyj9T28ymX60FobmUI=',
    displayName: 'test-user3',
  },
]

export const aggregatedTopUsersBandwidthMock = {
  tenant: {
    public: {
      buckets: [mockBuckets[0], mockBuckets[1]],
      userInfo: [mockUserInfo[0], mockUserInfo[1]],
    },
    private: {
      buckets: [mockBuckets[2]],
      userInfo: [mockUserInfo[2]],
    },
    all: {
      buckets: mockBuckets,
      userInfo: mockUserInfo,
    },
  },
}
