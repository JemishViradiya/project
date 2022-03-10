import React, { useCallback } from 'react'

import FormHelperText from '@material-ui/core/FormHelperText'

import { getI18Name, useTranslation } from './i18n'
import PolicySwitch from './policySwitch'
import { useReference } from './reference'
import SecurityPatchList from './securityPatchList'
import { FORM_REFS } from './settings'
import useStyles from './styles'

export default function AndroidSecurityPatch({ values, handleChange, writable, errors, submitClicked }) {
  const { setRef } = useReference()
  const { t } = useTranslation()
  const classes = useStyles()

  const addWarningMethodRequiredLabel = useCallback(
    errorName => {
      if (submitClicked && errors && errors[errorName] !== undefined) {
        return <FormHelperText error>{t(getI18Name(`${errorName}Required`))}</FormHelperText>
      }
    },
    [t, submitClicked, errors],
  )

  if (values.androidHwAttestationSecurityPatchEnabled === undefined) {
    values.androidHwAttestationSecurityPatchEnabled = values.androidHwAttestationSecurityPatchLevelList?.length > 0
  }

  return (
    <div ref={el => setRef(FORM_REFS.ANDROID_SECURITY_PATCH_LIST, el)}>
      <PolicySwitch
        name="androidHwAttestationSecurityPatchEnabled"
        handleChange={handleChange}
        checked={values.androidHwAttestationSecurityPatchEnabled}
        disabled={!values.androidHwAttestationEnabled || !writable}
        errors={errors}
        includeNotification
        values={values}
      />
      {values.androidHwAttestationSecurityPatchEnabled && (
        <SecurityPatchList
          name="androidHwAttestationSecurityPatchLevelList"
          handleChange={handleChange}
          values={values}
          disabled={!values.androidHwAttestationSecurityPatchEnabled || !values.androidHwAttestationEnabled || !writable}
          errors={errors}
        />
      )}
      {addWarningMethodRequiredLabel('androidHwAttestationSecurityPatchLevelList')}
    </div>
  )
}
