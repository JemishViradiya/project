/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export const getNonLocalizedDate = dateString => {
  const dateObject = new Date(dateString)
  const date = dateObject.toLocaleDateString()
  const time = dateObject.toLocaleTimeString()
  const timezone = dateObject.getTimezoneOffset() / 60

  const timezoneWithSign = timezone < 0 ? timezone : `+${timezone}`
  return `${date} ${time} (${timezoneWithSign} GMT)`
}
