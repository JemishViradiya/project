/* eslint-disable react/jsx-no-useless-fragment */
import type { CSSProperties } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useMock } from '@ues-data/shared'
import { AccessError, DisplayableError, ServiceWorkerError } from '@ues-data/shared-types'

import DefaultFallback from './Error/DefaultFallback'
import { InternalErrorRedirect, NotFoundErrorRedirect } from './ErrorRedirect'

const mockFooterStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
}
const MockErrorDisplay: React.FC<{ type: string; message: string }> = ({ type, message }) => {
  const { t } = useTranslation('access')
  return (
    <>
      <h1 className="error">{t(`errors.${type}.title`)}</h1>
      <br />
      <p>{t(`errors.${type}.description`)}</p>
      <br />
      <pre>{message}</pre>
      <footer style={mockFooterStyle}>
        <p>
          This message is only shown <i>in mock mode</i>
        </p>
      </footer>
    </>
  )
}

export const RootErrorHandler = ({ error }: { error?: Error }): JSX.Element => {
  const mock = useMock()
  console.warn('mock', mock)
  if (error instanceof AccessError)
    return mock ? <MockErrorDisplay type="notFound" message={error.message} /> : <NotFoundErrorRedirect />
  else if (error instanceof ServiceWorkerError) return <h3>{error.message}</h3>
  else if (error instanceof DisplayableError) {
    return mock ? <MockErrorDisplay type="internal" message={error.message} /> : <InternalErrorRedirect />
  } else {
    return <DefaultFallback />
  }
}
