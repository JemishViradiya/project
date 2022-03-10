export const NOTIFICATION_ERROR = '@Cylance/notification/NOTIFICATION_ERROR'
export const NOTIFICATION_SUCCESS = '@Cylance/notification/NOTIFICATION_SUCCESS'
export const NOTIFICATION_WARNING = '@Cylance/notification/NOTIFICATION_WARNING'

export const createErrorNotification = (message, response) => ({
  type: NOTIFICATION_ERROR,
  payload: { message, response },
})

export const createSuccessNotification = (message, response) => ({
  type: NOTIFICATION_SUCCESS,
  payload: { message, response },
})

export const createWarningNotification = (message, response) => ({
  type: NOTIFICATION_WARNING,
  payload: { message, response },
})
