/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'

import { BasicEmail } from '@ues/assets'

export const ResendInvitation = ({ onResendInvitation }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])

  return (
    <Button startIcon={<BasicEmail />} variant="contained" color="primary" onClick={() => onResendInvitation()}>
      {t('users.actions.resendInvitation')}
    </Button>
  )
}
