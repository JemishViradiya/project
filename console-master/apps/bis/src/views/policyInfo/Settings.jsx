import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import TextField from '@material-ui/core/TextField'

import { useFormButtons } from '@ues-bis/shared'

import AvailableActionsProvider from '../../providers/AvailableActionsProvider'
import DynamicsOverrideProfilesProvider from '../../providers/DynamicsOverrideProfilesProvider'
import ITPolicyOverrideProfilesProvider from '../../providers/ITPolicyOverrideProfilesProvider'
import LocalGroupsProvider from '../../providers/LocalGroupsProvider'
import { Button, ButtonPanel, Container, Section, StandaloneCapability as capability, useCapability } from '../../shared'
import RiskEngineTablesContainer from './RiskEngineTablesContainer'
import styles from './Settings.module.less'

const MAX_INPUT_CHARS = 250
const NON_WHITESPACE_CHAR_REQUIRED_REGEX = /.*\S.*/

const Settings = memo(({ defaultValue, onSave, onCancel }) => {
  const { t } = useTranslation()

  const nameValidation = {
    required: t('common.errorInvalidName'),
    pattern: {
      value: NON_WHITESPACE_CHAR_REQUIRED_REGEX,
      message: t('common.errorInvalidName'),
    },
    maxLength: {
      value: MAX_INPUT_CHARS,
      message: t('common.nameInvalid', { max: MAX_INPUT_CHARS }),
    },
  }

  const descriptionValidation = {
    maxLength: {
      value: MAX_INPUT_CHARS,
      message: t('common.descriptionInvalid', { max: MAX_INPUT_CHARS }),
    },
  }

  const [canEdit] = useCapability(capability.POLICIES)

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultValue,
    criteriaMode: 'all',
  })
  const {
    register,
    errors,
    control,
    formState: { isSubmitting },
  } = formMethods

  const { resetDisabled, onReset, submitDisabled, onSubmit } = useFormButtons(formMethods, isSubmitting, onSave)

  return (
    <form onSubmit={onSubmit} noValidate>
      <Container>
        <Section>
          <LocalGroupsProvider>
            <DynamicsOverrideProfilesProvider>
              <ITPolicyOverrideProfilesProvider>
                <AvailableActionsProvider>
                  <div className={styles.metadata}>
                    <TextField
                      id="name"
                      className={styles.metadataInputName}
                      name="name"
                      required
                      label={t('common.name')}
                      defaultValue={defaultValue.name}
                      helperText={errors.name && t(errors.name.message, { max: MAX_INPUT_CHARS })}
                      error={!!errors.name}
                      inputRef={register(nameValidation)}
                      disabled={!canEdit}
                    />
                    <TextField
                      id="description"
                      className={styles.metadataInputDescription}
                      name="description"
                      label={t('common.description')}
                      defaultValue={defaultValue.description}
                      helperText={errors.description && t(errors.description.message, { max: MAX_INPUT_CHARS })}
                      error={!!errors.description}
                      inputRef={register(descriptionValidation)}
                      disabled={!canEdit}
                    />
                  </div>
                  <Controller control={control} name="policyData" render={RiskEngineTablesContainer} />
                </AvailableActionsProvider>
              </ITPolicyOverrideProfilesProvider>
            </DynamicsOverrideProfilesProvider>
          </LocalGroupsProvider>
        </Section>
      </Container>
      {canEdit && (
        <ButtonPanel
          buttons={[
            <Button disabled={!onCancel && resetDisabled} onClick={onCancel || onReset}>
              {t('common.cancel')}
            </Button>,
            <Button.Confirmation color="primary" disabled={submitDisabled} type="submit" loading={isSubmitting}>
              {t('common.save')}
            </Button.Confirmation>,
          ]}
        />
      )}
    </form>
  )
})
Settings.displayName = 'PolicyInfoSettings'
Settings.propTypes = {
  id: PropTypes.string,
  defaultValue: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default Settings
