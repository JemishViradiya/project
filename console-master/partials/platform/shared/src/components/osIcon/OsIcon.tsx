import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import type { BoxProps } from '@material-ui/core'
import { Box } from '@material-ui/core'

import { DeviceOs } from '@ues-data/platform/entities/types'
import { BrandAndroid, BrandApple } from '@ues/assets'

interface OsIconProps {
  os: DeviceOs
  boxProps?: Partial<BoxProps>
}

const osIcons = {
  [DeviceOs.IOS]: <BrandApple />,
  [DeviceOs.ANDROID]: <BrandAndroid />,
}

export const OsIcon: React.FC<OsIconProps> = memo((props: OsIconProps) => {
  const { os, boxProps = {} } = props
  const { t } = useTranslation('general/form')

  return os ? (
    <Box aria-label={t(`general/form:os.${os}`)} display="flex" alignItems="center" {...boxProps}>
      {osIcons[os]}
    </Box>
  ) : null
})
