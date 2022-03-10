import type { ReactNode } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

interface ContentPropTypes {
  children: ReactNode
}

const Content = ({ children }: ContentPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])

  return (
    <DialogContent>
      <Typography variant="body2" display="block">
        {translate('applicationControlAddExclusionMessage')}
      </Typography>
      <Box pt={4}>{children}</Box>
    </DialogContent>
  )
}

export default Content
