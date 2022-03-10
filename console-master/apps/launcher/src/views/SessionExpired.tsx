import type { To } from 'history'
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Button, Dialog } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

const SessionExpired: React.FC<{ to: To }> = memo(({ to }) => {
  const { t } = useTranslation('launcher')
  const navigate = useNavigate()

  const onClose = useCallback(() => {
    navigate(to)
  }, [navigate, to])

  return (
    <Dialog open onClose={onClose}>
      <DialogChildren
        title={t('sessionExpiredTitle')}
        onClose={onClose}
        content={t('sessionExpiredMessage')}
        actions={
          <Button color="primary" type="submit" onClick={onClose}>
            Sign In
          </Button>
        }
      />
    </Dialog>
  )
})

export default SessionExpired
