import React from 'react'
import { useTranslation } from 'react-i18next'

import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

const Title = (): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])

  return (
    <DialogTitle disableTypography>
      <Typography variant="h2">{translate('addExclusion')}</Typography>
    </DialogTitle>
  )
}

export default Title
