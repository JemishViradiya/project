/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, TextField, useTheme } from '@material-ui/core'

import type { MobileProtectData } from '@ues-data/mtd'
import { Permission, usePermissions, usePrevious } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import { DialogChildren } from '@ues/behaviours'

export interface DomainModalDialogProps {
  openDialog: boolean
  inputValue?: MobileProtectData.IWebAddress
  onClose?: () => void
  onFormSubmit?: (domain: MobileProtectData.IWebAddress) => void
  headerTitle?: string
  submitBtnTitle?: string
  isEditMode?: boolean
}

const DomainModalDialog: React.FC<DomainModalDialogProps> = ({
  openDialog,
  inputValue,
  onClose: onDialogClose,
  onFormSubmit,
  headerTitle,
  submitBtnTitle,
  isEditMode = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  //translations
  const { t } = useTranslation(['mtd/common'])
  const theme = useTheme()
  const { hasPermission } = usePermissions()
  const { iconButton, ...inputFormControlStyles } = useInputFormControlStyles(theme)
  const REQUIRED_FIELD_ERR_MSG = t('exclusion.form.requiredField')
  const HOST_INVALID_FIELD_ERR_MSG = t('exclusion.domains.hostValidation.invalidField')

  type FormValues = {
    domainAddress: string
    description: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      domainAddress: inputValue?.value ?? '',
      description: inputValue?.description ?? '',
    },
  })
  //controlledDialog hook and resetting form data to passed from input
  const openPrev = usePrevious(openDialog)
  useEffect(() => {
    if (openDialog && !openPrev) {
      reset({
        domainAddress: inputValue?.value ?? '',
        description: inputValue?.description ?? '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog])

  const isNotEmpty: (value) => boolean = value => {
    return value?.trim().length > 0 ?? false
  }

  const hostValidSymbols: (value) => boolean = value => {
    const validateHostnameRegexp = '(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)'
    return new RegExp(validateHostnameRegexp).test(value)
  }

  //data block
  const onSubmitFunc = data => {
    // if it is edit functionality use original values for guid, tenantGuid (then should exist in inputValue)
    const submitData: MobileProtectData.IWebAddress = {
      name: data.description,
      description: data.description,
      value: isNotEmpty(data.domainAddress) ? data.domainAddress : '',
      type: inputValue?.type,
      addressType: inputValue?.addressType,
      ...(inputValue?.guid && { guid: inputValue.guid }),
      ...(inputValue?.tenantGuid && { tenantGuid: inputValue.tenantGuid }),
    }
    onFormSubmit(submitData)
  }

  return (
    <Dialog open={openDialog} onClose={onDialogClose} maxWidth={'sm'} fullWidth>
      <DialogChildren
        title={headerTitle}
        content={
          <>
            <TextField
              fullWidth
              id="domainAddress"
              name="domainAddress"
              required
              label={t('exclusion.domains.domain')}
              classes={inputFormControlStyles}
              size="small"
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputRef={register({
                validate: {
                  required: value => isNotEmpty(value),
                  validSymbols: value => hostValidSymbols(value),
                },
              })}
              error={!!errors.domainAddress}
              helperText={
                (errors.domainAddress?.type === 'required' && REQUIRED_FIELD_ERR_MSG) ||
                (errors.domainAddress?.type === 'validSymbols' && HOST_INVALID_FIELD_ERR_MSG)
              }
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label={t('common.description')}
              classes={inputFormControlStyles}
              size="small"
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputRef={register}
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
              <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmitFunc)} disabled={!isDirty}>
                {submitBtnTitle ?? t('common.add')}
              </Button>
            </>
          )
        }
      />
    </Dialog>
  )
}

export default DomainModalDialog
