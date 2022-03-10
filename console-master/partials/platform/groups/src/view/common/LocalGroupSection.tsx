import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Button, Paper, TextField, Typography } from '@material-ui/core'

import type { Group } from '@ues-data/platform'
import { useInputFormControlStyles } from '@ues/assets'
import { FormButtonPanel } from '@ues/behaviours'

import type { GroupPoliciesTableProps } from './PoliciesTable'
import { PoliciesTable } from './PoliciesTable'
import { paperStyles } from './styles'

type FormData = {
  name: string
  description: string
}

export const LocalGroupSection = ({
  group,
  readonly = false,
  onSubmitAction,
  policiesProps,
  externalErrors = [],
}: {
  group?: Group
  readonly?: boolean
  onSubmitAction: (g: Group) => void
  policiesProps: GroupPoliciesTableProps
  externalErrors?: any
}) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()
  const { root } = useInputFormControlStyles()
  const { paper } = paperStyles()

  const defaultValues = useMemo(
    () => ({
      name: group?.name ? group.name : '',
      description: group?.description ? group.description : '',
    }),
    [group],
  )
  const { handleSubmit, errors, formState, reset, control } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues,
  })

  const onSubmit = handleSubmit((value: FormData) => {
    onSubmitAction({
      ...group,
      name: value.name,
      description: value.description,
    })
  })

  const getErrorText = (fieldName: string) => {
    return (errors[fieldName] && t(`groups.add.local.${errors[fieldName].type}`)) || externalErrors[fieldName]
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form onSubmit={onSubmit} style={{ alignSelf: 'center' }}>
      <Paper variant="outlined" className={paper} role="region" aria-label={t('groups.generalInformation')}>
        <Typography variant="h2">{t('groups.generalInformation')}</Typography>
        <Controller
          control={control}
          name="name"
          defaultValue={defaultValues.description}
          rules={{ required: true, validate: { required: value => !!value.trim() } }}
          render={field => {
            return (
              <TextField
                {...field}
                id="name"
                fullWidth
                size="small"
                classes={{ root }}
                label={t('groups.groupName')}
                disabled={readonly}
                error={!!errors['name'] || !!externalErrors['name']}
                helperText={getErrorText('name')}
                autoComplete="off"
              />
            )
          }}
        />
        <Controller
          control={control}
          name="description"
          defaultValue={defaultValues.description}
          render={field => {
            return (
              <TextField
                {...field}
                id="description"
                fullWidth
                size="small"
                classes={{ root }}
                label={t('groups.description')}
                disabled={readonly}
                autoComplete="off"
              />
            )
          }}
        />
      </Paper>

      <PoliciesTable {...policiesProps} readonly={readonly} />

      <FormButtonPanel show={formState.isDirty}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t('general/form:commonLabels.cancel')}
        </Button>
        <Button color="primary" variant="contained" type="submit">
          {t('general/form:commonLabels.save')}
        </Button>
      </FormButtonPanel>
    </form>
  )
}
