import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, CircularProgress, Typography, useTheme } from '@material-ui/core'

import { boxFlexCenterProps } from '@ues/assets'

interface PageProgressPropTypes {
  creating?: boolean
  fetching?: boolean
  updating?: boolean
  deleting?: boolean
  message?: string
}

const PageProgress = (props: PageProgressPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['general/form'])
  const theme = useTheme()

  const getMessage = (): string =>
    cond([
      [({ message }) => message, ({ message }) => message],
      [({ creating }) => creating, () => `${translate('commonLabels.creating')}`],
      [({ fetching }) => fetching, () => `${translate('commonLabels.retrieving')}`],
      [({ updating }) => updating, () => `${translate('commonLabels.updating')}`],
      [({ deleting }) => deleting, () => `${translate('commonLabels.deleting')}`],
      [() => true, () => `${translate('commonLabels.loading')}`],
    ])(props)

  return (
    <Box bgcolor={theme.palette.grey[200]} height="100%" width="100%" {...boxFlexCenterProps}>
      <Box p={6} borderRadius={2} bgcolor={theme.palette.common.white} flexDirection="column" {...boxFlexCenterProps}>
        <CircularProgress color="secondary" />
        <Box pt={4}>
          <Typography variant="body2" color="textSecondary">
            {getMessage()}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default PageProgress
