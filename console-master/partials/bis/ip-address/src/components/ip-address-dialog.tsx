import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { RegisterOptions } from 'react-hook-form'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, makeStyles, TextField } from '@material-ui/core'

import { Permission, usePermissions } from '@ues-data/shared'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import { TRANSLATIONS_NAMESPACES } from '../config'
import type { IpAddressEntry } from '../model'
import { formatIpAddressesString, getIpAddressesString, validateIpAddresses } from '../utils'

interface IpAddressDialogProps {
  onClose: () => void
  onSubmit: (entry: Partial<IpAddressEntry>, previous?: IpAddressEntry) => void
  isBlacklist?: boolean
  open?: boolean
  entry?: IpAddressEntry
  loading?: boolean
}

const useStyles = makeStyles(theme => ({
  modalInputContainer: {
    display: 'flex',
    flexFlow: 'column',
  },
  textareaWrapper: {
    position: 'relative',
  },
  outerTextField: {
    width: '100%',
    marginBottom: theme.spacing(0),
  },
}))

const DIALOG_ID = Symbol()

export const useIpAddressDialogHandlers = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{ dialogId: symbol | undefined; entry: IpAddressEntry | undefined }>({
    dialogId: undefined,
    entry: undefined,
  })

  const closeDialog = useCallback(() => setData({ dialogId: undefined, entry: undefined }), [])
  const openDialog = useCallback((entry?: IpAddressEntry) => setData({ dialogId: DIALOG_ID, entry }), [])

  const { open } = useControlledDialog({ dialogId: data.dialogId })

  return { openDialog, closeDialog, setLoading, dialogProps: { open, entry: data.entry, loading } }
}

export const IpAddressDialog: React.FC<IpAddressDialogProps> = ({
  entry,
  isBlacklist = false,
  onClose,
  onSubmit,
  open,
  loading = false,
}) => {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const nameLabel = t('bis/ues:settings.ipaddresses.name')
  const ipAddressLabel = t('bis/ues:settings.ipaddresses.ipAddressesLabel')

  const defaultValues = useMemo(
    () =>
      entry
        ? {
            name: entry.name,
            ipAddresses: getIpAddressesString(entry.ipAddresses),
          }
        : {
            name: '',
            ipAddresses: '',
          },
    [entry],
  )

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultValues,
    criteriaMode: 'all',
  })

  const {
    reset,
    errors,
    control,
    formState: { isValid, isDirty },
    handleSubmit,
  } = formMethods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const styles = useStyles()

  const validationRules = useMemo<Record<string, RegisterOptions>>(
    () => ({
      ipAddressesValidation: {
        required: {
          message: t('bis/ues:settings.ipaddresses.errorFieldRequired'),
          value: true,
        },
        validate: (ipAddresses: string): boolean | string =>
          validateIpAddresses(ipAddresses) || (t('bis/ues:settings.ipaddresses.invalidFormat') as string),
      },
      nameValidation: {
        required: {
          message: t('bis/ues:settings.ipaddresses.errorFieldRequired'),
          value: true,
        },
        pattern: {
          value: /.*\S.*/,
          message: t('bis/ues:settings.ipaddresses.errorInvalidName'),
        },
        maxLength: {
          value: 250,
          message: t('bis/ues:settings.ipaddresses.errorInvalidName'),
        },
      },
    }),
    [t],
  )

  const errorsMessages = useMemo(
    () => ({
      name: errors?.name?.message,
      ipAddresses: errors?.ipAddresses?.message,
    }),
    [errors?.name, errors?.ipAddresses],
  )

  const addLabel = useMemo(
    () =>
      isBlacklist
        ? t('bis/ues:settings.ipaddresses.untrustedAddModalLabel')
        : t('bis/ues:settings.ipaddresses.trustedAddModalLabel'),
    [isBlacklist, t],
  )
  const editLabel = useMemo(
    () =>
      isBlacklist
        ? t('bis/ues:settings.ipaddresses.untrustedEditModalLabel')
        : t('bis/ues:settings.ipaddresses.trustedEditModalLabel'),
    [isBlacklist, t],
  )
  const readOnlyLabel = useMemo(
    () =>
      isBlacklist ? t('bis/ues:settings.ipaddresses.untrustedModalLabel') : t('bis/ues:settings.ipaddresses.trustedModalLabel'),
    [isBlacklist, t],
  )

  const handleSubmission = useCallback(
    values => onSubmit({ ...values, ipAddresses: formatIpAddressesString(values.ipAddresses) }, entry),
    [entry, onSubmit],
  )

  const onSubmitForm = useMemo(() => handleSubmit(handleSubmission), [handleSubmission, handleSubmit])

  const { hasPermission } = usePermissions()

  const canCreate = hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_CREATE)
  const canUpdate = hasPermission(Permission.VENUE_SETTINGSGLOBALLIST_UPDATE)

  const isCreating = !entry
  const isSubmittable = isCreating ? canCreate : canUpdate

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogChildren
        title={isSubmittable ? (isCreating ? addLabel : editLabel) : readOnlyLabel}
        onClose={onClose}
        actions={
          isSubmittable ? (
            <>
              <Button variant="outlined" onClick={onClose}>
                {t('general/form:commonLabels.cancel')}
              </Button>
              <Button
                disabled={!isValid || loading || !isDirty || !isSubmittable}
                variant="contained"
                color="primary"
                onClick={onSubmitForm}
              >
                {t('general/form:commonLabels.save')}
              </Button>
            </>
          ) : (
            <Button variant="outlined" onClick={onClose}>
              {t('general/form:commonLabels.close')}
            </Button>
          )
        }
        content={
          <FormProvider {...formMethods}>
            <form noValidate>
              <div className={styles.modalInputContainer}>
                <Controller
                  control={control}
                  rules={validationRules.nameValidation}
                  name="name"
                  as={
                    <TextField
                      name="name"
                      disabled={loading || !isSubmittable}
                      type="text"
                      size="small"
                      required
                      id={nameLabel}
                      label={nameLabel}
                      error={!!errorsMessages.name}
                      helperText={errorsMessages.name}
                      fullWidth
                    />
                  }
                />
                <div className={styles.textareaWrapper}>
                  <Controller
                    control={control}
                    rules={validationRules.ipAddressesValidation}
                    name="ipAddresses"
                    as={
                      <TextField
                        name="ipAddresses"
                        disabled={loading || !isSubmittable}
                        multiline
                        className={styles.outerTextField}
                        rows={5}
                        rowsMax={15}
                        id={ipAddressLabel}
                        label={ipAddressLabel}
                        margin="none"
                        required
                        error={!!errorsMessages.ipAddresses}
                        helperText={errorsMessages.ipAddresses || t('bis/ues:settings.ipaddresses.ipAddressesSubLabel')}
                        fullWidth
                      />
                    }
                  />
                </div>
              </div>
            </form>
          </FormProvider>
        }
      />
    </Dialog>
  )
}
