import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { RootPolicyField } from '@ues-data/epp'
import { useInputFormControlStyles } from '@ues/assets'

import { validate } from './utils'

const GeneralInfo = ({ fields, values, textProps, errors, isDefaultPolicy }) => {
  const { t: translate } = useTranslation(['protect'])
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)

  // TODO: uncomment once rbac is available
  // const { hasRole } = useRbacManager()

  const isAdmin = true // hasRole(ROLE_ADMINISTRATOR)

  // render

  const renderErrorMessage = () => {
    const errorMessage = errors[fields[RootPolicyField.policy_name]]

    return cond([
      [
        () => errorMessage,
        () => (
          <Box position="absolute" mt={-4} data-autoid="policy-details-form-policy-name-input-error-message">
            <Typography variant="caption" color="error">
              {translate(errorMessage)}
            </Typography>
          </Box>
        ),
      ],
      [() => true, () => null],
    ])(undefined)
  }

  const renderEditablePolicyName = () => (
    <TextField
      fullWidth
      classes={{ root }}
      size="small"
      {...textProps({
        name: fields[RootPolicyField.policy_name],
        validateOnBlur: true,
        validate,
      })}
      label={translate('policyName')}
      inputProps={{
        'data-autoid': 'policy-details-form-policy-name-input',
      }}
      error={Boolean(errors[fields[RootPolicyField.policy_name]])}
    />
  )

  const renderReadOnlyPolicyName = () => (
    <div data-autoid="policy-details-form-policy-name-input-read-only">
      <Typography variant="body1">{values[fields[RootPolicyField.policy_name]]}</Typography>
    </div>
  )

  const renderPolicyName = cond([
    [() => isAdmin && !isDefaultPolicy, renderEditablePolicyName],
    [() => true, renderReadOnlyPolicyName],
  ])

  return (
    <>
      {renderPolicyName(undefined)}
      {renderErrorMessage()}
    </>
  )
}

export default GeneralInfo
