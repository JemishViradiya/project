import type { TFunction } from 'i18next'
import React, { memo } from 'react'

import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import { EmmConnectionRegistrationStatus } from '@ues-data/platform'
import { StatusMedium, StatusPending } from '@ues/assets'

export interface ConnectionProps {
  name: string
  status: EmmConnectionRegistrationStatus
  t: TFunction
}
const style = { fontSize: '1.25rem' }

export const Connection: React.FC<ConnectionProps> = memo(({ name, status, t }) => {
  const theme = useTheme()

  let statusIcon = null
  if (status === EmmConnectionRegistrationStatus.ERROR) {
    statusIcon = <StatusMedium key={name} style={style} />
  } else if (status === EmmConnectionRegistrationStatus.PENDING) {
    statusIcon = <StatusPending key={name} style={style} />
  }

  if (statusIcon !== null) {
    return (
      <Box display="flex" alignItems="center">
        <Box
          title={t(`emmConnection.status.${status}`)}
          aria-label={t(`emmConnection.statusAriaLabel`, { status: status })}
          pr={1}
          display="flex"
        >
          {statusIcon}
        </Box>
        <Box>{t(`emmConnection.type.${name}`)}</Box>
      </Box>
    )
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{t(`emmConnection.type.${name}`)}</>
})
