/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Grid, Typography } from '@material-ui/core'

import { ArrowCaretDown, ArrowCaretRight } from '@ues/assets'

import DetailTextField from './DetailTextField'

const AdditionalUserDetailsForm = ({ userDetails }) => {
  const { t } = useTranslation(['platform/common'])
  const [additionalUserDetailsOpen, setAdditionalUserDetailsOpen] = useState(false)

  const handleAdditionalUserDetailsOpen = () => {
    setAdditionalUserDetailsOpen(prevState => !prevState)
  }

  return (
    <>
      <Grid item xs={12}>
        <Box pt={1}>
          <Typography variant="h2" onClick={handleAdditionalUserDetailsOpen} component={Button}>
            {additionalUserDetailsOpen ? <ArrowCaretDown /> : <ArrowCaretRight />}
            {t('users.add.additionalUserDetails')}
          </Typography>
        </Box>
      </Grid>
      {additionalUserDetailsOpen && (
        <Grid item xs={7}>
          <Grid container>
            <DetailTextField
              spacingSide="right"
              disabled
              id="department"
              value={userDetails.department}
              label={t('users.add.input.department')}
            />
            <DetailTextField spacingSide="left" disabled id="title" value={userDetails.title} label={t('users.add.input.title')} />
            <DetailTextField
              spacingSide="right"
              disabled
              id="company"
              value={userDetails.company}
              label={t('users.add.input.company')}
            />
            <DetailTextField
              spacingSide="left"
              disabled
              id="companyPhoneNumber"
              value={userDetails.companyPhoneNumber}
              label={t('users.add.input.companyPhoneNumber')}
            />
            <DetailTextField
              spacingSide="right"
              disabled
              id="homePhoneNumber"
              value={userDetails.homePhoneNumber}
              label={t('users.add.input.homePhoneNumber')}
            />
            <DetailTextField
              spacingSide="left"
              disabled
              id="mobilePhoneNumber"
              value={userDetails.mobilePhoneNumber}
              label={t('users.add.input.mobilePhoneNumber')}
            />
            <DetailTextField
              spacingSide="right"
              disabled
              id="street"
              value={userDetails.street}
              label={t('users.add.input.street')}
            />
            <DetailTextField spacingSide="left" disabled id="poBox" value={userDetails.poBox} label={t('users.add.input.poBox')} />
            <DetailTextField spacingSide="right" disabled id="city" value={userDetails.city} label={t('users.add.input.city')} />
            <DetailTextField spacingSide="left" disabled id="state" value={userDetails.state} label={t('users.add.input.state')} />
            <DetailTextField
              spacingSide="right"
              disabled
              id="postalCode"
              value={userDetails.postalCode}
              label={t('users.add.input.postalCode')}
            />
            <DetailTextField
              spacingSide="left"
              disabled
              id="country"
              value={userDetails.country}
              label={t('users.add.input.country')}
            />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default AdditionalUserDetailsForm
