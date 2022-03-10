/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, MenuItem, TextField } from '@material-ui/core'

import { MobileProtectData } from '@ues-data/mtd'
import { Permission, usePermissions, usePrevious } from '@ues-data/shared'
import { DialogChildren } from '@ues/behaviours'

export interface DevCertModalDialogProps {
  openDialog: boolean
  inputValue?: MobileProtectData.IDeveloperCertificate
  iosEnabled?: boolean
  onClose?: () => void
  onFormSubmit?: (devCert: MobileProtectData.IDeveloperCertificate) => void
  headerTitle?: string
  submitBtnTitle?: string
  isEditMode?: boolean
}

const DevCertModalDialog: React.FC<DevCertModalDialogProps> = ({
  openDialog,
  inputValue,
  iosEnabled = true,
  onClose: onDialogClose,
  onFormSubmit,
  headerTitle,
  submitBtnTitle,
  isEditMode = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  //translations
  const { t } = useTranslation(['mtd/common'])
  const { hasPermission } = usePermissions()
  const REQUIRED_FIELD_ERR_MSG = t('exclusion.form.requiredField')

  type FormValues = {
    name: string
    platform: string
    subject: string
    issuer: string
    identifier: string
    description: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      name: inputValue?.name ?? '',
      platform: inputValue?.platform ?? 'ANDROID',
      subject: inputValue?.subject ?? '',
      issuer: inputValue?.issuer ?? '',
      identifier: inputValue?.identifier ?? '',
      description: inputValue?.description ?? '',
    },
  })

  //controlledDialog hook and resetting form data to passed from input
  const openPrev = usePrevious(openDialog)
  useEffect(() => {
    if (openDialog && !openPrev) {
      reset({
        name: inputValue?.name ?? '',
        platform: inputValue?.platform ?? 'ANDROID',
        subject: inputValue?.subject ?? '',
        issuer: inputValue?.issuer ?? '',
        identifier: inputValue?.identifier ?? '',
        description: inputValue?.description ?? '',
      })
      setManualMode(inputValue?.source == MobileProtectData.DeveloperCertificateSourceType.Manual)
      setParsedFileMode(inputValue?.source == MobileProtectData.DeveloperCertificateSourceType.AppFile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog])

  //useState to manipulate form data
  const [manualMode, setManualMode] = useState(false)
  const [parsedFileMode, setParsedFileMode] = useState(false)

  //data block
  const onSubmitFunc = data => {
    // if it is edit functionality use original values for guid, tenantGuid (then should exist in inputValue)
    const submitData = {
      ...data,
      source: inputValue?.source ?? 'MANUAL',
      ...(inputValue?.guid && { guid: inputValue.guid }),
      ...(inputValue?.tenantGuid && { tenantGuid: inputValue.tenantGuid }),
    }
    onFormSubmit(submitData)
  }

  const isNotEmpty: (value) => boolean = value => {
    return value?.trim().length > 0 ?? false
  }

  return (
    <Dialog open={openDialog} onClose={onDialogClose} maxWidth={'sm'} fullWidth>
      <DialogChildren
        title={headerTitle}
        content={
          <>
            <TextField
              id="name"
              name="name"
              required
              label={t('exclusion.developers.name')}
              fullWidth
              size="small"
              inputRef={register({ validate: { required: value => isNotEmpty(value) } })}
              error={!!errors.name}
              helperText={errors.name && REQUIRED_FIELD_ERR_MSG}
              disabled={
                inputValue?.source === MobileProtectData.AppInfoSourceType.System ||
                (isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE))
              }
              inputProps={{ maxLength: 256 }}
            />

            <Controller
              as={
                <TextField
                  select
                  required
                  id="osSelect"
                  label={t('exclusion.developers.os')}
                  size="small"
                  disabled={
                    (isEditMode
                      ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                      : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)) ||
                    manualMode ||
                    parsedFileMode ||
                    !iosEnabled
                  }
                >
                  <MenuItem id="android" key="android" value="ANDROID">
                    {t('common.osAndroid')}
                  </MenuItem>
                  {iosEnabled && (
                    <MenuItem id="ios" key="ios" value="IOS">
                      {t('common.osIOS')}
                    </MenuItem>
                  )}
                </TextField>
              }
              name="platform"
              rules={{ required: true }}
              control={control}
            />

            <TextField
              id="subject"
              name="subject"
              label={t('exclusion.developers.subject')}
              fullWidth
              size="small"
              inputRef={register}
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputProps={parsedFileMode ? { readonly: 'true' } : { maxLength: 256 }}
            />

            <TextField
              id="issuer"
              name="issuer"
              required
              label={t('exclusion.developers.issuer')}
              fullWidth
              size="small"
              inputRef={register({ validate: { required: value => isNotEmpty(value) } })}
              error={!!errors.issuer}
              helperText={errors.issuer && REQUIRED_FIELD_ERR_MSG}
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputProps={parsedFileMode ? { readonly: 'true' } : { maxLength: 256 }}
            />

            <TextField
              id="identifier"
              name="identifier"
              required
              label={t('exclusion.developers.identifier')}
              fullWidth
              size="small"
              inputRef={register({ validate: { required: value => isNotEmpty(value) } })}
              error={!!errors.identifier}
              helperText={errors.identifier && REQUIRED_FIELD_ERR_MSG}
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputProps={parsedFileMode ? { readonly: 'true' } : { maxLength: 2048 }}
            />
            <TextField
              id="description"
              name="description"
              label={t('exclusion.developers.description')}
              fullWidth
              size="small"
              inputRef={register}
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputProps={{ maxLength: 2048 }}
            />
          </>
        }
        onClose={onDialogClose}
        actions={
          (isEditMode
            ? hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
            : hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)) && (
            <>
              <Button variant="outlined" onClick={onDialogClose}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit(onSubmitFunc)}
                disabled={parsedFileMode ? isEditMode && !isDirty : !isDirty}
              >
                {submitBtnTitle ?? t('common.add')}
              </Button>
            </>
          )
        }
      />
    </Dialog>
  )
}

export default DevCertModalDialog
