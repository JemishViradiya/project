import React, { useEffect } from 'react'

import { encodeRedirectUri } from '@ues-data/shared'

export const NotFoundErrorRedirect = (): JSX.Element => {
  useEffect(() => {
    window.location.replace('Error/NotFound?aspxerrorpath=' + encodeURIComponent(encodeRedirectUri()))
  })
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

export const InternalErrorRedirect = (): JSX.Element => {
  useEffect(() => {
    window.location.replace('Error/InternalError')
  })
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}
