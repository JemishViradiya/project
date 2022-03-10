/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect } from 'react'

import { Button, Dialog, FormControl, makeStyles } from '@material-ui/core'
import FormHelperText from '@material-ui/core/FormHelperText'

import { queryDeviceModels } from '@ues-data/mtd'
import { Permission, usePermissions, useStatefulApolloQuery } from '@ues-data/shared'

import { getI18Name, useTranslation } from './i18n'
import PolicySwitch from './policySwitch'
import { useReference } from './reference'
import type { OS_FAMILY } from './settings'
import { FORM_REFS } from './settings'
import useStyles from './styles'
import { useDeviceModelSelectDialog } from './useDeviceModelSelectDialog'
import { useFormValidation } from './validate'

type DeviceModelSelectionProps = {
  name: string
  handleChange: () => void
  values: any
  errors: any
  disabled: boolean
  osFamily: OS_FAMILY
  submitClicked: boolean
}
const useDeviceModelStyles = makeStyles(() => ({
  editButton: {
    marginRight: '8px',
  },
  viewButton: {
    marginLeft: '8px',
  },
}))

const DeviceModelSelection = React.memo(
  ({ name, handleChange, values, errors, disabled, osFamily, submitClicked }: DeviceModelSelectionProps) => {
    const { t } = useTranslation()
    const formValidation = useFormValidation()
    const { setRef, getRef } = useReference()
    const classes = useStyles()
    const deviceModelClasses = useDeviceModelStyles()
    const { hasPermission } = usePermissions()

    const switchName = name + 'Enabled'
    const listName = name + 'List'
    const addDialogName = name + 'AddDialog'
    const viewDialogName = name + 'ViewDialog'

    const addWarningMethodRequiredLabel = useCallback(
      errorName => {
        if (submitClicked && errors && errors[errorName] !== undefined) {
          return <FormHelperText>{t(getI18Name(`${errorName}Required`))}</FormHelperText>
        }
      },
      [t, submitClicked, errors],
    )

    const { data: data_devicemodel, error: error_devicemodel, loading: loading_devicemodel } = useStatefulApolloQuery(
      queryDeviceModels,
      {
        variables: { osFamily: osFamily },
      },
    )

    useEffect(() => {
      formValidation.validateApolloQuery(
        loading_devicemodel,
        error_devicemodel,
        data_devicemodel?.deviceModels,
        'deviceHardwareLoadingErrorMessage',
      )
    }, [data_devicemodel, error_devicemodel, loading_devicemodel, formValidation])

    const setSearchTerm = () => {
      // do nothing
    }
    const assign = deviceModels => {
      getRef(FORM_REFS.FORMIK_BAG).setFieldValue(listName, deviceModels, true)
    }

    const editDialog = useDeviceModelSelectDialog({
      data: data_devicemodel?.deviceModels ?? [],
      loading: loading_devicemodel,
      handleSearch: setSearchTerm,
      submitAssignment: assign,
      selected: values && values[listName] ? values[listName] : [],
      readOnly: false,
    })

    const viewDialog = useDeviceModelSelectDialog({
      data: data_devicemodel?.deviceModels ?? [],
      loading: loading_devicemodel,
      selected: values && values[listName] ? values[listName] : [],
      readOnly: true,
    })

    return (
      <div>
        <PolicySwitch
          name={switchName}
          handleChange={handleChange}
          checked={values[switchName]}
          disabled={disabled}
          additionalLabel
          includeNotification
          values={values}
        />
        {values[switchName] && (
          <FormControl
            ref={el => setRef(listName as FORM_REFS, el)}
            component="fieldset"
            disabled={disabled}
            onChange={handleChange}
            error={errors && errors[listName] !== undefined}
            focused={false}
            margin="dense"
          >
            <div className={`${classes.indent} ${classes.separatorThinTop}`}>
              <div className={`${classes.containerRow}`}>
                {!disabled && (
                  <Button
                    variant="contained"
                    color="primary"
                    title={t(`policy.${osFamily}EditUnsupportedDeviceModelLabel`)}
                    className={deviceModelClasses.editButton}
                    disabled={disabled || !values[switchName]}
                    onClick={() => {
                      editDialog.setDialogId(Symbol(addDialogName))
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  title={t(`policy.${osFamily}ViewUnsupportedDeviceModelLabel`)}
                  className={deviceModelClasses.viewButton}
                  onClick={() => {
                    viewDialog.setDialogId(Symbol(viewDialogName))
                  }}
                >
                  {t('common.view')}
                </Button>
              </div>
              {addWarningMethodRequiredLabel(listName)}
            </div>
          </FormControl>
        )}
        <Dialog key={addDialogName} {...editDialog.dialogOptions} />
        <Dialog key={viewDialogName} {...viewDialog.dialogOptions} />
      </div>
    )
  },
)

export default DeviceModelSelection
