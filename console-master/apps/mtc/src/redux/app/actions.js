export const ENVIRONMENT_SET = '@Cylance/app-metadata/ENVIRONMENT_SET'
export const MOCK_MODE_SET = '@Cylance/app-metadata/MOCK_MODE_SET'

export const setEnvironment = host => ({
  type: ENVIRONMENT_SET,
  payload: host,
})

export const setMockModeOn = () => ({
  type: MOCK_MODE_SET,
  payload: true,
})

export const setMockModeOff = () => ({
  type: MOCK_MODE_SET,
  payload: false,
})
