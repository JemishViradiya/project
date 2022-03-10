import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Button, Dialog, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { Form as FormComponent } from '@ues-behaviour/hook-form'
import { CLASSIFICATION, DOMAIN_DEFAULT } from '@ues-data/dlp'
import { BasicInfo } from '@ues/assets'
import { DialogChildren, ProgressButton } from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../../useDlpSettingsPermissions'
import ValidateForm from './ValidateForm'

const validationSchema = t =>
  Yup.object().shape({
    domain: Yup.string()
      .required(t('setting.general.domain.validation.nameRequired'))
      .matches(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,3}$/, t('setting.general.domain.validation.invalidDomainName')),
  })

const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiDialogTitle-root button': {
      display: 'none',
    },
    '& .MuiDialog-paperWidthSm': {
      minWidth: theme.spacing(147),
    },
    '& .MuiFilledInput-multiline.MuiFilledInput-marginDense': {
      paddingTop: theme.spacing(3.5),
      paddingBottom: theme.spacing(0.5),
    },
    '& form': {
      marginBottom: theme.spacing(5),
      '& textarea': {
        height: `${theme.spacing(5)}px!important`,
      },
    },
  },
  validateBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  textResult: {
    display: 'flex',
  },
  validateIcon: {
    fontSize: `${theme.spacing(5)}px`,
    marginLeft: `${theme.spacing(1.5)}px`,
  },
}))

const GeneralDomainForm = ({ onCreate, onEdit, selectedItem, formOpen, setFormOpen }) => {
  const { t } = useTranslation(['dlp/common'])
  const classes = useStyles()
  const { canUpdate } = useDlpSettingsPermissions()
  const [localFormState, setLocalFormState] = useState(selectedItem || DOMAIN_DEFAULT)
  const [validateState, setValidateState] = useState(false)
  const [validateCounter, setValidateCounter] = useState(0)
  const [loadingValidateState, setLoadingValidateState] = useState(false)
  const [isSaveEnabled, setSaveEnabled] = useState(true)
  const [reservedDomainName, setReservedDomainName] = useState(localFormState?.domain)
  const isTrue = value => {
    return value === true || value === 'true'
  }
  const [initialGeneralDomainValues, setInitialGeneralDomainValues] = useState({
    domain: localFormState?.domain ?? '',
    description: localFormState?.description ?? '',
    enabled: isTrue(localFormState.enabled) ? true : false,
  })

  const isFormValid = t => {
    try {
      validationSchema(t).validateSync({ domain: localFormState?.domain })
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    setSaveEnabled(isFormValid(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFormState?.domain, t])

  const handleDialogClose = () => {
    setFormOpen(false)
  }

  return (
    <Dialog open={formOpen} className={classes.dialog}>
      <DialogChildren
        title={selectedItem ? t('setting.general.domain.dialog.title.edit') : t('setting.general.domain.dialog.title.newDomain')}
        onClose={handleDialogClose}
        content={
          <>
            <FormComponent
              initialValues={initialGeneralDomainValues}
              resolver={yupResolver(validationSchema(t))}
              fields={[
                {
                  type: 'text',
                  name: 'domain',
                  label: t('setting.general.domain.columns.domainName'),
                  disabled: selectedItem ? true : false,
                  required: true,
                },
                {
                  type: 'text',
                  name: 'description',
                  disabled: selectedItem && !canUpdate,
                  label: t('setting.general.domain.columns.description'),
                },
                {
                  type: 'switch',
                  name: 'enabled',
                  disabled: selectedItem && !canUpdate,
                  label: t('setting.general.domain.enabledSwitcher'),
                },
              ]}
              onChange={({ formValues }) => {
                setLocalFormState({
                  ...localFormState,
                  ...formValues,
                })
              }}
              hideButtons
            />

            <div className={classes.validateBlock}>
              <Typography className={classes.textResult}>
                {t('setting.general.domain.validation.verificationText')}
                <Tooltip title={t('setting.general.domain.validation.verificationToolTip')} placement="top">
                  <span>
                    <BasicInfo color="primary" className={classes.validateIcon} />
                  </span>
                </Tooltip>
              </Typography>
              <ProgressButton
                loading={loadingValidateState}
                variant="contained"
                color="primary"
                disabled={!isSaveEnabled}
                onClick={() => {
                  setValidateState(true)
                  setValidateCounter(validateCounter + 1)
                  setReservedDomainName(localFormState?.domain)
                }}
              >
                {t('setting.general.domain.buttons.verify')}
              </ProgressButton>
            </div>
            {validateState && reservedDomainName === localFormState?.domain && (
              <ValidateForm
                domainName={localFormState?.domain}
                validateCounter={validateCounter}
                setLoadingValidateState={setLoadingValidateState}
              />
            )}
          </>
        }
        actions={
          <>
            <Button variant="outlined" onClick={handleDialogClose}>
              {t('setting.general.domain.buttons.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                setFormOpen(false)
                if (selectedItem) {
                  onEdit(/* selectedItem.guid, */ localFormState)
                } else {
                  onCreate(localFormState)
                }
              }}
              disabled={!localFormState?.domain || !isSaveEnabled}
            >
              {selectedItem ? t('setting.general.domain.buttons.save') : t('setting.general.domain.buttons.add')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export default GeneralDomainForm
