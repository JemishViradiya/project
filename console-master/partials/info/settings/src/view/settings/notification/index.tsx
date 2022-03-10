/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { isEqual } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import { TenantSettings } from '@ues-data/dlp'
import { Permission, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { FormButtonPanel, Loading, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'
import { ENQUEUE_TYPE } from '../shared/notification'
import makeStyles from './styles'

const NotificationSettings: React.FC = () => {
  useSecuredContent(Permission.BIP_SETTINGS_READ)
  const { canUpdate } = useDlpSettingsPermissions()
  const classes = makeStyles()
  const { t } = useTranslation(['dlp/common'])
  const snackbar = useSnackbar()

  const isEmailEnabledKey = 'ui.tenant.setting.isEmailEnabled'

  const { error, loading, data, refetch } = useStatefulReduxQuery(TenantSettings.fetchRemediationSettings)
  const [updateRemediationSettings, updateRemediationSettingsTask] = useStatefulReduxMutation(
    TenantSettings.mutationUpdateRemediationSettings,
  )
  const [remediationSettings, setRemediationSettings] = useState(data)

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('setting.unexpectedErrorMessage'), ENQUEUE_TYPE.ERROR)
    }
  }, [error, snackbar, t])

  // handling for "updating"
  const updateRemediationSettingsTaskPrev = usePrevious(updateRemediationSettingsTask)
  useEffect(() => {
    if (
      !updateRemediationSettingsTask.loading &&
      updateRemediationSettingsTaskPrev.loading &&
      updateRemediationSettingsTask.error
    ) {
      updateRemediationSettingsTask?.error.toString() === '400'
        ? snackbar.enqueueMessage(t('setting.notifications.invalid'), ENQUEUE_TYPE.ERROR)
        : snackbar.enqueueMessage(t('setting.unexpectedErrorMessage'), ENQUEUE_TYPE.ERROR)
    } else if (!updateRemediationSettingsTask.loading && updateRemediationSettingsTaskPrev.loading) {
      snackbar.enqueueMessage(t('setting.notifications.success'), ENQUEUE_TYPE.SUCCESS)
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRemediationSettingsTask])

  useEffect(() => {
    if (data) {
      setRemediationSettings(data)
    }
  }, [data])

  const onCancel = () => {
    setRemediationSettings(data)
  }

  return loading ? (
    <Loading />
  ) : (
    <Box className={classes.box}>
      <Typography variant="h2" className={classes.title}>
        {t('setting.notifications.title')}
      </Typography>

      <Form
        initialValues={{
          ...remediationSettings?.properties,
          'ui.tenant.setting.isEmailEnabled': remediationSettings?.properties[isEmailEnabledKey] === 'true',
        }}
        onSubmit={() => {
          updateRemediationSettings({ ...remediationSettings })
          setRemediationSettings(remediationSettings)
        }}
        fields={[
          {
            type: 'switch',
            label: t('setting.notifications.switcherLabel'),
            helpLabel: t('setting.notifications.switcherDescription'),
            name: 'ui.tenant.setting.isEmailEnabled',
            disabled: !canUpdate,
          },
          {
            type: 'text',
            label: t('setting.notifications.emailRecipients'),
            name: 'ui.tenant.setting.emailRecipients',
            helpLabel: t('setting.notifications.emailRecipientsHelperText'),
            disabled: !canUpdate,
          },
        ]}
        onChange={({ formValues }) => {
          const { isEmailEnabled, emailRecipients } = formValues?.ui?.tenant?.setting

          setRemediationSettings({
            properties: {
              'ui.tenant.setting.emailRecipients': emailRecipients,
              'ui.tenant.setting.isEmailEnabled': isEmailEnabled.toString(),
            },
          })
        }}
        hideButtons
      >
        {
          <FormButtonPanel show={!isEqual(data, remediationSettings)}>
            <Button variant="contained" onClick={onCancel} type="reset">
              {t('setting.buttons.cancel')}
            </Button>
            <Button color="secondary" variant="contained" type="submit" disabled={false}>
              {t('setting.buttons.save')}
            </Button>
          </FormButtonPanel>
        }
      </Form>
    </Box>
  )
}

export default NotificationSettings
