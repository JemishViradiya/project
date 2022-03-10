/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, TextField, useTheme } from '@material-ui/core'

import type { MobileProtectData } from '@ues-data/mtd'
import { Permission, usePermissions, usePrevious } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import { DialogChildren } from '@ues/behaviours'

export interface IPAddressModalDialogProps {
  openDialog: boolean
  inputValue?: MobileProtectData.IWebAddress
  onClose?: () => void
  onFormSubmit?: (ipAddress: MobileProtectData.IWebAddress) => void
  headerTitle?: string
  submitBtnTitle?: string
  isEditMode?: boolean
}

const IPAddressModalDialog: React.FC<IPAddressModalDialogProps> = ({
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
  const IP_INVALID_SYMBOL_ERR_MSG = t('exclusion.webAddresses.ipValidation.invalidSymbol')
  const IP_FOUR_BLOCKS_REQUIRED_ERR_MSG = t('exclusion.webAddresses.ipValidation.fourBlocksRequired')
  const IP_INVALID_RANGES_ERR_MSG = t('exclusion.webAddresses.ipValidation.invalidRanges')
  const IP_START_EQ_END_ERR_MSG = t('exclusion.webAddresses.ipValidation.startEndEqual')
  const IP_START_NOT_LESS_THAN_END_ERR_MSG = t('exclusion.webAddresses.ipValidation.startShouldLessThanEnd')
  const IP_END_NOT_GREATER_THAN_END_ERR_MSG = t('exclusion.webAddresses.ipValidation.endShouldBeGreaterThanStart')
  //useState to manipulate form data
  const isIpStartGtEndTriggeredRef = useRef(false)
  //validation hook
  type FormValues = {
    start: string
    end: string
    description: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    getValues,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      start: inputValue?.value?.split('-', 2)[0] ?? '',
      end: inputValue?.value?.split('-', 2)[1] ?? '',
      description: inputValue?.description ?? '',
    },
  })
  //controlledDialog hook and resetting form data to passed from input
  const openPrev = usePrevious(openDialog)
  useEffect(() => {
    if (openDialog && !openPrev) {
      reset({
        start: inputValue?.value?.split('-', 2)[0] ?? '',
        end: inputValue?.value?.split('-', 2)[1] ?? '',
        description: inputValue?.description ?? '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog])

  const isNotEmpty: (value) => boolean = value => {
    return value?.trim().length > 0 ?? false
  }
  const ipValidSymbols: (value) => boolean = value => {
    return /^[\d|\\.]+$/.test(value)
  }
  const ipFourBlocksRequired: (value) => boolean = value => {
    return value.split('.').length === 4
  }
  const ipValidRanges: (value) => boolean = value => {
    const ipBlocks = value.split('.', 4)
    let validRangesCount = 0
    for (const ipBlock of ipBlocks) {
      if (parseInt(ipBlock) >= 0 && ipBlock <= 255) {
        validRangesCount++
      }
    }
    return validRangesCount === 4
  }
  const ipStartEndEq: (start, end) => boolean = (start, end) => {
    if (ipValidRanges(start) && ipValidRanges(end)) {
      return start === end
    }
    return false
  }
  const ipAsNumber: (ipAddress) => number = ipAddress => {
    return ipAddress
      .split('.')
      .map(p => parseInt(p))
      .reverse()
      .reduce((acc, val, i) => acc + val * 256 ** i, 0)
  }
  const ipEndGtThanStart: (start, end) => boolean = (start, end) => {
    return isNotEmpty(start) && isNotEmpty(end) ? ipAsNumber(end) > ipAsNumber(start) : false
  }

  //data block
  const onSubmitFunc = data => {
    // if it is edit functionality use original values for guid, tenantGuid (then should exist in inputValue)
    const submitData: MobileProtectData.IWebAddress = {
      name: data.description,
      description: data.description,
      value: isNotEmpty(data.end) ? data.start + '-' + data.end : data.start,
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
              name="start"
              required
              label={t('exclusion.webAddresses.ipAddressStart')}
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
                  validSymbols: value => ipValidSymbols(value),
                  fourBlocksRequired: value => ipFourBlocksRequired(value),
                  validRanges: value => ipValidRanges(value),
                  startLessThanEnd: value => {
                    const fieldStartIsNotEmpty = isNotEmpty(value)
                    const fieldEndIsNotEmpty = isNotEmpty(getValues('end'))
                    const isIpEndGtThanStart = ipEndGtThanStart(value, getValues('end'))
                    if (fieldEndIsNotEmpty && fieldStartIsNotEmpty) {
                      if (!isIpStartGtEndTriggeredRef.current) {
                        trigger('end')
                      }
                      isIpStartGtEndTriggeredRef.current = !isIpStartGtEndTriggeredRef.current
                    }
                    return !fieldEndIsNotEmpty || isIpEndGtThanStart
                  },
                },
              })}
              error={!!errors.start}
              helperText={
                (errors.start?.type === 'required' && REQUIRED_FIELD_ERR_MSG) ||
                (errors.start?.type === 'validSymbols' && IP_INVALID_SYMBOL_ERR_MSG) ||
                (errors.start?.type === 'fourBlocksRequired' && IP_FOUR_BLOCKS_REQUIRED_ERR_MSG) ||
                (errors.start?.type === 'validRanges' && IP_INVALID_RANGES_ERR_MSG) ||
                (errors.end?.type === 'startLessThanEnd' &&
                  isNotEmpty(getValues('start')) &&
                  isNotEmpty(getValues('end')) &&
                  ipStartEndEq(getValues('start'), getValues('end')) &&
                  IP_START_EQ_END_ERR_MSG) ||
                (errors.start?.type === 'startLessThanEnd' && IP_START_NOT_LESS_THAN_END_ERR_MSG)
              }
            />

            <TextField
              fullWidth
              name="end"
              label={t('exclusion.webAddresses.ipAddressEnd')}
              classes={inputFormControlStyles}
              size="small"
              disabled={
                isEditMode
                  ? !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)
                  : !hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
              }
              inputRef={register({
                validate: {
                  validSymbols: value => !isNotEmpty(value) || ipValidSymbols(value),
                  fourBlocksRequired: value => !isNotEmpty(value) || ipFourBlocksRequired(value),
                  validRanges: value => !isNotEmpty(value) || ipValidRanges(value),
                  startLessThanEnd: value => {
                    const fieldStartIsNotEmpty = isNotEmpty(getValues('start'))
                    const fieldEndIsNotEmpty = isNotEmpty(value)
                    const isIpEndGtThanStart = ipEndGtThanStart(getValues('start'), value)
                    if (fieldStartIsNotEmpty && fieldEndIsNotEmpty) {
                      if (!isIpStartGtEndTriggeredRef.current) {
                        trigger('start')
                      }
                      isIpStartGtEndTriggeredRef.current = !isIpStartGtEndTriggeredRef.current
                    }
                    return !fieldEndIsNotEmpty || (fieldStartIsNotEmpty && isIpEndGtThanStart)
                  },
                },
              })}
              error={!!errors.end}
              helperText={
                (errors.end?.type === 'validSymbols' && IP_INVALID_SYMBOL_ERR_MSG) ||
                (errors.end?.type === 'fourBlocksRequired' && IP_FOUR_BLOCKS_REQUIRED_ERR_MSG) ||
                (errors.end?.type === 'validRanges' && IP_INVALID_RANGES_ERR_MSG) ||
                (errors.end?.type === 'startLessThanEnd' &&
                  isNotEmpty(getValues('start')) &&
                  isNotEmpty(getValues('end')) &&
                  ipStartEndEq(getValues('start'), getValues('end')) &&
                  IP_START_EQ_END_ERR_MSG) ||
                (errors.end?.type === 'startLessThanEnd' && IP_END_NOT_GREATER_THAN_END_ERR_MSG)
              }
            />

            <TextField
              fullWidth
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
              error={!!errors.description}
              helperText={errors.description}
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

export default IPAddressModalDialog
