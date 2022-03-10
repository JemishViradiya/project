import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Button, FormControlLabel, Paper, Switch, TextField, Typography } from '@material-ui/core'

import type { Group } from '@ues-data/platform'
import { useInputFormControlStyles } from '@ues/assets'
import { FormButtonPanel } from '@ues/behaviours'

import type { GroupPoliciesTableProps } from './PoliciesTable'
import { PoliciesTable } from './PoliciesTable'
import { paperStyles } from './styles'

type FormData = {
  description: string
  isOnboardingEnabled: boolean
  isNestingEnabled: boolean
}

export const DirectoryGroupSection = ({
  group,
  readonly = false,
  isOnboardingSupported,
  onSubmitAction,
  policiesProps,
}: {
  group: Group
  readonly?: boolean
  isOnboardingSupported?: boolean
  onSubmitAction: (g: Group) => void
  policiesProps: GroupPoliciesTableProps
}) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()
  const { root } = useInputFormControlStyles()
  const { paper } = paperStyles()

  const defaultValues = useMemo(
    () => ({
      description: group?.description ? group.description : '',
      isOnboardingEnabled: group?.isOnboardingEnabled ? group.isOnboardingEnabled : false,
      isNestingEnabled: group?.isNestingEnabled ? group.isNestingEnabled : false,
    }),
    [group],
  )
  const { register, handleSubmit, formState, setValue, watch, reset } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues,
  })

  const onSubmit = handleSubmit((value: FormData) => {
    onSubmitAction({
      ...group,
      description: value.description,
      isOnboardingEnabled: value.isOnboardingEnabled,
      isNestingEnabled: value.isNestingEnabled,
    })
  })

  const onChange = event => {
    setValue(event.target.name, event.target.checked)
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const { isOnboardingEnabled, isNestingEnabled } = watch()

  return (
    <form onSubmit={onSubmit}>
      <Paper variant="outlined" className={paper} role="region" aria-label={t('groups.generalInformation')}>
        <Typography variant="h2">{t('groups.generalInformation')}</Typography>
        <TextField
          fullWidth
          size="small"
          id="directorySource"
          value={group?.dataSourceName}
          classes={{ root }}
          label={t('groups.directorySource')}
          disabled
        />
        <TextField
          fullWidth
          id="groupName"
          size="small"
          value={group?.name}
          classes={{ root }}
          label={t('groups.directoryGroupName')}
          disabled
        />
        <TextField
          fullWidth
          id="description"
          name="description"
          size="small"
          classes={{ root }}
          label={t('groups.description')}
          disabled={readonly}
          autoComplete="off"
          inputRef={register}
        />
      </Paper>
      <Paper variant="outlined" className={paper} role="region" aria-label={t('groups.onboarding')}>
        <Typography variant="h2">{t('groups.onboarding')}</Typography>
        {isOnboardingSupported && (
          <FormControlLabel
            control={
              <Switch name="isOnboardingEnabled" checked={isOnboardingEnabled ?? false} onChange={onChange} inputRef={register} />
            }
            label={t('groups.enableOnboarding')}
            disabled={readonly}
          />
        )}
        <FormControlLabel
          control={<Switch name="isNestingEnabled" checked={isNestingEnabled ?? false} onChange={onChange} inputRef={register} />}
          label={t('groups.nestedDirectoryGroups')}
          disabled={readonly}
        />
      </Paper>

      <PoliciesTable {...policiesProps} readonly={readonly} />

      <FormButtonPanel show={!group?.id || formState.isDirty}>
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
